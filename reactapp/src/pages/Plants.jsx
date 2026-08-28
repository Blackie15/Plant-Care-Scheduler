import { useState, useEffect } from "react";
import {
    getPlants,
    getSpecies,
    createSpecies,
    createPlant,
    updatePlant,
    deletePlant,
} from "../services/plantService";
import { getCurrentUser } from "../services/authService";
import "./Plants.css";

function Plants() {
    const [plants, setPlants] = useState([]);
    const [speciesList, setSpeciesList] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter and search
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlantId, setEditingPlantId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        nickname: "",
        speciesId: "",
        location: "Living Room",
        healthStatus: "Healthy",
        potSize: '6" Terracotta',
        soilType: "Well-draining mix",
        currentHeightCm: "",
        acquisitionDate: new Date().toISOString().split("T")[0],
        notes: "",
    });

    // Custom species data for "OTHER" selection
    const [customSpecies, setCustomSpecies] = useState({
        commonName: "",
        scientificName: "",
        waterFrequencyDays: "7",
        careDifficulty: "Easy",
        careTips: "Water when top soil is dry. Provide bright indirect light.",
    });

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const userData = await getCurrentUser();
            setCurrentUser(userData);

            const [plantsData, fetchedSpecies] = await Promise.all([
                getPlants(userData.id).catch(() => []),
                getSpecies().catch(() => []),
            ]);

            setSpeciesList(fetchedSpecies);

            // Ensure only user's plants are displayed (unless ADMIN)
            const userPlants = userData.role === "ADMIN"
                ? plantsData
                : plantsData.filter((p) => p.ownerId === userData.id || !p.ownerId);

            setPlants(userPlants);

            if (fetchedSpecies.length > 0 && !formData.speciesId) {
                setFormData((prev) => ({ ...prev, speciesId: String(fetchedSpecies[0].id) }));
            }
        } catch (err) {
            console.error("Error loading plants:", err);
            setError(err.message || "Failed to load plants.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenModal = (plant = null) => {
        if (plant) {
            setEditingPlantId(plant.id);
            setFormData({
                nickname: plant.nickname || "",
                speciesId: String(plant.speciesId || (speciesList[0] ? speciesList[0].id : "")),
                location: plant.location || "Living Room",
                healthStatus: plant.healthStatus || "Healthy",
                potSize: plant.potSize || "",
                soilType: plant.soilType || "",
                currentHeightCm: plant.currentHeightCm || "",
                acquisitionDate: plant.acquisitionDate || "",
                notes: plant.notes || "",
            });
        } else {
            setEditingPlantId(null);
            setFormData({
                nickname: "",
                speciesId: speciesList[0] ? String(speciesList[0].id) : "OTHER",
                location: "Living Room",
                healthStatus: "Healthy",
                potSize: '6" Terracotta',
                soilType: "Well-draining potting mix",
                currentHeightCm: "25",
                acquisitionDate: new Date().toISOString().split("T")[0],
                notes: "",
            });
            setCustomSpecies({
                commonName: "",
                scientificName: "",
                waterFrequencyDays: "7",
                careDifficulty: "Easy",
                careTips: "Water when top soil is dry. Provide bright indirect light.",
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlantId(null);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCustomSpeciesChange = (e) => {
        setCustomSpecies({
            ...customSpecies,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser?.id) {
            alert("Please log in to manage your plants.");
            return;
        }

        setSaving(true);
        try {
            let finalSpeciesId = null;

            // If user selected "OTHER" -> create custom species in backend, MySQL auto-generates the ID
            if (formData.speciesId === "OTHER") {
                if (!customSpecies.commonName.trim()) {
                    alert("Please enter a common name for your custom plant species.");
                    setSaving(false);
                    return;
                }

                const newSpeciesPayload = {
                    commonName: customSpecies.commonName.trim(),
                    scientificName: customSpecies.scientificName.trim() || `${customSpecies.commonName.trim()} sp.`,
                    waterFrequencyDays: Number(customSpecies.waterFrequencyDays) || 7,
                    careDifficulty: customSpecies.careDifficulty || "Easy",
                    careTips: customSpecies.careTips?.trim() || "Regular watering when top soil is dry.",
                };

                const savedSpecies = await createSpecies(newSpeciesPayload);
                finalSpeciesId = savedSpecies.id;
                setSpeciesList((prev) => [...prev, savedSpecies]);
            } else {
                finalSpeciesId = Number(formData.speciesId);
            }

            const payload = {
                nickname: formData.nickname.trim(),
                ownerId: currentUser.id,
                speciesId: finalSpeciesId,
                location: formData.location?.trim() || null,
                healthStatus: formData.healthStatus || "Healthy",
                potSize: formData.potSize?.trim() || null,
                soilType: formData.soilType?.trim() || null,
                currentHeightCm: formData.currentHeightCm ? Number(formData.currentHeightCm) : null,
                acquisitionDate: formData.acquisitionDate || null,
                notes: formData.notes?.trim() || null,
            };

            if (editingPlantId) {
                await updatePlant(editingPlantId, payload);
            } else {
                await createPlant(payload);
            }

            handleCloseModal();
            loadData();
        } catch (err) {
            alert("Failed to save plant: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, nickname) => {
        if (window.confirm(`Are you sure you want to remove "${nickname}"?`)) {
            try {
                await deletePlant(id);
                setPlants(plants.filter((p) => p.id !== id));
            } catch (err) {
                alert("Failed to delete plant: " + err.message);
            }
        }
    };

    // Filter plants
    const filteredPlants = plants.filter((plant) => {
        const matchesSearch =
            plant.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plant.speciesCommonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plant.location?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "ALL" ||
            plant.healthStatus?.toUpperCase() === statusFilter.toUpperCase();

        return matchesSearch && matchesStatus;
    });

    const selectedSpecies = speciesList.find(
        (s) => String(s.id) === String(formData.speciesId)
    );

    const getStatusClass = (status) => {
        const s = status?.toLowerCase() || "";
        if (s.includes("healthy") || s.includes("good") || s.includes("thriving")) {
            return "status-healthy";
        }
        if (s.includes("attention") || s.includes("dry") || s.includes("warning")) {
            return "status-warning";
        }
        return "status-critical";
    };

    return (
        <div className="plants-page">
            {/* Header */}
            <div className="plants-header">
                <div className="plants-title-wrap">
                    <span className="plants-tagline">Botanical Inventory</span>
                    <h1>
                        Plant Profile Showcase
                        <span className="plant-count-pill">
                            {plants.length} {plants.length === 1 ? "Plant" : "Plants"}
                        </span>
                    </h1>
                    <p>Track growth metrics, locations, and care parameters of your collection</p>
                </div>

                <button className="add-plant-btn" onClick={() => handleOpenModal()}>
                    Add New Plant
                </button>
            </div>

            {/* Controls */}
            <div className="plants-controls">
                <div className="search-input-wrap">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by nickname, species, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Health Statuses</option>
                    <option value="HEALTHY">Healthy / Thriving</option>
                    <option value="NEEDS_ATTENTION">Needs Attention</option>
                    <option value="CRITICAL">Critical</option>
                </select>
            </div>

            {error && <div className="alert-message alert-error">{error}</div>}

            {/* Main Content / Grid */}
            {loading ? (
                <div className="dashboard-loading">
                    <div className="dashboard-spinner"></div>
                    <h3>Loading your plant collection...</h3>
                </div>
            ) : filteredPlants.length === 0 ? (
                <div className="empty-plants-container">
                    <h3>No plants found</h3>
                    <p>
                        {searchTerm || statusFilter !== "ALL"
                            ? "No plants matched your search or filters. Try resetting them."
                            : "Your botanical collection is waiting. Start by adding your first plant!"}
                    </p>
                    <button className="add-plant-btn" style={{ margin: "0 auto" }} onClick={() => handleOpenModal()}>
                        Add Your First Plant
                    </button>
                </div>
            ) : (
                <div className="plants-grid">
                    {filteredPlants.map((plant) => (
                        <div key={plant.id} className="plant-card">
                            <div className="plant-card-hero">
                                <span className={`plant-status-tag ${getStatusClass(plant.healthStatus)}`}>
                                    {plant.healthStatus || "Healthy"}
                                </span>
                            </div>

                            <div className="plant-card-body">
                                <div className="plant-name-row">
                                    <h3 className="plant-nickname">{plant.nickname}</h3>
                                    <span className="plant-species-name">
                                        {plant.speciesCommonName || "Botanical Specimen"}
                                    </span>
                                </div>

                                <div className="plant-info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Location</span>
                                        <span className="info-val">{plant.location || "Indoor"}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Pot Size</span>
                                        <span className="info-val">{plant.potSize || '6"'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Height</span>
                                        <span className="info-val">
                                            {plant.currentHeightCm ? `${plant.currentHeightCm} cm` : "N/A"}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Acquired</span>
                                        <span className="info-val">
                                            {plant.acquisitionDate || "Recently"}
                                        </span>
                                    </div>
                                </div>

                                {plant.notes && (
                                    <div className="plant-notes">
                                        {plant.notes}
                                    </div>
                                )}

                                <div className="plant-card-actions">
                                    <button
                                        className="action-btn-secondary"
                                        onClick={() => handleOpenModal(plant)}
                                    >
                                        Edit Details
                                    </button>
                                    <button
                                        className="action-btn-delete"
                                        onClick={() => handleDelete(plant.id, plant.nickname)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Plant Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingPlantId ? "Edit Plant Details" : "Add New Plant"}</h2>
                            <button className="modal-close-btn" onClick={handleCloseModal}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="modal-form">
                            {/* Beginner Guidance helper banner */}
                            <div className="beginner-guide-card">
                                <strong>Care Advice:</strong> Select your plant's species or choose a general category for automated care schedules.
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Plant Nickname *</label>
                                    <input
                                        type="text"
                                        name="nickname"
                                        placeholder="e.g. Monty the Monstera, Desk Pothos"
                                        value={formData.nickname}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Plant Species / Category *</label>
                                    <select
                                        name="speciesId"
                                        value={formData.speciesId}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        {speciesList.some((s) => s.commonName?.toLowerCase().includes("unknown") || s.commonName?.toLowerCase().includes("general")) && (
                                            <optgroup label="General Categories">
                                                {speciesList
                                                    .filter((s) => s.commonName?.toLowerCase().includes("unknown") || s.commonName?.toLowerCase().includes("general"))
                                                    .map((s) => (
                                                        <option key={s.id} value={String(s.id)}>
                                                            {s.commonName}
                                                        </option>
                                                    ))}
                                            </optgroup>
                                        )}

                                        <optgroup label="Popular Houseplants">
                                            {speciesList
                                                .filter((s) => !s.commonName?.toLowerCase().includes("unknown") && !s.commonName?.toLowerCase().includes("general"))
                                                .map((s) => (
                                                    <option key={s.id} value={String(s.id)}>
                                                        {s.commonName} {s.scientificName ? `(${s.scientificName})` : ""}
                                                    </option>
                                                ))}
                                        </optgroup>

                                        <optgroup label="Custom Species">
                                            <option value="OTHER">
                                                Other / Enter Custom Species
                                            </option>
                                        </optgroup>
                                    </select>
                                </div>
                            </div>

                            {/* Show Custom Species Input Box if OTHER is chosen */}
                            {formData.speciesId === "OTHER" && (
                                <div className="custom-species-box">
                                    <h4 className="custom-species-title">Custom Species Details</h4>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Common Name *</label>
                                            <input
                                                type="text"
                                                name="commonName"
                                                placeholder="e.g. String of Pearls, Zebra Cactus"
                                                value={customSpecies.commonName}
                                                onChange={handleCustomSpeciesChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Watering Interval (Days) *</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="60"
                                                name="waterFrequencyDays"
                                                placeholder="e.g. 7"
                                                value={customSpecies.waterFrequencyDays}
                                                onChange={handleCustomSpeciesChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Scientific Name (Optional)</label>
                                        <input
                                            type="text"
                                            name="scientificName"
                                            placeholder="e.g. Senecio rowleyanus"
                                            value={customSpecies.scientificName}
                                            onChange={handleCustomSpeciesChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Care Tips (Optional)</label>
                                        <input
                                            type="text"
                                            name="careTips"
                                            placeholder="e.g. Loves bright direct sun, water when top soil dries"
                                            value={customSpecies.careTips}
                                            onChange={handleCustomSpeciesChange}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Species Tips display for selected existing species */}
                            {formData.speciesId !== "OTHER" && selectedSpecies?.careTips && (
                                <div className="species-tips-box">
                                    <strong>Botanical Care Advice:</strong> {selectedSpecies.careTips}
                                    {selectedSpecies.waterFrequencyDays && (
                                        <div style={{ marginTop: "4px" }}>
                                            Suggested watering interval: Every {selectedSpecies.waterFrequencyDays} days
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Location in Home / Garden</label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="e.g. Balcony, Living Room, Window Sill"
                                        value={formData.location}
                                        onChange={handleFormChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Health Status</label>
                                    <select
                                        name="healthStatus"
                                        value={formData.healthStatus}
                                        onChange={handleFormChange}
                                    >
                                        <option value="Healthy">Healthy & Thriving</option>
                                        <option value="Good">Good</option>
                                        <option value="Needs Attention">Needs Attention</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Pot Size</label>
                                    <input
                                        type="text"
                                        name="potSize"
                                        placeholder="e.g. 6 inch Terracotta, Ceramic"
                                        value={formData.potSize}
                                        onChange={handleFormChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Current Height (cm)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="currentHeightCm"
                                        placeholder="e.g. 30"
                                        value={formData.currentHeightCm}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Soil Type</label>
                                    <input
                                        type="text"
                                        name="soilType"
                                        placeholder="e.g. Well-draining potting mix, Perlite"
                                        value={formData.soilType}
                                        onChange={handleFormChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Acquisition Date</label>
                                    <input
                                        type="date"
                                        name="acquisitionDate"
                                        value={formData.acquisitionDate}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Notes / Observations</label>
                                <textarea
                                    name="notes"
                                    rows="3"
                                    placeholder="e.g. loves morning sunlight, repotted with fresh mix..."
                                    value={formData.notes}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save" disabled={saving}>
                                    {saving ? "Saving..." : editingPlantId ? "Update Plant" : "Add Plant"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Plants;
