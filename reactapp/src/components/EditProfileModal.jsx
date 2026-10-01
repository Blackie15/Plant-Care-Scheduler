import { useState, useEffect } from "react";
import { updateCurrentUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./EditProfileModal.css";

const TIMEZONES = [
    "UTC",
    "Asia/Kolkata (IST +5:30)",
    "America/New_York (EST/EDT -5:00)",
    "America/Chicago (CST/CDT -6:00)",
    "America/Denver (MST/MDT -7:00)",
    "America/Los_Angeles (PST/PDT -8:00)",
    "Europe/London (GMT/BST +0:00)",
    "Europe/Paris (CET/CEST +1:00)",
    "Europe/Berlin (CET/CEST +1:00)",
    "Asia/Tokyo (JST +9:00)",
    "Asia/Singapore (SGT +8:00)",
    "Asia/Dubai (GST +4:00)",
    "Australia/Sydney (AEST/AEDT +10:00)",
];

const EXPERIENCE_LEVELS = [
    { value: "Beginner", label: "Beginner (New to plant care)" },
    { value: "Intermediate", label: "Intermediate (Caring for multiple plants)" },
    { value: "Advanced", label: "Advanced (Experienced gardener)" },
    { value: "Master Gardener", label: "Master Gardener / Specialist" },
];

const NOTIFICATION_OPTIONS = [
    { value: "All notifications (Instant reminders)", label: "All Notifications (Instant reminders for care & health alerts)" },
    { value: "Daily care digest", label: "Daily Care Digest (Morning summary of scheduled tasks)" },
    { value: "Important plant health alerts only", label: "Critical Alerts Only (Health issues & urgent actions)" },
    { value: "Minimal notifications", label: "Minimal (Vital account & system updates only)" },
];

function EditProfileModal({ isOpen, onClose, user, onProfileUpdated }) {
    const { updateUserState } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        location: "",
        gardeningExperience: "Beginner",
        timezone: "Asia/Kolkata (IST +5:30)",
        notificationPreferences: "All notifications (Instant reminders)",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Lock body scroll when modal is open and handle Escape key
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            const handleKeyDown = (e) => {
                if (e.key === "Escape") {
                    onClose();
                }
            };
            window.addEventListener("keydown", handleKeyDown);

            return () => {
                document.body.style.overflow = originalOverflow;
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                location: user.location || "",
                gardeningExperience: user.gardeningExperience || "Beginner",
                timezone: user.timezone || "Asia/Kolkata (IST +5:30)",
                notificationPreferences: user.notificationPreferences || "All notifications (Instant reminders)",
                newPassword: "",
                confirmPassword: "",
            });
            setError("");
            setSuccessMessage("");
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!formData.username.trim()) {
            setError("Username cannot be blank");
            return;
        }

        if (!formData.email.trim()) {
            setError("Email address cannot be blank");
            return;
        }

        if (formData.newPassword) {
            if (formData.newPassword.length < 6) {
                setError("New password must be at least 6 characters long");
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setError("New passwords do not match");
                return;
            }
        }

        setLoading(true);

        try {
            const payload = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                location: formData.location.trim(),
                gardeningExperience: formData.gardeningExperience,
                timezone: formData.timezone,
                notificationPreferences: formData.notificationPreferences,
            };

            if (formData.newPassword.trim()) {
                payload.password = formData.newPassword.trim();
            }

            const updatedUser = await updateCurrentUser(payload);
            updateUserState(updatedUser);

            if (onProfileUpdated) {
                onProfileUpdated(updatedUser);
            }

            setSuccessMessage("Profile updated successfully!");

            setTimeout(() => {
                setSuccessMessage("");
                onClose();
            }, 800);
        } catch (err) {
            setError(err.message || "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} role="presentation">
            <div
                className="edit-profile-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-profile-title"
            >
                {/* Fixed Modal Header */}
                <div className="modal-header">
                    <div className="modal-header-title">
                        <h2 id="edit-profile-title">Edit Profile Details</h2>
                        <p className="modal-subtitle">Update your personal details, location zone, and botanical preferences</p>
                    </div>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close edit profile dialog"
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Form with Scrollable Content and Sticky Actions */}
                <form onSubmit={handleSubmit} className="edit-profile-form">
                    <div className="modal-scroll-body">
                        {/* Alerts */}
                        {error && (
                            <div className="modal-alert modal-error" role="alert">
                                <span className="alert-icon">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}
                        {successMessage && (
                            <div className="modal-alert modal-success" role="status">
                                <span className="alert-icon">✓</span>
                                <span>{successMessage}</span>
                            </div>
                        )}

                        <div className="form-grid">
                            {/* Username */}
                            <div className="form-group">
                                <label htmlFor="username">
                                    Username <span className="required-mark">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="form-input"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    required
                                    autoComplete="username"
                                />
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email">
                                    Email Address <span className="required-mark">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            {/* Location */}
                            <div className="form-group full-width">
                                <label htmlFor="location">
                                    Location / Climate Zone
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    className="form-input"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Zone 9b, Sunny Balcony, Indoor Greenhouse"
                                />
                            </div>

                            {/* Gardening Experience */}
                            <div className="form-group">
                                <label htmlFor="gardeningExperience">
                                    Gardening Experience
                                </label>
                                <div className="select-wrapper">
                                    <select
                                        id="gardeningExperience"
                                        name="gardeningExperience"
                                        className="form-select"
                                        value={formData.gardeningExperience}
                                        onChange={handleChange}
                                    >
                                        {EXPERIENCE_LEVELS.map((lvl) => (
                                            <option key={lvl.value} value={lvl.value}>
                                                {lvl.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Timezone */}
                            <div className="form-group">
                                <label htmlFor="timezone">
                                    Timezone
                                </label>
                                <div className="select-wrapper">
                                    <select
                                        id="timezone"
                                        name="timezone"
                                        className="form-select"
                                        value={formData.timezone}
                                        onChange={handleChange}
                                    >
                                        {TIMEZONES.map((tz) => (
                                            <option key={tz} value={tz}>
                                                {tz}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Notification Preferences */}
                            <div className="form-group full-width">
                                <label htmlFor="notificationPreferences">
                                    Notification Frequency & Preferences
                                </label>
                                <div className="select-wrapper">
                                    <select
                                        id="notificationPreferences"
                                        name="notificationPreferences"
                                        className="form-select"
                                        value={formData.notificationPreferences}
                                        onChange={handleChange}
                                    >
                                        {NOTIFICATION_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Optional Password Change Section */}
                            <div className="password-section full-width">
                                <div className="section-divider">
                                    <span className="divider-line"></span>
                                    <span className="divider-title">Security & Password (Optional)</span>
                                    <span className="divider-line"></span>
                                </div>
                                <p className="section-hint">
                                    Leave these fields blank if you wish to keep your current password unchanged.
                                </p>

                                <div className="password-grid">
                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            className="form-input"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Min. 6 characters"
                                            autoComplete="new-password"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm New Password</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="form-input"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Repeat new password"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Modal Action Footer */}
                    <div className="modal-actions-footer">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-save"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="btn-spinner"></span> Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
