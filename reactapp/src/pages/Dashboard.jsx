import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getPlants } from "../services/plantService";
import { getTasks, completeTask } from "../services/taskService";
import { getHealthRecords } from "../services/healthRecordService";
import { getNotifications } from "../services/notificationService";
import { getPosts } from "../services/communityService";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Live Data States (Strictly Filtered for Logged-In User)
    const [plants, setPlants] = useState([]);
    const [dueTasks, setDueTasks] = useState([]);
    const [activeTreatmentsCount, setActiveTreatmentsCount] = useState(0);
    const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
    const [userDiscussions, setUserDiscussions] = useState([]);
    const [completingTaskId, setCompletingTaskId] = useState(null);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const userData = await getCurrentUser();
            setUser(userData);

            if (userData?.id) {
                const [
                    fetchedPlants,
                    fetchedTasks,
                    allHealthRecords,
                    fetchedNotifications,
                    allPosts,
                ] = await Promise.all([
                    getPlants(userData.id).catch(() => []),
                    getTasks(userData.id).catch(() => []),
                    getHealthRecords().catch(() => []),
                    getNotifications(userData.id).catch(() => []),
                    getPosts().catch(() => []),
                ]);

                // 1. User's Own Plants
                setPlants(fetchedPlants);
                const userPlantIds = new Set(fetchedPlants.map((p) => p.id));

                // 2. User's Due / Pending Care Tasks (STRICTLY for this user's plants)
                const userPendingTasks = fetchedTasks.filter(
                    (t) => userPlantIds.has(t.plantId) && !t.isCompleted
                );
                setDueTasks(userPendingTasks);

                // 3. User's Plants Under Treatment / Health Records
                const userRecords = allHealthRecords.filter((h) => userPlantIds.has(h.plantId));
                const activeConditions = userRecords.filter(
                    (r) => r.recoveryStatus && r.recoveryStatus.toLowerCase() !== "recovered"
                );
                setActiveTreatmentsCount(activeConditions.length);

                // 4. User's Unread Notifications Count
                const unread = fetchedNotifications.filter((n) => !n.isRead);
                setUnreadAlertsCount(unread.length);

                // 5. User's Own Community Posts & Discussions
                const myPosts = allPosts.filter((p) => p.userId === userData.id);
                myPosts.sort((a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0));
                setUserDiscussions(myPosts);
            }
        } catch (error) {
            console.error("Error loading user dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // 1-Click Complete Care Task from Dashboard
    const handleQuickCompleteTask = async (taskId) => {
        setCompletingTaskId(taskId);
        try {
            await completeTask(taskId);
            setDueTasks((prev) => prev.filter((t) => t.taskId !== taskId));
        } catch (err) {
            alert("Failed to complete task: " + err.message);
        } finally {
            setCompletingTaskId(null);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="dashboard-spinner"></div>
                <h3>Loading your botanical dashboard...</h3>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="dashboard-loading">
                <h3>Unable to load user profile. Please log in again.</h3>
                <button
                    className="dash-gold-btn"
                    style={{ marginTop: "15px" }}
                    onClick={() => navigate("/login")}
                >
                    Return to Login
                </button>
            </div>
        );
    }

    const todayDateStr = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="dashboard-container">
            {/* Hero Welcome Banner */}
            <div className="welcome-banner">
                <div className="welcome-text">
                    <span className="welcome-tagline">Botanical Management Overview</span>
                    <h1>Welcome back, {user.username}</h1>
                    <p>
                        Master the art of plant care. Track your automated care schedules
                        and botanical health diagnostics.
                    </p>
                </div>
                <div className="welcome-right-meta">
                    <div className="welcome-badge">
                        {user.role || "Gardener"}
                    </div>
                    <span className="welcome-date">{todayDateStr}</span>
                </div>
            </div>

            {/* Live Metrics Grid (6 Luxury Glass Cards with Gold Accents) */}
            <div className="dashboard-stats-grid">
                <div className="dash-stat-card" onClick={() => navigate("/plants")}>
                    <div className="dash-stat-info">
                        <span className="dash-stat-count">{plants.length}</span>
                        <span className="dash-stat-label">My Plants</span>
                    </div>
                    <span className="dash-stat-arrow">→</span>
                </div>

                <div className="dash-stat-card" onClick={() => navigate("/tasks")}>
                    <div className="dash-stat-info">
                        <span className="dash-stat-count">{dueTasks.length}</span>
                        <span className="dash-stat-label">Care Tasks Due</span>
                    </div>
                    <span className="dash-stat-arrow">→</span>
                </div>

                <div className="dash-stat-card" onClick={() => navigate("/health-records")}>
                    <div className="dash-stat-info">
                        <span className="dash-stat-count">{activeTreatmentsCount}</span>
                        <span className="dash-stat-label">Health Observations</span>
                    </div>
                    <span className="dash-stat-arrow">→</span>
                </div>

                <div className="dash-stat-card" onClick={() => navigate("/notifications")}>
                    <div className="dash-stat-info">
                        <span className="dash-stat-count">{unreadAlertsCount}</span>
                        <span className="dash-stat-label">Unread Alerts</span>
                    </div>
                    <span className="dash-stat-arrow">→</span>
                </div>

                <div className="dash-stat-card" onClick={() => navigate("/community")}>
                    <div className="dash-stat-info">
                        <span className="dash-stat-count">{userDiscussions.length}</span>
                        <span className="dash-stat-label">Community Threads</span>
                    </div>
                    <span className="dash-stat-arrow">→</span>
                </div>
            </div>

            {/* Two Column Layout: Today's Tasks & Community Activity */}
            <div className="dashboard-main-columns">
                {/* Column 1: Today's Due Care Tasks */}
                <div className="dash-section-card">
                    <div className="dash-section-header">
                        <div>
                            <h3>Your Week in Bloom</h3>
                            <p className="dash-section-sub">Care tasks due and pending action ({dueTasks.length})</p>
                        </div>
                        <button className="dash-view-all-link" onClick={() => navigate("/tasks")}>
                            View Schedule →
                        </button>
                    </div>

                    {dueTasks.length === 0 ? (
                        <div className="dash-empty-state">
                            <h4>All Tasks Complete</h4>
                            <p>All plant watering, fertilizing, and pruning schedules are up to date.</p>
                        </div>
                    ) : (
                        <div className="dash-tasks-list">
                            {dueTasks.slice(0, 5).map((task) => (
                                <div key={task.taskId} className="dash-task-item">
                                    <div className="dash-task-left">
                                        <div className="dash-task-bullet"></div>
                                        <div className="dash-task-details">
                                            <h4>{task.plantNickname || `Plant #${task.plantId}`}</h4>
                                            <span>
                                                {task.taskType} • Due:{" "}
                                                {task.dueDate
                                                    ? new Date(task.dueDate).toLocaleDateString(undefined, {
                                                          month: "short",
                                                          day: "numeric",
                                                      })
                                                    : "Today"}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="dash-task-done-btn"
                                        disabled={completingTaskId === task.taskId}
                                        onClick={() => handleQuickCompleteTask(task.taskId)}
                                    >
                                        {completingTaskId === task.taskId ? "Saving..." : "Mark Complete"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Column 2: My Posts */}
                <div className="dash-right-column">
                    {/* My Community Activity */}
                    <div className="dash-section-card">
                        <div className="dash-section-header">
                            <div>
                                <h3>Green Community Forum</h3>
                                <p className="dash-section-sub">My threads & garden discussions ({userDiscussions.length})</p>
                            </div>
                            <button className="dash-view-all-link" onClick={() => navigate("/community")}>
                                Community Hub →
                            </button>
                        </div>

                        <div className="dash-discussions-list">
                            {userDiscussions.length === 0 ? (
                                <div className="dash-empty-forum">
                                    <p>Share your botanical questions or care milestones with fellow plant growers.</p>
                                    <button
                                        className="dash-outline-btn"
                                        onClick={() => navigate("/community")}
                                    >
                                        Start a Discussion
                                    </button>
                                </div>
                            ) : (
                                userDiscussions.slice(0, 3).map((post) => (
                                    <div
                                        key={post.postId}
                                        className="dash-discussion-item"
                                        onClick={() => navigate("/community")}
                                    >
                                        <div className="dash-disc-title">{post.title}</div>
                                        <div className="dash-disc-meta">
                                            <span>
                                                {post.createdDate
                                                    ? new Date(post.createdDate).toLocaleDateString(undefined, {
                                                          month: "short",
                                                          day: "numeric",
                                                          year: "numeric",
                                                      })
                                                    : "Recently"}
                                            </span>
                                            <span>View Thread →</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;