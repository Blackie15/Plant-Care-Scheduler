import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPlants } from "../services/plantService";
import { getTasks } from "../services/taskService";
import { getHealthRecords } from "../services/healthRecordService";
import { getConsultations } from "../services/consultationService";
import { getPosts } from "../services/communityService";
import EditProfileModal from "../components/EditProfileModal";
import "./Profile.css";

function Profile() {
    const { user, refreshUser, logout } = useAuth();
    const navigate = useNavigate();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loadingStats, setLoadingStats] = useState(true);

    const [stats, setStats] = useState({
        plantsCount: 0,
        pendingTasksCount: 0,
        completedTasksCount: 0,
        healthRecordsCount: 0,
        consultationsCount: 0,
        communityPostsCount: 0,
    });

    useEffect(() => {
        const loadUserStats = async () => {
            if (!user?.id) return;
            setLoadingStats(true);

            try {
                const [
                    userPlants,
                    userTasks,
                    healthRecords,
                    consultations,
                    posts,
                ] = await Promise.all([
                    getPlants(user.id).catch(() => []),
                    getTasks(user.id).catch(() => []),
                    getHealthRecords().catch(() => []),
                    getConsultations().catch(() => []),
                    getPosts().catch(() => []),
                ]);

                const plantIds = new Set(userPlants.map((p) => p.id));
                const pendingTasks = userTasks.filter((t) => !t.isCompleted);
                const completedTasks = userTasks.filter((t) => t.isCompleted);
                const userHealth = healthRecords.filter((h) => plantIds.has(h.plantId));
                const userConsults = consultations.filter((c) => c.userId === user.id || c.specialistId === user.id);
                const userPosts = posts.filter((p) => p.userId === user.id);

                setStats({
                    plantsCount: userPlants.length,
                    pendingTasksCount: pendingTasks.length,
                    completedTasksCount: completedTasks.length,
                    healthRecordsCount: userHealth.length,
                    consultationsCount: userConsults.length,
                    communityPostsCount: userPosts.length,
                });
            } catch (err) {
                console.warn("Could not load profile statistics:", err);
            } finally {
                setLoadingStats(false);
            }
        };

        loadUserStats();
    }, [user?.id]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    const getRoleLabel = (role) => {
        if (!role) return "Gardener";
        if (role === "SPECIALIST") return "Plant Specialist";
        if (role === "ADMIN") return "Administrator";
        return "Gardener";
    };

    return (
        <div className="profile-page-container">
            {/* Top Hero Card */}
            <div className="profile-hero-card">
                <div className="profile-hero-content">
                    <div className="profile-hero-avatar-wrapper">
                        <div className="profile-hero-avatar">
                            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="profile-status-indicator" title="Account is active"></span>
                    </div>

                    <div className="profile-hero-details">
                        <div className="profile-hero-title-row">
                            <h1 className="profile-user-title">{user?.username || "Gardener"}</h1>
                            <span className="profile-hero-role-badge">{getRoleLabel(user?.role)}</span>
                            <span className="profile-hero-status-badge">
                                {user?.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <p className="profile-hero-email">
                            {user?.email}
                        </p>

                        <div className="profile-hero-meta-row">
                            <span>Member since {formatDate(user?.createdDate || new Date())}</span>
                            {user?.lastLogin && (
                                <span>Last active {formatDate(user.lastLogin)}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-hero-actions">
                    <button
                        className="profile-edit-btn"
                        onClick={() => setIsEditModalOpen(true)}
                        id="edit-profile-btn"
                    >
                        Edit Profile Details
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="profile-stats-grid">
                <div className="profile-stat-card">
                    <div className="stat-card-info">
                        <span className="stat-card-number">
                            {loadingStats ? "..." : stats.plantsCount}
                        </span>
                        <span className="stat-card-title">Plants Under Care</span>
                    </div>
                    <Link to="/plants" className="stat-card-link">
                        Manage Plants →
                    </Link>
                </div>

                <div className="profile-stat-card">
                    <div className="stat-card-info">
                        <span className="stat-card-number">
                            {loadingStats ? "..." : stats.pendingTasksCount}
                        </span>
                        <span className="stat-card-title">Pending Tasks</span>
                    </div>
                    <Link to="/tasks" className="stat-card-link">
                        View Schedule →
                    </Link>
                </div>

                <div className="profile-stat-card">
                    <div className="stat-card-info">
                        <span className="stat-card-number">
                            {loadingStats ? "..." : stats.completedTasksCount}
                        </span>
                        <span className="stat-card-title">Completed Tasks</span>
                    </div>
                    <span className="stat-card-sub">Active plant care schedule</span>
                </div>

                <div className="profile-stat-card">
                    <div className="stat-card-info">
                        <span className="stat-card-number">
                            {loadingStats ? "..." : stats.consultationsCount}
                        </span>
                        <span className="stat-card-title">Consultations</span>
                    </div>
                    <Link to="/consultations" className="stat-card-link">
                        Consultations →
                    </Link>
                </div>
            </div>

            {/* Main Content Two-Column Grid */}
            <div className="profile-sections-grid">
                {/* Personal Information & Preferences */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <div className="profile-card-title-group">
                            <h3>Gardener Profile & Preferences</h3>
                        </div>
                        <button
                            className="card-header-action-btn"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            Edit Details
                        </button>
                    </div>

                    <div className="profile-info-grid">
                        <div className="info-item">
                            <span className="info-label">Username</span>
                            <span className="info-value">{user?.username || "—"}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Email Address</span>
                            <span className="info-value">{user?.email || "—"}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Account Role</span>
                            <span className="info-value role-highlight">
                                {user?.role || "USER"}
                            </span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Email Verification</span>
                            <span className="info-value">
                                {user?.emailVerified ? "Verified" : "Active User"}
                            </span>
                        </div>

                        <div className="info-item full-width">
                            <span className="info-label">Location / Climate Zone</span>
                            <span className="info-value">
                                {user?.location ? (
                                    user.location
                                ) : (
                                    <span className="empty-text">No location specified (Click edit to add)</span>
                                )}
                            </span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Gardening Experience Level</span>
                            <span className="info-value">
                                {user?.gardeningExperience || "Beginner"}
                            </span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Selected Timezone</span>
                            <span className="info-value">
                                {user?.timezone || "UTC"}
                            </span>
                        </div>

                        <div className="info-item full-width">
                            <span className="info-label">Notification Preferences</span>
                            <span className="info-value">
                                {user?.notificationPreferences || "All notifications (Instant reminders)"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Navigation & App Shortcuts */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <div className="profile-card-title-group">
                            <h3>Botanical Suite Shortcuts</h3>
                        </div>
                    </div>

                    <div className="profile-shortcuts-list">
                        <Link to="/plants" className="shortcut-item">
                            <div className="shortcut-info">
                                <h4>My Plant Collection</h4>
                                <p>Add new botanical specimens and monitor growth status</p>
                            </div>
                            <span className="shortcut-arrow">→</span>
                        </Link>

                        <Link to="/tasks" className="shortcut-item">
                            <div className="shortcut-info">
                                <h4>Care Schedule & Tasks</h4>
                                <p>Check watering, fertilizing, and pruning reminders</p>
                            </div>
                            <span className="shortcut-arrow">→</span>
                        </Link>

                        <Link to="/health-records" className="shortcut-item">
                            <div className="shortcut-info">
                                <h4>Plant Health & Diagnosis</h4>
                                <p>Track symptoms, pests, and specialist treatment plans</p>
                            </div>
                            <span className="shortcut-arrow">→</span>
                        </Link>

                        <Link to="/consultations" className="shortcut-item">
                            <div className="shortcut-info">
                                <h4>Specialist Consultations</h4>
                                <p>Connect with expert botanists and plant doctors</p>
                            </div>
                            <span className="shortcut-arrow">→</span>
                        </Link>

                        <Link to="/community" className="shortcut-item">
                            <div className="shortcut-info">
                                <h4>Community Forum</h4>
                                <p>Share garden stories and tips with fellow growers</p>
                            </div>
                            <span className="shortcut-arrow">→</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Interactive Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onProfileUpdated={() => refreshUser()}
            />
        </div>
    );
}

export default Profile;
