import { useState, useEffect } from "react";
import {
    getAllSpecies,
    createSpecies,
    updateSpecies,
    deleteSpecies,
} from "../services/speciesService";
import { getCurrentUser } from "../services/authService";
import "./Species.css";

function Species() {
    const [speciesList, setSpeciesList] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search and filters
    const [searchTerm, setSearchTerm] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("ALL");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSpeciesId, setEditingSpeciesId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        commonName: "",
        scientificName: "",
        familyName: "",
        careDifficulty: "Easy",
        lightRequirements: "Bright Indirect Light",
        waterFrequencyDays: 7,
        humidityMin: 40,
        humidityMax: 70,
        temperatureMinCelsius: "15.0",
        temperatureMaxCelsius: "28.0",
        soilPhMin: "5.5",
        soilPhMax: "7.0",
        growthRate: "Moderate",
        maxHeightCm: 100,
        fertilizerFrequencyDays: 30,
        pruningFrequencyDays: 90,
        repottingFrequencyMonths: 12,
        careTips: "",
        commonIssues: "",
    });

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const [userData, list] = await Promise.all([
                getCurrentUser().catch(() => null),
                getAllSpecies().catch(() => []),
            ]);

            setCurrentUser(userData);
            setSpeciesList(list);
        } catch (err) {
            console.error("Error loading species catalog:", err);
            setError(err.message || "Failed to load botanical species catalog.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenModal = (species = null) => {
        if (species) {
            setEditingSpeciesId(species.id);
            setFormData({
                commonName: species.commonName || "",
                scientificName: species.scientificName || "",
                familyName: species.familyName || "",
                careDifficulty: species.careDifficulty || "Easy",
                lightRequirements: species.lightRequirements || "Bright Indirect Light",
                waterFrequencyDays: species.waterFrequencyDays || 7,
                humidityMin: species.humidityMin || 40,
                humidityMax: species.humidityMax || 70,
                temperatureMinCelsius: species.temperatureMinCelsius != null ? String(species.temperatureMinCelsius) : "15.0",
                temperatureMaxCelsius: species.temperatureMaxCelsius != null ? String(species.temperatureMaxCelsius) : "28.0",
                soilPhMin: species.soilPhMin != null ? String(species.soilPhMin) : "5.5",
                soilPhMax: species.soilPhMax != null ? String(species.soilPhMax) : "7.0",
                growthRate: species.growthRate || "Moderate",
                maxHeightCm: species.maxHeightCm || 100,
                fertilizerFrequencyDays: species.fertilizerFrequencyDays || 30,
                pruningFrequencyDays: species.pruningFrequencyDays || 90,
                repottingFrequencyMonths: species.repottingFrequencyMonths || 12,
                careTips: species.careTips || "",
                commonIssues: species.commonIssues || "",
            });
        } else {
            setEditingSpeciesId(null);
            setFormData({
                commonName: "",
                scientificName: "",
                familyName: "",
                careDifficulty: "Easy",
                lightRequirements: "Bright Indirect Light",
                waterFrequencyDays: 7,
                humidityMin: 40,
                humidityMax: 70,
                temperatureMinCelsius: "15.0",
                temperatureMaxCelsius: "28.0",
                soilPhMin: "5.5",
                soilPhMax: "7.0",
                growthRate: "Moderate",
                maxHeightCm: 100,
                fertilizerFrequencyDays: 30,
                pruningFrequencyDays: 90,
                repottingFrequencyMonths: 12,
                careTips: "",
                commonIssues: "",
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSpeciesId(null);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.commonName.trim() || !formData.scientificName.trim()) {
            alert("Common Name and Scientific Name are required.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                commonName: formData.commonName.trim(),
                scientificName: formData.scientificName.trim(),
                familyName: formData.familyName.trim() || null,
                careDifficulty: formData.careDifficulty,
                lightRequirements: formData.lightRequirements,
                waterFrequencyDays: Number(formData.waterFrequencyDays) || 7,
                humidityMin: formData.humidityMin ? Number(formData.humidityMin) : null,
                humidityMax: formData.humidityMax ? Number(formData.humidityMax) : null,
                temperatureMinCelsius: formData.temperatureMinCelsius ? Number(formData.temperatureMinCelsius) : null,
                temperatureMaxCelsius: formData.temperatureMaxCelsius ? Number(formData.temperatureMaxCelsius) : null,
                soilPhMin: formData.soilPhMin ? Number(formData.soilPhMin) : null,
                soilPhMax: formData.soilPhMax ? Number(formData.soilPhMax) : null,
                growthRate: formData.growthRate,
                maxHeightCm: formData.maxHeightCm ? Number(formData.maxHeightCm) : null,
                fertilizerFrequencyDays: formData.fertilizerFrequencyDays ? Number(formData.fertilizerFrequencyDays) : null,
                pruningFrequencyDays: formData.pruningFrequencyDays ? Number(formData.pruningFrequencyDays) : null,
                repottingFrequencyMonths: formData.repottingFrequencyMonths ? Number(formData.repottingFrequencyMonths) : null,
                careTips: formData.careTips?.trim() || null,
                commonIssues: formData.commonIssues?.trim() || null,
            };

            if (editingSpeciesId) {
                await updateSpecies(editingSpeciesId, payload);
            } else {
                await createSpecies(payload);
            }

            handleCloseModal();
            loadData();
        } catch (err) {
            alert("Failed to save species: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this species entry?")) {
            try {
                await deleteSpecies(id);
                setSpeciesList((prev) => prev.filter((s) => s.id !== id));
            } catch (err) {
                alert("Failed to delete species: " + err.message);
            }
        }
    };

    // Filter Logic
    const displayedSpecies = speciesList.filter((s) => {
        if (difficultyFilter !== "ALL" && s.careDifficulty?.toLowerCase() !== difficultyFilter.toLowerCase()) {
            return false;
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            const common = s.commonName?.toLowerCase() || "";
            const sci = s.scientificName?.toLowerCase() || "";
            const fam = s.familyName?.toLowerCase() || "";
            if (!common.includes(term) && !sci.includes(term) && !fam.includes(term)) {
                return false;
            }
        }

        return true;
    });

    const getDifficultyBadgeClass = (diff) => {
        const d = diff?.toLowerCase() || "";
        if (d.includes("easy") || d.includes("low")) return "difficulty-easy";
        if (d.includes("hard") || d.includes("diff") || d.includes("expert")) return "difficulty-hard";
        return "difficulty-medium";
    };

    const isStaff = currentUser?.role === "ADMIN" || currentUser?.role === "SPECIALIST";

    return (
        <div className="species-page">
            {/* Header */}
            <div className="species-header">
                <div className="species-title-wrap">
                    <span className="species-tagline">Taxonomic Database</span>
                    <h1>Botanical Species Library</h1>
                    <p>Explore plant care profiles, water frequency guidelines, humidity tolerances, and light requirements</p>
                </div>

                {isStaff && (
                    <button className="add-species-btn" onClick={() => handleOpenModal()}>
                        Add Botanical Species
                    </button>
                )}
            </div>

            {/* Filter & Search Bar */}
            <div className="health-controls">
                <input
                    type="text"
                    className="filter-select"
                    style={{ minWidth: "260px", flex: "1" }}
                    placeholder="Search by common name, scientific name, or botanical family..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="filter-select"
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                    <option value="ALL">All Care Difficulties</option>
                    <option value="EASY">Easy / Beginner</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="DIFFICULT">Difficult / Expert</option>
                </select>
            </div>

            {error && <div className="alert-message alert-error">{error}</div>}

            {/* Main Grid */}
            {loading ? (
                <div className="dashboard-loading">
                    <div className="dashboard-spinner"></div>
                    <h3>Loading botanical species catalog...</h3>
                </div>
            ) : displayedSpecies.length === 0 ? (
                <div className="empty-plants-container">
                    <h3>No species found</h3>
                    <p>Try searching for a different plant name or add a new botanical species entry.</p>
                </div>
            ) : (
                <div className="species-grid">
                    {displayedSpecies.map((s) => (
                        <div key={s.id} className="species-card">
                            <div>
                                <div className="species-card-header">
                                    <div className="species-names">
                                        <h3>{s.commonName}</h3>
                                        <p className="species-scientific">{s.scientificName}</p>
                                        {s.familyName && <span className="species-family">{s.familyName}</span>}
                                    </div>
                                    <span className={`difficulty-badge ${getDifficultyBadgeClass(s.careDifficulty)}`}>
                                        {s.careDifficulty || "Easy"}
                                    </span>
                                </div>

                                <div className="species-specs-table" style={{ marginTop: "14px" }}>
                                    <div className="spec-item">
                                        <span className="spec-item-label">Watering</span>
                                        <span className="spec-item-val">Every {s.waterFrequencyDays || 7} days</span>
                                    </div>

                                    <div className="spec-item">
                                        <span className="spec-item-label">Light</span>
                                        <span className="spec-item-val">{s.lightRequirements || "Moderate"}</span>
                                    </div>

                                    <div className="spec-item">
                                        <span className="spec-item-label">Temperature</span>
                                        <span className="spec-item-val">
                                            {s.temperatureMinCelsius || 15}°C - {s.temperatureMaxCelsius || 30}°C
                                        </span>
                                    </div>

                                    <div className="spec-item">
                                        <span className="spec-item-label">Humidity</span>
                                        <span className="spec-item-val">
                                            {s.humidityMin || 40}% - {s.humidityMax || 80}%
                                        </span>
                                    </div>
                                </div>

                                {s.careTips && (
                                    <div className="species-tips-box" style={{ marginTop: "12px" }}>
                                        <strong>Care Tips:</strong> {s.careTips}
                                    </div>
                                )}
                            </div>

                            {isStaff && (
                                <div className="species-card-footer">
                                    <button
                                        className="health-btn-action"
                                        onClick={() => handleOpenModal(s)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="health-btn-action delete"
                                        onClick={() => handleDelete(s.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" style={{ maxWidth: "680px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingSpeciesId ? "Edit Species" : "Add Botanical Species"}</h2>
                            <button className="modal-close-btn" onClick={handleCloseModal}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="modal-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Common Name *</label>
                                    <input
                                        type="text"
                                        name="commonName"
                                        placeholder="e.g. Monstera Deliciosa"
                                        value={formData.commonName}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Scientific Name *</label>
                                    <input
                                        type="text"
                                        name="scientificName"
                                        placeholder="e.g. Monstera deliciosa Liebm."
                                        value={formData.scientificName}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Botanical Family</label>
                                    <input
                                        type="text"
                                        name="familyName"
                                        placeholder="e.g. Araceae"
                                        value={formData.familyName}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Care Difficulty</label>
                                    <select
                                        name="careDifficulty"
                                        value={formData.careDifficulty}
                                        onChange={handleFormChange}
                                    >
                                        <option value="Easy">Easy (Beginner-friendly)</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Difficult">Difficult / Expert</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Water Frequency (Days) *</label>
                                    <input
                                        type="number"
                                        name="waterFrequencyDays"
                                        min="1"
                                        value={formData.waterFrequencyDays}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Light Requirements</label>
                                    <input
                                        type="text"
                                        name="lightRequirements"
                                        placeholder="e.g. Bright Indirect Light"
                                        value={formData.lightRequirements}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Min / Max Humidity (%)</label>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <input
                                            type="number"
                                            name="humidityMin"
                                            placeholder="Min %"
                                            value={formData.humidityMin}
                                            onChange={handleFormChange}
                                        />
                                        <input
                                            type="number"
                                            name="humidityMax"
                                            placeholder="Max %"
                                            value={formData.humidityMax}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Temperature Range (°C)</label>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <input
                                            type="number"
                                            step="0.5"
                                            name="temperatureMinCelsius"
                                            placeholder="Min °C"
                                            value={formData.temperatureMinCelsius}
                                            onChange={handleFormChange}
                                        />
                                        <input
                                            type="number"
                                            step="0.5"
                                            name="temperatureMaxCelsius"
                                            placeholder="Max °C"
                                            value={formData.temperatureMaxCelsius}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Care Tips & Instructions</label>
                                <textarea
                                    name="careTips"
                                    rows="2"
                                    placeholder="e.g. Wipe leaves monthly to maximize photosynthesis and prevent dust buildup."
                                    value={formData.careTips}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save" disabled={saving}>
                                    {saving ? "Saving..." : editingSpeciesId ? "Update Species" : "Add Species"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Species;
