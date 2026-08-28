import { useState, useEffect } from "react";
import {
    getAllEnvironmentData,
    createEnvironmentData,
    updateEnvironmentData,
    deleteEnvironmentData,
} from "../services/environmentService";
import { getPlants } from "../services/plantService";
import { getCurrentUser } from "../services/authService";
import "./Environment.css";

function Environment() {
    const [records, setRecords] = useState([]);
    const [userPlants, setUserPlants] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Plant filter
    const [selectedPlantFilter, setSelectedPlantFilter] = useState("ALL");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        plantId: "",
        locationId: "Living Room Window",
        sensorId: "IOT-SENS-01",
        temperatureCelsius: "23.5",
        humidityPercentage: "60",
        lightLevelLux: "1500",
        soilMoisturePercentage: "45",
        phLevel: "6.5",
        dataSource: "IoT Sensor",
        recordedDate: new Date().toISOString().slice(0, 16),
    });

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const userData = await getCurrentUser();
            setCurrentUser(userData);

            const [allTelemetry, plants] = await Promise.all([
                getAllEnvironmentData().catch(() => []),
                getPlants(userData?.id).catch(() => []),
            ]);

            setUserPlants(plants);

            // Filter telemetry for user plants (unless admin)
            const isStaff = userData?.role === "ADMIN" || userData?.role === "SPECIALIST";
            const userPlantIds = new Set(plants.map((p) => p.id));
            const filteredTelemetry = isStaff
                ? allTelemetry
                : allTelemetry.filter((t) => userPlantIds.has(t.plantId));

            // Sort by most recent recordedDate
            filteredTelemetry.sort((a, b) => new Date(b.recordedDate || 0) - new Date(a.recordedDate || 0));
            setRecords(filteredTelemetry);
        } catch (err) {
            console.error("Error loading environment data:", err);
            setError(err.message || "Failed to load environment telemetry.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecordId(record.id);
            setFormData({
                plantId: record.plantId ? String(record.plantId) : "",
                locationId: record.locationId || "Living Room Window",
                sensorId: record.sensorId || "IOT-SENS-01",
                temperatureCelsius: record.temperatureCelsius != null ? String(record.temperatureCelsius) : "23.5",
                humidityPercentage: record.humidityPercentage != null ? String(record.humidityPercentage) : "60",
                lightLevelLux: record.lightLevelLux != null ? String(record.lightLevelLux) : "1500",
                soilMoisturePercentage: record.soilMoisturePercentage != null ? String(record.soilMoisturePercentage) : "45",
                phLevel: record.phLevel != null ? String(record.phLevel) : "6.5",
                dataSource: record.dataSource || "IoT Sensor",
                recordedDate: record.recordedDate
                    ? new Date(record.recordedDate).toISOString().slice(0, 16)
                    : new Date().toISOString().slice(0, 16),
            });
        } else {
            setEditingRecordId(null);
            setFormData({
                plantId: userPlants.length > 0 ? String(userPlants[0].id) : "",
                locationId: "Living Room Window",
                sensorId: "IOT-SENS-01",
                temperatureCelsius: "23.5",
                humidityPercentage: "60",
                lightLevelLux: "1500",
                soilMoisturePercentage: "45",
                phLevel: "6.5",
                dataSource: "IoT Sensor",
                recordedDate: new Date().toISOString().slice(0, 16),
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
                locationId: formData.locationId?.trim() || null,
                sensorId: formData.sensorId?.trim() || null,
                temperatureCelsius: formData.temperatureCelsius ? Number(formData.temperatureCelsius) : null,
                humidityPercentage: formData.humidityPercentage ? Number(formData.humidityPercentage) : null,
                lightLevelLux: formData.lightLevelLux ? Number(formData.lightLevelLux) : null,
                soilMoisturePercentage: formData.soilMoisturePercentage ? Number(formData.soilMoisturePercentage) : null,
                phLevel: formData.phLevel ? Number(formData.phLevel) : null,
                dataSource: formData.dataSource || "Manual Entry",
                recordedDate: formData.recordedDate ? `${formData.recordedDate}:00` : new Date().toISOString(),
            };

            if (editingRecordId) {
                await updateEnvironmentData(editingRecordId, payload);
            } else {
                await createEnvironmentData(payload);
            }

            handleCloseModal();
            loadData();
        } catch (err) {
            alert("Failed to save environment data: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this telemetry reading?")) {
            try {
                await deleteEnvironmentData(id);
                setRecords((prev) => prev.filter((r) => r.id !== id));
            } catch (err) {
                alert("Failed to delete reading: " + err.message);
            }
        }
    };

    // Filter Logic
    const displayedRecords = records.filter((r) => {
        if (selectedPlantFilter !== "ALL" && String(r.plantId) !== selectedPlantFilter) {
            return false;
        }
        return true;
    });

    // Summary calculations
    const validTemps = displayedRecords.filter((r) => r.temperatureCelsius != null).map((r) => Number(r.temperatureCelsius));
    const avgTemp = validTemps.length > 0 ? (validTemps.reduce((a, b) => a + b, 0) / validTemps.length).toFixed(1) : "--";

    const validHumids = displayedRecords.filter((r) => r.humidityPercentage != null).map((r) => Number(r.humidityPercentage));
    const avgHumid = validHumids.length > 0 ? Math.round(validHumids.reduce((a, b) => a + b, 0) / validHumids.length) : "--";

    const validLux = displayedRecords.filter((r) => r.lightLevelLux != null).map((r) => Number(r.lightLevelLux));
    const avgLux = validLux.length > 0 ? Math.round(validLux.reduce((a, b) => a + b, 0) / validLux.length) : "--";

    const validMoisture = displayedRecords.filter((r) => r.soilMoisturePercentage != null).map((r) => Number(r.soilMoisturePercentage));
    const avgMoisture = validMoisture.length > 0 ? Math.round(validMoisture.reduce((a, b) => a + b, 0) / validMoisture.length) : "--";

    return (
        <div className="environment-page">
            {/* Header */}
            <div className="environment-header">
                <div className="environment-title-wrap">
                    <h1>
                        <span className="env-tagline">IoT Microclimate Telemetry</span>
                        Sensors & Environmental Telemetry
                    </h1>
                    <p>Track microclimates, ambient temperature, sunlight intensity (Lux), and soil moisture levels</p>
                </div>

                <button className="log-env-btn" onClick={() => handleOpenModal()}>
                    Log Sensor Reading
                </button>
            </div>

            {/* Metrics Overview */}
            <div className="env-metrics-grid">
                <div className="env-metric-card">
                    <div className="env-metric-info">
                        <span className="env-metric-val">{avgTemp}°C</span>
                        <span className="env-metric-sub">Average Temperature</span>
                    </div>
                </div>

                <div className="env-metric-card">
                    <div className="env-metric-info">
                        <span className="env-metric-val">{avgHumid}%</span>
                        <span className="env-metric-sub">Average Humidity</span>
                    </div>
                </div>

                <div className="env-metric-card">
                    <div className="env-metric-info">
                        <span className="env-metric-val">{avgLux} Lux</span>
                        <span className="env-metric-sub">Ambient Light</span>
                    </div>
                </div>

                <div className="env-metric-card">
                    <div className="env-metric-info">
                        <span className="env-metric-val">{avgMoisture}%</span>
                        <span className="env-metric-sub">Soil Moisture</span>
                    </div>
                </div>
            </div>

            {/* Filter by Plant */}
            <div className="health-controls">
                <select
                    className="filter-select"
                    value={selectedPlantFilter}
                    onChange={(e) => setSelectedPlantFilter(e.target.value)}
                >
                    <option value="ALL">All Plants Telemetry</option>
                    {userPlants.map((p) => (
                        <option key={p.id} value={String(p.id)}>
                            {p.nickname}
                        </option>
                    ))}
                </select>
            </div>

            {error && <div className="alert-message alert-error">{error}</div>}

            {/* Main Content */}
            {loading ? (
                <div className="dashboard-loading">
                    <div className="dashboard-spinner"></div>
                    <h3>Loading environment telemetry...</h3>
                </div>
            ) : displayedRecords.length === 0 ? (
                <div className="empty-plants-container">
                    <h3>No environment readings logged</h3>
                    <p>Log your plant's microclimate data or connect a soil/humidity sensor to monitor health.</p>
                    <button className="log-env-btn" style={{ margin: "0 auto" }} onClick={() => handleOpenModal()}>
                        Log First Reading
                    </button>
                </div>
            ) : (
                <div className="env-records-grid">
                    {displayedRecords.map((rec) => {
                        const plant = userPlants.find((p) => p.id === rec.plantId);
                        const plantName = rec.plantNickname || (plant ? plant.nickname : `Plant #${rec.plantId}`);

                        return (
                            <div key={rec.id} className="env-card">
                                <div className="env-card-header">
                                    <span className="env-plant-pill">
                                        {plantName}
                                    </span>
                                    {rec.sensorId && (
                                        <span className="env-sensor-tag">
                                            {rec.sensorId}
                                        </span>
                                    )}
                                </div>

                                <div className="env-gauges-grid">
                                    <div className="env-gauge-item">
                                        <span className="env-gauge-label">Temp</span>
                                        <span className="env-gauge-val">
                                            {rec.temperatureCelsius != null ? `${rec.temperatureCelsius}°C` : "--"}
                                        </span>
                                    </div>

                                    <div className="env-gauge-item">
                                        <span className="env-gauge-label">Humidity</span>
                                        <span className="env-gauge-val">
                                            {rec.humidityPercentage != null ? `${rec.humidityPercentage}%` : "--"}
                                        </span>
                                    </div>

                                    <div className="env-gauge-item">
                                        <span className="env-gauge-label">Light</span>
                                        <span className="env-gauge-val">
                                            {rec.lightLevelLux != null ? `${rec.lightLevelLux} Lux` : "--"}
                                        </span>
                                    </div>

                                    <div className="env-gauge-item">
                                        <span className="env-gauge-label">Moisture</span>
                                        <span className="env-gauge-val">
                                            {rec.soilMoisturePercentage != null ? `${rec.soilMoisturePercentage}%` : "--"}
                                        </span>
                                    </div>
                                </div>

                                <div className="env-timestamp">
                                    <span>{rec.locationId || "Indoor Garden"}</span>
                                    <span>
                                        {rec.recordedDate
                                            ? new Date(rec.recordedDate).toLocaleDateString(undefined, {
                                                  month: "short",
                                                  day: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : "Recent"}
                                    </span>
                                </div>

                                <div className="env-card-footer">
                                    <button
                                        className="health-btn-action"
                                        onClick={() => handleOpenModal(rec)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="health-btn-action delete"
                                        onClick={() => handleDelete(rec.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Log Reading Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingRecordId ? "Edit Environment Reading" : "Log Environment Reading"}</h2>
                            <button className="modal-close-btn" onClick={handleCloseModal}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Target Plant *</label>
                                <select
                                    name="plantId"
                                    value={formData.plantId}
                                    onChange={handleFormChange}
                                    required
                                >
                                    <option value="">-- Select Plant --</option>
                                    {userPlants.map((p) => (
                                        <option key={p.id} value={String(p.id)}>
                                            {p.nickname}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Location / Room</label>
                                    <input
                                        type="text"
                                        name="locationId"
                                        placeholder="e.g. South Window, Balcony"
                                        value={formData.locationId}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Sensor Tag / ID</label>
                                    <input
                                        type="text"
                                        name="sensorId"
                                        placeholder="e.g. SENS-LIVING-01"
                                        value={formData.sensorId}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Temperature (°C)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="temperatureCelsius"
                                        placeholder="24.0"
                                        value={formData.temperatureCelsius}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Humidity (%)</label>
                                    <input
                                        type="number"
                                        name="humidityPercentage"
                                        placeholder="60"
                                        value={formData.humidityPercentage}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Light Level (Lux)</label>
                                    <input
                                        type="number"
                                        name="lightLevelLux"
                                        placeholder="1500"
                                        value={formData.lightLevelLux}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Soil Moisture (%)</label>
                                    <input
                                        type="number"
                                        name="soilMoisturePercentage"
                                        placeholder="45"
                                        value={formData.soilMoisturePercentage}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>pH Level</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="phLevel"
                                        placeholder="6.5"
                                        value={formData.phLevel}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Data Source</label>
                                    <select
                                        name="dataSource"
                                        value={formData.dataSource}
                                        onChange={handleFormChange}
                                    >
                                        <option value="IoT Sensor">IoT Sensor Device</option>
                                        <option value="Manual Log">Manual Hygrometer / Meter</option>
                                        <option value="Weather API">Local Weather Service</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save" disabled={saving}>
                                    {saving ? "Saving..." : editingRecordId ? "Update Reading" : "Save Reading"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Environment;
