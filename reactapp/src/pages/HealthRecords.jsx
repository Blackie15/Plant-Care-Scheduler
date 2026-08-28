import { useState, useEffect } from "react";
import {
    getHealthRecords,
    createHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
} from "../services/healthRecordService";
import { getPlants } from "../services/plantService";
import { getCurrentUser } from "../services/authService";
import "./HealthRecords.css";

function HealthRecords() {
    const [records, setRecords] = useState([]);
    const [plants, setPlants] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters & Tabs
    const [activeTab, setActiveTab] = useState("ALL"); // 'ALL', 'TREATMENT', 'RECOVERED'
    const [plantFilter, setPlantFilter] = useState("ALL");
    const [healthFilter, setHealthFilter] = useState("ALL");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        plantId: "",
        assessmentDate: new Date().toISOString().slice(0, 16),
        overallHealth: "Healthy",
        symptoms: "",
        diagnosedIssues: "",
        treatmentsApplied: "",
        growthMeasurements: "",
        notes: "",
        followUpDate: "",
        recoveryStatus: "Recovered",
    });

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const userData = await getCurrentUser();
            setCurrentUser(userData);

            const [allRecords, userPlants] = await Promise.all([
                getHealthRecords().catch(() => []),
                getPlants(userData.id).catch(() => []),
            ]);

            // Filter records for user's plants
            const userPlantIds = new Set(userPlants.map((p) => p.id));
            const filteredUserRecords = userData.role === "ADMIN"
                ? allRecords
                : allRecords.filter((r) => userPlantIds.has(r.plantId));

            setRecords(filteredUserRecords);
            setPlants(userPlants);

            if (userPlants.length > 0 && !formData.plantId) {
                setFormData((prev) => ({ ...prev, plantId: String(userPlants[0].id) }));
            }
        } catch (err) {
            console.error("Error loading health records:", err);
            setError(err.message || "Failed to load health records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenModal = (record = null) => {
        if (plants.length === 0) {
            alert("Please add at least one plant before creating health records!");
            return;
        }

        if (record) {
            setEditingRecordId(record.id);
            setFormData({
                plantId: String(record.plantId),
                assessmentDate: record.assessmentDate
                    ? new Date(record.assessmentDate).toISOString().slice(0, 16)
                    : new Date().toISOString().slice(0, 16),
                overallHealth: record.overallHealth || "Healthy",
                symptoms: record.symptoms || "",
                diagnosedIssues: record.diagnosedIssues || "",
                treatmentsApplied: record.treatmentsApplied || "",
                growthMeasurements: record.growthMeasurements || "",
                notes: record.notes || "",
                followUpDate: record.followUpDate
                    ? new Date(record.followUpDate).toISOString().slice(0, 16)
                    : "",
                recoveryStatus: record.recoveryStatus || "Recovered",
            });
        } else {
            setEditingRecordId(null);
            setFormData({
                plantId: plants[0] ? String(plants[0].id) : "",
                assessmentDate: new Date().toISOString().slice(0, 16),
                overallHealth: "Healthy",
                symptoms: "",
                diagnosedIssues: "",
                treatmentsApplied: "",
                growthMeasurements: "",
                notes: "",
                followUpDate: "",
                recoveryStatus: "Recovered",
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRecordId(null);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.plantId) {
            alert("Please select a plant.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                plantId: Number(formData.plantId),
                assessedById: currentUser?.id || null,
                assessmentDate: formData.assessmentDate ? `${formData.assessmentDate}:00` : new Date().toISOString(),
                overallHealth: formData.overallHealth,
                symptoms: formData.symptoms?.trim() || null,
                diagnosedIssues: formData.diagnosedIssues?.trim() || null,
                treatmentsApplied: formData.treatmentsApplied?.trim() || null,
                growthMeasurements: formData.growthMeasurements?.trim() || null,
                notes: formData.notes?.trim() || null,
                followUpDate: formData.followUpDate ? `${formData.followUpDate}:00` : null,
                recoveryStatus: formData.recoveryStatus,
            };

            if (editingRecordId) {
                await updateHealthRecord(editingRecordId, payload);
            } else {
                await createHealthRecord(payload);
            }

            handleCloseModal();
            loadData();
        } catch (err) {
            alert("Failed to save health record: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (recordId) => {
        if (window.confirm("Are you sure you want to delete this health log?")) {
            try {
                await deleteHealthRecord(recordId);
                setRecords((prev) => prev.filter((r) => r.id !== recordId));
            } catch (err) {
                alert("Failed to delete record: " + err.message);
            }
        }
    };

    const getPlantNickname = (plantId) => {
        const found = plants.find((p) => p.id === plantId);
        return found ? found.nickname : `Plant #${plantId}`;
    };

    // Filter Logic
    const treatmentRecords = records.filter((r) =>
        r.recoveryStatus?.toLowerCase().includes("treatment") ||
        r.recoveryStatus?.toLowerCase().includes("monitoring") ||
        r.overallHealth?.toLowerCase().includes("poor") ||
        r.overallHealth?.toLowerCase().includes("critical")
    );

    const recoveredRecords = records.filter((r) =>
        r.recoveryStatus?.toLowerCase().includes("recovered") ||
        r.overallHealth?.toLowerCase().includes("healthy")
    );

    const displayedRecords = records.filter((r) => {
        if (activeTab === "TREATMENT" && !treatmentRecords.includes(r)) return false;
        if (activeTab === "RECOVERED" && !recoveredRecords.includes(r)) return false;

        if (plantFilter !== "ALL" && String(r.plantId) !== String(plantFilter)) return false;
        if (healthFilter !== "ALL" && r.overallHealth?.toUpperCase() !== healthFilter.toUpperCase()) return false;

        return true;
    });

    const getHealthClass = (health) => {
        const h = health?.toLowerCase() || "";
        if (h.includes("healthy") || h.includes("good")) return "tag-healthy";
        if (h.includes("fair") || h.includes("mild")) return "tag-fair";
        if (h.includes("poor") || h.includes("sick")) return "tag-poor";
        return "tag-critical";
    };

    return (
        <div className="health-page">
            {/* Header */}
            <div className="health-header">
                <div className="health-title-wrap">
                    <span className="health-tagline">Clinical Botanical Logs</span>
                    <h1>Plant Health & Diagnosis</h1>
                    <p>Log health assessments, track treatments, and monitor recovery progress</p>
                </div>

                <button className="add-health-btn" onClick={() => handleOpenModal()}>
                    Log Health Checkup
                </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="health-metrics-grid">
                <div
                    className={`health-stat-card ${activeTab === "ALL" ? "active" : ""}`}
                    onClick={() => setActiveTab("ALL")}
                >
                    <div className="health-stat-info">
                        <span className="stat-num">{records.length}</span>
                        <span className="stat-label">Total Health Logs</span>
                    </div>
                </div>

                <div
                    className={`health-stat-card ${activeTab === "TREATMENT" ? "active" : ""}`}
                    onClick={() => setActiveTab("TREATMENT")}
                >
                    <div className="health-stat-info">
                        <span className="stat-num">{treatmentRecords.length}</span>
                        <span className="stat-label">Active Treatment</span>
                    </div>
                </div>

                <div
                    className={`health-stat-card ${activeTab === "RECOVERED" ? "active" : ""}`}
                    onClick={() => setActiveTab("RECOVERED")}
                >
                    <div className="health-stat-info">
                        <span className="stat-num">{recoveredRecords.length}</span>
                        <span className="stat-label">Healthy & Recovered</span>
                    </div>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="health-controls">
                <select
                    className="filter-select"
                    value={plantFilter}
                    onChange={(e) => setPlantFilter(e.target.value)}
                >
                    <option value="ALL">All Plants</option>
                    {plants.map((p) => (
                        <option key={p.id} value={String(p.id)}>
                            {p.nickname}
                        </option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={healthFilter}
                    onChange={(e) => setHealthFilter(e.target.value)}
                >
                    <option value="ALL">All Health Conditions</option>
                    <option value="HEALTHY">Healthy</option>
                    <option value="FAIR">Fair / Mild Symptoms</option>
                    <option value="POOR">Poor / Needs Treatment</option>
                    <option value="CRITICAL">Critical</option>
                </select>
            </div>

            {error && <div className="alert-message alert-error">{error}</div>}

            {/* Main Records Grid */}
            {loading ? (
                <div className="dashboard-loading">
                    <div className="dashboard-spinner"></div>
                    <h3>Loading health records...</h3>
                </div>
            ) : displayedRecords.length === 0 ? (
                <div className="empty-plants-container">
                    <h3>No health records found</h3>
                    <p>
                        {plants.length === 0
                            ? "Add a plant first to start logging health checkups!"
                            : "Keep your plants thriving by logging their condition, symptoms, and growth milestones."}
                    </p>
                    <button className="add-health-btn" style={{ margin: "0 auto" }} onClick={() => handleOpenModal()}>
                        Log First Health Checkup
                    </button>
                </div>
            ) : (
                <div className="health-records-grid">
                    {displayedRecords.map((record) => (
                        <div key={record.id} className="health-card">
                            <div className="health-card-header">
                                <div className="health-card-plant">
                                    <h3>{record.plantNickname || getPlantNickname(record.plantId)}</h3>
                                </div>
                                <span className="health-card-date">
                                    {record.assessmentDate
                                        ? new Date(record.assessmentDate).toLocaleDateString(undefined, {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                          })
                                        : "Recent"}
                                </span>
                            </div>

                            <div className="health-card-body">
                                <div className="status-badges-row">
                                    <span className={`health-tag ${getHealthClass(record.overallHealth)}`}>
                                        {record.overallHealth || "Healthy"}
                                    </span>
                                    <span className="recovery-tag">
                                        Status: {record.recoveryStatus || "Recovered"}
                                    </span>
                                </div>

                                {record.symptoms && (
                                    <div className="health-detail-block">
                                        <span className="detail-label">Symptoms Observed</span>
                                        <div className="symptoms-text">{record.symptoms}</div>
                                    </div>
                                )}

                                {record.diagnosedIssues && (
                                    <div className="health-detail-block">
                                        <span className="detail-label">Diagnosed Issues</span>
                                        <div className="detail-text">{record.diagnosedIssues}</div>
                                    </div>
                                )}

                                {record.treatmentsApplied && (
                                    <div className="health-detail-block">
                                        <span className="detail-label">Treatment Applied</span>
                                        <div className="treatment-text">{record.treatmentsApplied}</div>
                                    </div>
                                )}

                                {record.growthMeasurements && (
                                    <div className="health-detail-block">
                                        <span className="detail-label">Growth Progress</span>
                                        <div className="detail-text">{record.growthMeasurements}</div>
                                    </div>
                                )}

                                {record.followUpDate && (
                                    <div className="follow-up-pill">
                                        <span>Next Follow-up:</span>
                                        <span>
                                            {new Date(record.followUpDate).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                )}

                                {record.notes && (
                                    <div className="plant-notes" style={{ marginTop: "4px" }}>
                                        {record.notes}
                                    </div>
                                )}
                            </div>

                            <div className="health-card-footer">
                                <button
                                    className="health-btn-action"
                                    onClick={() => handleOpenModal(record)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="health-btn-action delete"
                                    onClick={() => handleDelete(record.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Log / Edit Health Checkup Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingRecordId ? "Edit Health Log" : "Log Plant Health Checkup"}</h2>
                            <button className="modal-close-btn" onClick={handleCloseModal}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="modal-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Select Plant *</label>
                                    <select
                                        name="plantId"
                                        value={formData.plantId}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        {plants.map((p) => (
                                            <option key={p.id} value={String(p.id)}>
                                                {p.nickname} ({p.speciesCommonName || "Botanical Specimen"})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Assessment Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        name="assessmentDate"
                                        value={formData.assessmentDate}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Overall Health Condition *</label>
                                    <select
                                        name="overallHealth"
                                        value={formData.overallHealth}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="Healthy">Healthy & Thriving</option>
                                        <option value="Fair">Fair / Mild Symptoms</option>
                                        <option value="Poor">Poor / Needs Attention</option>
                                        <option value="Critical">Critical / Severe Distress</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Recovery Status *</label>
                                    <select
                                        name="recoveryStatus"
                                        value={formData.recoveryStatus}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="Recovered">Recovered / Stable</option>
                                        <option value="Improving">Improving</option>
                                        <option value="In Treatment">Active Treatment</option>
                                        <option value="Monitoring">Under Monitoring</option>
                                        <option value="Dormant">Dormant Period</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Symptoms Observed</label>
                                <input
                                    type="text"
                                    name="symptoms"
                                    placeholder="e.g. Lower leaves yellowing, crispy edges..."
                                    value={formData.symptoms}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Diagnosed Issues / Cause</label>
                                    <input
                                        type="text"
                                        name="diagnosedIssues"
                                        placeholder="e.g. Overwatering, spider mites, underwatered"
                                        value={formData.diagnosedIssues}
                                        onChange={handleFormChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Treatment Applied</label>
                                    <input
                                        type="text"
                                        name="treatmentsApplied"
                                        placeholder="e.g. Sprayed neem oil dilution, adjusted watering"
                                        value={formData.treatmentsApplied}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Growth Measurements / Progress</label>
                                    <input
                                        type="text"
                                        name="growthMeasurements"
                                        placeholder="e.g. Height: 35cm, 2 new leaves sprouted"
                                        value={formData.growthMeasurements}
                                        onChange={handleFormChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Follow-up Checkup Date (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        name="followUpDate"
                                        value={formData.followUpDate}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Additional Notes / Observations</label>
                                <textarea
                                    name="notes"
                                    rows="3"
                                    placeholder="e.g. Soil was soggy at bottom of pot. Relocated nearer to window..."
                                    value={formData.notes}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save" disabled={saving}>
                                    {saving ? "Saving..." : editingRecordId ? "Update Log" : "Save Health Log"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HealthRecords;
