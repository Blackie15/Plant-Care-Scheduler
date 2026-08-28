import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/transparent-logo.png";
import EditProfileModal from "./EditProfileModal";
import "./Navbar.css";

function Navbar() {
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const profileRef = useRef(null);

    // Close dropdown on outside click or Escape key
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [dropdownOpen]);

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        navigate("/login");
    };

    const handleOpenEdit = () => {
        setDropdownOpen(false);
        setIsEditModalOpen(true);
    };

    const handleGoToProfile = () => {
        setDropdownOpen(false);
        navigate("/profile");
    };

    const formatRole = (role) => {
        if (!role) return "Gardener";
        if (role === "SPECIALIST") return "Plant Specialist";
        if (role === "ADMIN") return "Administrator";
        return "Gardener";
    };

    return (
        <header className="plantcare-navbar">
            <div className="navbar-container">
                {/* Brand */}
                <NavLink to="/dashboard" className="navbar-brand">
                    <img src={logoImg} alt="PlantCare Scheduler Logo" className="navbar-brand-logo" />
                    <div className="brand-title">
                        PlantCare <span>Scheduler</span>
                    </div>
                </NavLink>

                {/* Navigation Links (Clean, No Emojis) */}
                <nav className={`navbar-links ${mobileOpen ? "mobile-open" : ""}`}>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `nav-item-link ${isActive ? "active" : ""}`
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/plants"
                        className={({ isActive }) =>
                            `nav-item-link ${isActive ? "active" : ""}`
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        My Plants
                    </NavLink>

                    <NavLink
                        to="/tasks"
                        className={({ isActive }) =>
                            `nav-item-link ${isActive ? "active" : ""}`
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        Care Tasks
                    </NavLink>

                    <NavLink
                        to="/health-records"
                        className={({ isActive }) =>
                            `nav-item-link ${isActive ? "active" : ""}`
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        Health
                    </NavLink>

                    <NavLink
                        to="/consultations"
                        className={({ isActive }) =>
                            `nav-item-link ${isActive ? "active" : ""}`
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        Consultations
                    </NavLink>

                    <NavLink
                        to="/community"
                        className={({ isActive }) =>
                            `nav-item-link ${isActive ? "active" : ""}`
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        Community
                    </NavLink>

                    <NavLink
                        to="/environment"
                        className={({ isActive }) =>
                            `nav-item-link ${isActive ? "active" : ""}`
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        Sensors
                    </NavLink>

                    <NavLink
                        to="/species"
                        className={({ isActive }) =>
                            `nav-item-link ${isActive ? "active" : ""}`
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        Species Guide
                    </NavLink>

                    <NavLink
                        to="/notifications"
                        className={({ isActive }) =>
                            `nav-item-link ${isActive ? "active" : ""}`
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        Alerts
                    </NavLink>
                </nav>

                {/* User Actions & Profile Dropdown Trigger */}
                <div className="navbar-actions">
                    {user && (
                        <div className="profile-dropdown-wrapper" ref={profileRef}>
                            <button
                                className={`user-badge-btn ${dropdownOpen ? "active" : ""}`}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                title="Account profile & settings"
                                aria-expanded={dropdownOpen}
                                aria-haspopup="true"
                            >
                                <div className="user-avatar">
                                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                                </div>
                                <div className="user-meta">
                                    <span className="user-name">{user.username}</span>
                                    <span className="user-role">{user.role}</span>
                                </div>
                                <span className={`dropdown-chevron ${dropdownOpen ? "rotate" : ""}`}>
                                    ▼
                                </span>
                            </button>

                            {/* Vertical Profile Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="profile-dropdown-menu" role="menu">
                                    {/* Dropdown Header with Top Edit Button */}
                                    <div className="dropdown-header">
                                        <div className="dropdown-header-top">
                                            <span className="dropdown-badge">{formatRole(user.role)}</span>
                                            <button
                                                className="top-edit-btn"
                                                onClick={handleOpenEdit}
                                                title="Edit personal details"
                                            >
                                                Edit Details
                                            </button>
                                        </div>

                                        <div className="dropdown-user-info">
                                            <div className="dropdown-avatar">
                                                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div className="dropdown-user-text">
                                                <h4 className="dropdown-user-name">{user.username}</h4>
                                                <p className="dropdown-user-email">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Details List */}
                                    <div className="dropdown-details-list">
                                        <div className="detail-item">
                                            <div className="detail-content">
                                                <span className="detail-label">Location / Zone</span>
                                                <span className="detail-value">
                                                    {user.location || "Not specified"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="detail-item">
                                            <div className="detail-content">
                                                <span className="detail-label">Gardening Experience</span>
                                                <span className="detail-value">
                                                    {user.gardeningExperience || "Beginner"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="detail-item">
                                            <div className="detail-content">
                                                <span className="detail-label">Timezone</span>
                                                <span className="detail-value">
                                                    {user.timezone || "UTC"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="detail-item">
                                            <div className="detail-content">
                                                <span className="detail-label">Notifications</span>
                                                <span className="detail-value detail-value-truncate">
                                                    {user.notificationPreferences || "Standard reminders"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dropdown Action Buttons */}
                                    <div className="dropdown-actions">
                                        <button
                                            className="dropdown-action-btn edit-profile-btn"
                                            onClick={handleOpenEdit}
                                        >
                                            Edit Profile Details
                                        </button>

                                        <button
                                            className="dropdown-action-btn view-profile-btn"
                                            onClick={handleGoToProfile}
                                        >
                                            View Full Profile
                                        </button>

                                        <button
                                            className="dropdown-action-btn logout-action-btn"
                                            onClick={handleLogout}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        className="mobile-toggle-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                onProfileUpdated={() => refreshUser()}
            />
        </header>
    );
}

export default Navbar;
