import { useState, useEffect } from "react";
import {
    getConsultations,
    getSpecialists,
    createConsultation,
    updateConsultation,
    deleteConsultation,
} from "../services/consultationService";
import { getPlants } from "../services/plantService";
import { getCurrentUser } from "../services/authService";
import "./Consultations.css";

function Consultations() {
    const [consultations, setConsultations] = useState([]);
    const [specialists, setSpecialists] = useState([]);
    const [userPlants, setUserPlants] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Tabs & Filters
    const [activeTab, setActiveTab] = useState("ALL"); // 'ALL', 'PENDING', 'COMPLETED'
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingConsultationId, setEditingConsultationId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Selected plant chips for the consultation
    const [selectedPlants, setSelectedPlants] = useState([]);

    // Form data
    const [formData, setFormData] = useState({
        specialistId: "",
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        problemDescription: "",
        consultationStatus: "Requested",
        meetingLink: "",
    });

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const userData = await getCurrentUser();
            setCurrentUser(userData);

            const [allConsultations, fetchedSpecialists, plants] = await Promise.all([
                getConsultations().catch(() => []),
                getSpecialists().catch(() => []),
                getPlants(userData.id).catch(() => []),
            ]);

            setSpecialists(fetchedSpecialists);
            setUserPlants(plants);

            // Filter for current user (unless admin or specialist)
            const isStaff = userData.role === "ADMIN" || userData.role === "SPECIALIST";
            const userConsultations = isStaff
                ? allConsultations
                : allConsultations.filter((c) => c.userId === userData.id);

            setConsultations(userConsultations);
        } catch (err) {
            console.error("Error loading consultations:", err);
            setError(err.message || "Failed to load consultations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenModal = (consultation = null) => {
        if (consultation) {
            setEditingConsultationId(consultation.consultationId);

            // Extract plants if prefixed with [Plants: ...]
            let desc = consultation.problemDescription || "";
            const matchedPlants = [];
            if (desc.startsWith("[Plants: ")) {
                const endIdx = desc.indexOf("]");
                if (endIdx !== -1) {
                    const plantsStr = desc.substring(9, endIdx);
                    plantsStr.split(",").forEach((p) => matchedPlants.push(p.trim()));
                    desc = desc.substring(endIdx + 1).trim();
                }
            }

            setSelectedPlants(matchedPlants);
            setFormData({
                specialistId: consultation.specialistId ? String(consultation.specialistId) : "",
                appointmentDate: consultation.appointmentDate
                    ? new Date(consultation.appointmentDate).toISOString().slice(0, 16)
                    : "",
                problemDescription: desc,
                consultationStatus: consultation.consultationStatus || "Requested",
                meetingLink: consultation.meetingLink || "",
            });
        } else {
            setEditingConsultationId(null);
            setSelectedPlants(userPlants.length > 0 ? [userPlants[0].nickname] : []);
            setFormData({
                specialistId: "",
                appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                problemDescription: "",
                consultationStatus: "Requested",
                meetingLink: "",
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingConsultationId(null);
    };

    const handleTogglePlantSelection = (plantName) => {
        if (selectedPlants.includes(plantName)) {
            setSelectedPlants(selectedPlants.filter((p) => p !== plantName));
        } else {
            setSelectedPlants([...selectedPlants, plantName]);
        }
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
            alert("Please log in to book a consultation.");
            return;
        }

        if (!formData.problemDescription.trim()) {
            alert("Please provide a description of the symptoms or questions.");
            return;
        }

        setSaving(true);
        try {
            const isStaff = currentUser.role === "ADMIN" || currentUser.role === "SPECIALIST";

            // Format final problem description with plant tags
            let finalDescription = formData.problemDescription.trim();
            if (selectedPlants.length > 0) {
                finalDescription = `[Plants: ${selectedPlants.join(", ")}] ${finalDescription}`;
            }

            const payload = {
                userId: currentUser.id,
                specialistId: formData.specialistId ? Number(formData.specialistId) : null,
                requestDate: new Date().toISOString(),
                appointmentDate: formData.appointmentDate ? `${formData.appointmentDate}:00` : null,
                problemDescription: finalDescription,
                consultationStatus: isStaff || editingConsultationId
                    ? formData.consultationStatus || "Requested"
                    : "Requested",
                meetingLink: formData.meetingLink?.trim() || null,
            };

            if (editingConsultationId) {
                await updateConsultation(editingConsultationId, payload);
            } else {
                await createConsultation(payload);
            }

            handleCloseModal();
            loadData();
        } catch (err) {
            alert("Failed to book consultation: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (consultationId) => {
        if (window.confirm("Are you sure you want to cancel this consultation?")) {
            try {
                await deleteConsultation(consultationId);
                setConsultations((prev) => prev.filter((c) => c.consultationId !== consultationId));
            } catch (err) {
                alert("Failed to cancel consultation: " + err.message);
            }
        }
    };

    // Filter Logic
    const pendingConsultations = consultations.filter(
        (c) =>
            c.consultationStatus?.toLowerCase() === "requested" ||
            c.consultationStatus?.toLowerCase() === "scheduled" ||
            c.consultationStatus?.toLowerCase() === "pending"
    );

    const completedConsultations = consultations.filter(
        (c) => c.consultationStatus?.toLowerCase() === "completed"
    );

    const displayedConsultations = consultations.filter((c) => {
        if (activeTab === "PENDING" && !pendingConsultations.includes(c)) return false;
        if (activeTab === "COMPLETED" && !completedConsultations.includes(c)) return false;

        if (statusFilter !== "ALL" && c.consultationStatus?.toUpperCase() !== statusFilter.toUpperCase()) {
            return false;
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            const desc = c.problemDescription?.toLowerCase() || "";
            const spec = c.specialistName?.toLowerCase() || "";
            if (!desc.includes(term) && !spec.includes(term)) {
                return false;
            }
        }

        return true;
    });

    const getStatusBadgeClass = (status) => {
        const s = status?.toLowerCase() || "";
        if (s.includes("sched") || s.includes("confirm")) return "status-scheduled";
        if (s.includes("comp")) return "status-completed";
        if (s.includes("canc")) return "status-cancelled";
        return "status-requested";
    };

    const getLifecycleExplanation = (status, specialistName) => {
        const s = status?.toLowerCase() || "";
        if (s.includes("sched") || s.includes("confirm")) {
            return {
                styleClass: "lifecycle-scheduled",
                title: "Appointment Confirmed",
                message: `Confirmed with ${specialistName || "a Certified Botanist"}. Join the video meeting room at your scheduled time.`,
            };
        }
        if (s.includes("comp")) {
            return {
                styleClass: "lifecycle-completed",
                title: "Consultation Completed",
                message: "Your consultation session has concluded.",
            };
        }
        if (s.includes("canc")) {
            return {
                styleClass: "lifecycle-requested",
                title: "Session Cancelled",
                message: "This consultation request was cancelled.",
            };
        }
        return {
            styleClass: "lifecycle-requested",
            title: "Request Submitted (Pending Specialist Confirmation)",
            message: "A certified botanist will review your plant symptoms and confirm your session time.",
        };
    };

    // Parse plant pills and clean description
    const parseProblemDescription = (rawText) => {
        if (!rawText) return { plantTags: [], text: "" };
        if (rawText.startsWith("[Plants: ")) {
            const endIdx = rawText.indexOf("]");
            if (endIdx !== -1) {
                const plantsStr = rawText.substring(9, endIdx);
                const plantTags = plantsStr.split(",").map((p) => p.trim());
                const cleanText = rawText.substring(endIdx + 1).trim();
                return { plantTags, text: cleanText };
            }
        }
        return { plantTags: [], text: rawText };
    };

    const isStaff = currentUser?.role === "ADMIN" || currentUser?.role === "SPECIALIST";

    return (
        <div className="consultations-page">
            {/* Header */}
            <div className="consultations-header">
                <div className="consultations-title-wrap">
                    <span className="consult-tagline">Expert Botanical Advisory</span>
                    <h1>Botanist Consultations</h1>
                    <p>Connect 1-on-1 with certified plant experts to diagnose stubborn ailments and optimize care setups</p>
                </div>

                <button className="book-consult-btn" onClick={() => handleOpenModal()}>
                    Book Specialist Consultation
                </button>
            </div>

            {/* Specialist Showcase */}
            <div className="specialists-banner">
                <div className="specialists-banner-header">
                    <h3>Certified Botanists & Plant Care Specialists</h3>
                </div>
                <div className="specialists-grid">
                    {specialists.length > 0 ? (
                        specialists.map((spec) => (
                            <div key={spec.id} className="specialist-card">
                                <div className="specialist-avatar">
                                    {spec.username ? spec.username.charAt(0).toUpperCase() : "S"}
                                </div>
                                <div className="specialist-meta">
                                    <h4>{spec.username}</h4>
                                    <span>{spec.location || spec.gardeningExperience || "Certified Plant Care Specialist"}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="specialist-card">
                            <div className="specialist-avatar">B</div>
                            <div className="specialist-meta">
                                <h4>Botanical Diagnostic Network</h4>
                                <span>Certified specialists available on-demand</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Metric Counters */}
            <div className="consult-metrics-row">
                <div
                    className={`consult-stat-card ${activeTab === "ALL" ? "active" : ""}`}
                    onClick={() => setActiveTab("ALL")}
                >
                    <div className="consult-stat-details">
                        <span className="stat-count">{consultations.length}</span>
                        <span className="stat-title">All Consultations</span>
                    </div>
                </div>

                <div
                    className={`consult-stat-card ${activeTab === "PENDING" ? "active" : ""}`}
                    onClick={() => setActiveTab("PENDING")}
                >
                    <div className="consult-stat-details">
                        <span className="stat-count">{pendingConsultations.length}</span>
                        <span className="stat-title">Pending / Scheduled</span>
                    </div>
                </div>

                <div
                    className={`consult-stat-card ${activeTab === "COMPLETED" ? "active" : ""}`}
                    onClick={() => setActiveTab("COMPLETED")}
                >
                    <div className="consult-stat-details">
                        <span className="stat-count">{completedConsultations.length}</span>
                        <span className="stat-title">Completed Sessions</span>
                    </div>
                </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="health-controls">
                <input
                    type="text"
                    className="filter-select"
                    style={{ minWidth: "260px", flex: "1" }}
                    placeholder="Search consultations by plant, symptoms, specialist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Session Statuses</option>
                    <option value="REQUESTED">Requested (Pending Review)</option>
                    <option value="SCHEDULED">Scheduled / Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            {error && <div className="alert-message alert-error">{error}</div>}

            {/* Main Content */}
            {loading ? (
                <div className="dashboard-loading">
                    <div className="dashboard-spinner"></div>
                    <h3>Loading consultations...</h3>
                </div>
            ) : displayedConsultations.length === 0 ? (
                <div className="empty-plants-container">
                    <h3>No consultations found</h3>
                    <p>Need advice on a drooping plant, root rot, or pest infestation? Book your first session with a certified specialist.</p>
                    <button className="book-consult-btn" style={{ margin: "0 auto" }} onClick={() => handleOpenModal()}>
                        Book Your First Consultation
                    </button>
                </div>
            ) : (
                <div className="consultations-grid">
                    {displayedConsultations.map((consult) => {
                        const lifecycle = getLifecycleExplanation(
                            consult.consultationStatus,
                            consult.specialistName
                        );

                        const { plantTags, text } = parseProblemDescription(consult.problemDescription);

                        return (
                            <div key={consult.consultationId} className="consultation-card">
                                <div className="consultation-card-top">
                                    <span className="consult-id-badge">
                                        {consult.requestDate
                                            ? new Date(consult.requestDate).toLocaleDateString(undefined, {
                                                  month: "short",
                                                  day: "numeric",
                                                  year: "numeric",
                                              })
                                            : "Recent Request"}
                                    </span>
                                    <span className={`consult-status-badge ${getStatusBadgeClass(consult.consultationStatus)}`}>
                                        {consult.consultationStatus || "Requested"}
                                    </span>
                                </div>

                                {/* Status explanation banner */}
                                <div className={`status-lifecycle-card ${lifecycle.styleClass}`}>
                                    <strong>{lifecycle.title}:</strong> {lifecycle.message}
                                </div>

                                <div className="consultation-card-body">
                                    {plantTags.length > 0 && (
                                        <div className="consult-plants-tags-row">
                                            {plantTags.map((pName, idx) => (
                                                <span key={idx} className="consult-plant-pill">
                                                    {pName}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="consult-problem-box">
                                        <div className="problem-label">Problem / Symptoms</div>
                                        <div className="problem-text">{text}</div>
                                    </div>

                                    <div className="consult-meta-row">
                                        <div className="consult-meta-item">
                                            <strong>Specialist:</strong>
                                            <span>{consult.specialistName || "Pending Specialist Assignment"}</span>
                                        </div>

                                        <div className="consult-meta-item">
                                            <strong>Appointment Date:</strong>
                                            <span>
                                                {consult.appointmentDate
                                                    ? new Date(consult.appointmentDate).toLocaleString(undefined, {
                                                          dateStyle: "medium",
                                                          timeStyle: "short",
                                                      })
                                                    : "Preferred time pending confirmation"}
                                            </span>
                                        </div>
                                    </div>

                                    {consult.meetingLink && (
                                        <a
                                            href={consult.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="join-call-btn"
                                        >
                                            Join Video Consultation Room
                                        </a>
                                    )}
                                </div>

                                <div className="consultation-card-footer">
                                    <button
                                        className="health-btn-action"
                                        onClick={() => handleOpenModal(consult)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="health-btn-action delete"
                                        onClick={() => handleDelete(consult.consultationId)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Booking Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingConsultationId ? "Edit Consultation" : "Book Specialist Consultation"}</h2>
                            <button className="modal-close-btn" onClick={handleCloseModal}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="modal-form">
                            {/* Plant Tag Selection (Single or Multiple) */}
                            <div className="plant-selector-group">
                                <label>Which of your plants is this consultation for? (Select 1 or more)</label>
                                <div className="plant-tags-container">
                                    {userPlants.map((plant) => {
                                        const isSelected = selectedPlants.includes(plant.nickname);
                                        return (
                                            <span
                                                key={plant.id}
                                                className={`plant-select-chip ${isSelected ? "selected" : ""}`}
                                                onClick={() => handleTogglePlantSelection(plant.nickname)}
                                            >
                                                <span>{isSelected ? "✓" : "+"}</span> {plant.nickname}
                                            </span>
                                        );
                                    })}
                                    <span
                                        className={`plant-select-chip ${selectedPlants.includes("General / Entire Setup") ? "selected" : ""}`}
                                        onClick={() => handleTogglePlantSelection("General / Entire Setup")}
                                    >
                                        <span>{selectedPlants.includes("General / Entire Setup") ? "✓" : "+"}</span> General Indoor Garden
                                    </span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Select Preferred Specialist (Optional)</label>
                                <select
                                    name="specialistId"
                                    value={formData.specialistId}
                                    onChange={handleFormChange}
                                >
                                    <option value="">Any Available Certified Specialist</option>
                                    {specialists.map((s) => (
                                        <option key={s.id} value={String(s.id)}>
                                            {s.username} {s.location ? `(${s.location})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Preferred Appointment Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        name="appointmentDate"
                                        value={formData.appointmentDate}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                {isStaff && (
                                    <div className="form-group">
                                        <label>Session Status (Staff)</label>
                                        <select
                                            name="consultationStatus"
                                            value={formData.consultationStatus}
                                            onChange={handleFormChange}
                                        >
                                            <option value="Requested">Requested</option>
                                            <option value="Scheduled">Scheduled / Confirmed</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Describe the Plant Issue / Symptoms *</label>
                                <textarea
                                    name="problemDescription"
                                    rows="4"
                                    placeholder="e.g. Lower leaves are turning yellow, crispy tips, drooping despite soil being moist..."
                                    value={formData.problemDescription}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            {isStaff && (
                                <div className="form-group">
                                    <label>Meeting Video Call Link (Staff / Specialist)</label>
                                    <input
                                        type="text"
                                        name="meetingLink"
                                        placeholder="https://meet.google.com/xyz-plant-care"
                                        value={formData.meetingLink}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save" disabled={saving}>
                                    {saving ? "Processing..." : editingConsultationId ? "Update Consultation" : "Submit Consultation Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Consultations;
