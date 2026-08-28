import { useState, useEffect } from "react";
import {
    getNotifications,
    markAsRead,
    deleteNotification,
    createNotification,
} from "../services/notificationService";
import { getCurrentUser } from "../services/authService";
import "./Notifications.css";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Tabs & Filters
    const [activeTab, setActiveTab] = useState("ALL"); // 'ALL', 'UNREAD', 'WATER', 'CONSULTATION'

    // Modal state for custom reminder
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        notificationType: "WATERING",
    });

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const userData = await getCurrentUser();
            setCurrentUser(userData);

            const userNotifications = await getNotifications(userData.id).catch(() => []);
            // Sort by most recent
            userNotifications.sort((a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0));
            setNotifications(userNotifications);
        } catch (err) {
            console.error("Error loading notifications:", err);
            setError(err.message || "Failed to load notifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n))
            );
        } catch (err) {
            alert("Failed to mark alert as read: " + err.message);
        }
    };

    const handleMarkAllRead = async () => {
        const unread = notifications.filter((n) => !n.isRead);
        if (unread.length === 0) return;

        try {
            await Promise.all(unread.map((n) => markAsRead(n.notificationId).catch(() => null)));
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (err) {
            alert("Failed to update alerts: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
        } catch (err) {
            alert("Failed to delete notification: " + err.message);
        }
    };

    const handleOpenModal = () => {
        setFormData({
            title: "",
            message: "",
            notificationType: "WATERING",
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser?.id) {
            alert("Please log in to set a reminder.");
            return;
        }

        if (!formData.title.trim() || !formData.message.trim()) {
            alert("Please provide both a title and message.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                userId: currentUser.id,
                title: formData.title.trim(),
                message: formData.message.trim(),
                notificationType: formData.notificationType,
            };

            await createNotification(payload);
            handleCloseModal();
            loadData();
        } catch (err) {
            alert("Failed to create reminder: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    // Filter Logic
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    const waterNotifications = notifications.filter((n) =>
        n.notificationType?.toUpperCase().includes("WATER") ||
        n.notificationType?.toUpperCase().includes("CARE") ||
        n.notificationType?.toUpperCase().includes("FERTILIZ")
    );

    const displayedNotifications = notifications.filter((n) => {
        if (activeTab === "UNREAD" && n.isRead) return false;
        if (activeTab === "WATER" && !waterNotifications.includes(n)) return false;
        if (
            activeTab === "CONSULTATION" &&
            !n.notificationType?.toUpperCase().includes("CONSULT") &&
            !n.notificationType?.toUpperCase().includes("HEALTH")
        ) {
            return false;
        }
        return true;
    });

    const getTypeIconInfo = (type) => {
        const t = type?.toUpperCase() || "";
        if (t.includes("WATER")) return { tag: "Watering", styleClass: "type-tag-water" };
        if (t.includes("FERTILIZ") || t.includes("NUTRIENT")) return { tag: "Nutrition", styleClass: "type-tag-fertilize" };
        if (t.includes("HEALTH") || t.includes("DIAGNOSTIC")) return { tag: "Health", styleClass: "type-tag-health" };
        if (t.includes("CONSULT")) return { tag: "Consultation", styleClass: "type-tag-consultation" };
        return { tag: "Care Alert", styleClass: "type-tag-general" };
    };

    return (
        <div className="notifications-page">
            {/* Header */}
            <div className="notifications-header">
                <div className="notifications-title-wrap">
                    <span className="notify-tagline">Care Schedule & Updates</span>
                    <h1>Alerts & Reminders</h1>
                    <p>Stay on top of watering schedules, fertilizing reminders, and botanist appointment updates</p>
                </div>

                <div className="header-actions-group">
                    {unreadNotifications.length > 0 && (
                        <button className="btn-mark-all-read" onClick={handleMarkAllRead}>
                            Mark All as Read
                        </button>
                    )}
                    <button className="btn-add-reminder" onClick={handleOpenModal}>
                        Custom Plant Reminder
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="notifications-metrics-row">
                <div
                    className={`notify-metric-card ${activeTab === "ALL" ? "active" : ""}`}
                    onClick={() => setActiveTab("ALL")}
                >
                    <div className="notify-metric-details">
                        <span className="notify-metric-number">{notifications.length}</span>
                        <span className="notify-metric-label">All Alerts</span>
                    </div>
                </div>

                <div
                    className={`notify-metric-card ${activeTab === "UNREAD" ? "active" : ""}`}
                    onClick={() => setActiveTab("UNREAD")}
                >
                    <div className="notify-metric-details">
                        <span className="notify-metric-number">{unreadNotifications.length}</span>
                        <span className="notify-metric-label">Unread Notifications</span>
                    </div>
                </div>

                <div
                    className={`notify-metric-card ${activeTab === "WATER" ? "active" : ""}`}
                    onClick={() => setActiveTab("WATER")}
                >
                    <div className="notify-metric-details">
                        <span className="notify-metric-number">{waterNotifications.length}</span>
                        <span className="notify-metric-label">Care & Watering Reminders</span>
                    </div>
                </div>
            </div>

            {error && <div className="alert-message alert-error">{error}</div>}

            {/* Notification Feed */}
            {loading ? (
                <div className="dashboard-loading">
                    <div className="dashboard-spinner"></div>
                    <h3>Loading notifications...</h3>
                </div>
            ) : displayedNotifications.length === 0 ? (
                <div className="empty-plants-container">
                    <h3>No notifications right now</h3>
                    <p>
                        {activeTab === "UNREAD"
                            ? "All caught up! You have no unread reminders."
                            : "You don't have any alerts. When care tasks are due or consultations are updated, you will see them here."}
                    </p>
                    <button className="btn-add-reminder" style={{ margin: "0 auto" }} onClick={handleOpenModal}>
                        Create Custom Plant Reminder
                    </button>
                </div>
            ) : (
                <div className="notifications-list">
                    {displayedNotifications.map((notify) => {
                        const typeInfo = getTypeIconInfo(notify.notificationType);
                        const isUnread = !notify.isRead;

                        return (
                            <div
                                key={notify.notificationId}
                                className={`notification-card ${isUnread ? "unread" : ""}`}
                            >
                                <div className="notify-content">
                                    <div className="notify-header-row">
                                        <div className="notify-title-group">
                                            <span className={`notify-type-tag ${typeInfo.styleClass}`}>
                                                {typeInfo.tag}
                                            </span>
                                            <h4 className="notify-title">
                                                {isUnread && <span className="unread-dot" title="Unread"></span>}
                                                {notify.title}
                                            </h4>
                                        </div>
                                        <span className="notify-time">
                                            {notify.createdDate
                                                ? new Date(notify.createdDate).toLocaleDateString(undefined, {
                                                      month: "short",
                                                      day: "numeric",
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  })
                                                : "Recently"}
                                        </span>
                                    </div>

                                    <p className="notify-message">{notify.message}</p>

                                    <div className="notify-actions">
                                        {isUnread && (
                                            <button
                                                className="btn-read-toggle"
                                                onClick={() => handleMarkAsRead(notify.notificationId)}
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                        <button
                                            className="health-btn-action delete"
                                            title="Dismiss notification"
                                            onClick={() => handleDelete(notify.notificationId)}
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Custom Reminder Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create Custom Plant Reminder</h2>
                            <button className="modal-close-btn" onClick={handleCloseModal}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Reminder Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Rotate Monstera pot towards window"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Reminder Category *</label>
                                <select
                                    name="notificationType"
                                    value={formData.notificationType}
                                    onChange={handleFormChange}
                                    required
                                >
                                    <option value="WATERING">Watering Alert</option>
                                    <option value="FERTILIZING">Fertilizing Reminder</option>
                                    <option value="HEALTH">Health Assessment</option>
                                    <option value="ENVIRONMENT">Temperature / Sunlight Alert</option>
                                    <option value="GENERAL">General Reminder</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Reminder Details *</label>
                                <textarea
                                    name="message"
                                    rows="3"
                                    placeholder="e.g. Ensure even sunlight on all sides of the foliage to encourage symmetrical growth..."
                                    value={formData.message}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save" disabled={saving}>
                                    {saving ? "Creating..." : "Save Reminder"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notifications;
