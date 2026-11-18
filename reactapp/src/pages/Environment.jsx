import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    getAllEnvironmentData,
    createEnvironmentData,
    updateEnvironmentData,
    deleteEnvironmentData,
    getLiveWeather,
} from "../services/environmentService";
import { getPlants } from "../services/plantService";
import { getCurrentUser } from "../services/authService";
import "./Environment.css";

const getWeatherEmoji = (code, isRaining) => {
    if (isRaining) return "🌧️";
    if (code === 0) return "☀️";
    if (code >= 1 && code <= 3) return "⛅";
    if (code === 45 || code === 48) return "🌫️";
    if (code >= 51 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 80 && code <= 82) return "🌦️";
    if (code >= 95) return "⛈️";
    return "🌤️";
};

function Environment() {
    const [records, setRecords] = useState([]);
    const [userPlants, setUserPlants] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Live Weather State
    const [weatherData, setWeatherData] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState("");
    const [savingSnapshot, setSavingSnapshot] = useState(false);
    const [snapshotSuccess, setSnapshotSuccess] = useState("");

    // Plant filter
    const [selectedPlantFilter, setSelectedPlantFilter] = useState("ALL");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        plantId: "",
        locationId: "Outdoor Garden",
        sensorId: "IOT-SENS-01",
        temperatureCelsius: "24.5",
        humidityPercentage: "65",
        rainfallMm: "0.0",
        weatherCondition: "Clear Sky",
        lightLevelLux: "1500",
        soilMoisturePercentage: "45",
        phLevel: "6.5",
        dataSource: "IoT Sensor",
        recordedDate: new Date().toISOString().slice(0, 16),
    });

    const loadData = async (refreshOnlyWeather = false) => {
        if (!refreshOnlyWeather) {
            setLoading(true);
            setError("");
        }
        setWeatherLoading(true);
        setWeatherError("");

        try {
            const userData = await getCurrentUser();
            setCurrentUser(userData);

            const [allTelemetry, plants, weather] = await Promise.all([
                refreshOnlyWeather ? Promise.resolve(records) : getAllEnvironmentData().catch(() => []),
                refreshOnlyWeather ? Promise.resolve(userPlants) : getPlants(userData?.id).catch(() => []),
                getLiveWeather().catch((err) => {
                    console.warn("Could not fetch live weather:", err);
                    return null;
                }),
            ]);

            if (!refreshOnlyWeather) {
                setUserPlants(plants);

                const isStaff = userData?.role === "ADMIN" || userData?.role === "SPECIALIST";
                const userPlantIds = new Set(plants.map((p) => p.id));
                const filteredTelemetry = isStaff
                    ? allTelemetry
                    : allTelemetry.filter((t) => t.plantId == null || userPlantIds.has(t.plantId));

                filteredTelemetry.sort((a, b) => new Date(b.recordedDate || 0) - new Date(a.recordedDate || 0));
                setRecords(filteredTelemetry);
            }

            setWeatherData(weather);
        } catch (err) {
            console.error("Error loading environmental and weather data:", err);
            setError(err.message || "Failed to load environment telemetry.");
        } finally {
            setLoading(false);
            setWeatherLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const userData = await getCurrentUser();
                if (!isMounted) return;
                setCurrentUser(userData);

                const [allTelemetry, plants, weather] = await Promise.all([
                    getAllEnvironmentData().catch(() => []),
                    getPlants(userData?.id).catch(() => []),
                    getLiveWeather().catch(() => null),
                ]);

                if (!isMounted) return;
                setUserPlants(plants);

                const isStaff = userData?.role === "ADMIN" || userData?.role === "SPECIALIST";
                const userPlantIds = new Set(plants.map((p) => p.id));
                const filteredTelemetry = isStaff
                    ? allTelemetry
                    : allTelemetry.filter((t) => t.plantId == null || userPlantIds.has(t.plantId));

                filteredTelemetry.sort((a, b) => new Date(b.recordedDate || 0) - new Date(a.recordedDate || 0));
                setRecords(filteredTelemetry);
                setWeatherData(weather);
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Failed to initialize environment page.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    // Save Live Weather Snapshot as an Environment Reading
    const handleLogWeatherSnapshot = async () => {
        if (!weatherData || !weatherData.locationConfigured) {
            alert("No live weather data available to snapshot.");
            return;
        }

        setSavingSnapshot(true);
        setSnapshotSuccess("");
        try {
            const payload = {
                plantId: userPlants.length > 0 ? userPlants[0].id : null,
                locationId: weatherData.locationName || currentUser?.location || "Outdoor Garden",
                sensorId: "OPEN-METEO-LIVE",
                temperatureCelsius: weatherData.currentTemperatureCelsius != null ? Number(weatherData.currentTemperatureCelsius) : null,
                humidityPercentage: weatherData.currentHumidityPercentage != null ? Number(weatherData.currentHumidityPercentage) : null,
                rainfallMm: weatherData.currentPrecipitationMm != null ? Number(weatherData.currentPrecipitationMm) : null,
                weatherCondition: weatherData.currentWeatherDescription || "Live Weather",
                lightLevelLux: weatherData.isRaining ? 800 : 2500,
                soilMoisturePercentage: weatherData.isRaining ? 80 : 50,
                phLevel: 6.5,
                dataSource: "Weather API (Open-Meteo)",
                recordedDate: new Date().toISOString(),
            };

            const created = await createEnvironmentData(payload);
            setRecords((prev) => [created, ...prev]);
            setSnapshotSuccess("Live weather reading saved to environmental history!");
            setTimeout(() => setSnapshotSuccess(""), 4000);
        } catch (err) {
            alert("Failed to save weather snapshot: " + err.message);
        } finally {
            setSavingSnapshot(false);
        }
    };

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecordId(record.id);
            setFormData({
                plantId: record.plantId ? String(record.plantId) : "",
                locationId: record.locationId || "Outdoor Garden",
                sensorId: record.sensorId || "IOT-SENS-01",
                temperatureCelsius: record.temperatureCelsius != null ? String(record.temperatureCelsius) : "24.5",
                humidityPercentage: record.humidityPercentage != null ? String(record.humidityPercentage) : "65",
                rainfallMm: record.rainfallMm != null ? String(record.rainfallMm) : "0.0",
                weatherCondition: record.weatherCondition || "Clear Sky",
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
                locationId: currentUser?.location || "Outdoor Garden",
                sensorId: "IOT-SENS-01",
                temperatureCelsius: weatherData?.currentTemperatureCelsius ? String(weatherData.currentTemperatureCelsius) : "24.5",
                humidityPercentage: weatherData?.currentHumidityPercentage ? String(weatherData.currentHumidityPercentage) : "65",
                rainfallMm: weatherData?.currentPrecipitationMm ? String(weatherData.currentPrecipitationMm) : "0.0",
                weatherCondition: weatherData?.currentWeatherDescription || "Clear Sky",
                lightLevelLux: "1500",
                soilMoisturePercentage: "45",
                phLevel: "6.5",
                dataSource: "Manual Log",
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
        setSaving(true);
        try {
            const payload = {
                plantId: formData.plantId ? Number(formData.plantId) : null,
                locationId: formData.locationId?.trim() || null,
                sensorId: formData.sensorId?.trim() || null,
                temperatureCelsius: formData.temperatureCelsius ? Number(formData.temperatureCelsius) : null,
                humidityPercentage: formData.humidityPercentage ? Number(formData.humidityPercentage) : null,
                rainfallMm: formData.rainfallMm ? Number(formData.rainfallMm) : null,
                weatherCondition: formData.weatherCondition?.trim() || null,
                lightLevelLux: formData.lightLevelLux ? Number(formData.lightLevelLux) : null,
                soilMoisturePercentage: formData.soilMoisturePercentage ? Number(formData.soilMoisturePercentage) : null,
                phLevel: formData.phLevel ? Number(formData.phLevel) : null,
                dataSource: formData.dataSource || "Manual Log",
                recordedDate: formData.recordedDate ? `${formData.recordedDate}:00` : new Date().toISOString(),
            };

            if (editingRecordId) {
                const updated = await updateEnvironmentData(editingRecordId, payload);
                setRecords((prev) => prev.map((r) => (r.id === editingRecordId ? updated : r)));
            } else {
                const created = await createEnvironmentData(payload);
                setRecords((prev) => [created, ...prev]);
            }

            handleCloseModal();
        } catch (err) {
            alert("Failed to save environment reading: " + err.message);
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
        if (selectedPlantFilter !== "ALL") {
            return String(r.plantId) === selectedPlantFilter;
        }
        return true;
    });

    // Summary calculations
    const validTemps = displayedRecords.filter((r) => r.temperatureCelsius != null).map((r) => Number(r.temperatureCelsius));
    const avgTemp = validTemps.length > 0 ? (validTemps.reduce((a, b) => a + b, 0) / validTemps.length).toFixed(1) : "--";

    const validHumids = displayedRecords.filter((r) => r.humidityPercentage != null).map((r) => Number(r.humidityPercentage));
    const avgHumid = validHumids.length > 0 ? Math.round(validHumids.reduce((a, b) => a + b, 0) / validHumids.length) : "--";

    const validRain = displayedRecords.filter((r) => r.rainfallMm != null).map((r) => Number(r.rainfallMm));
    const totalRainLogged = validRain.length > 0 ? validRain.reduce((a, b) => a + b, 0).toFixed(1) : "--";

    const validMoisture = displayedRecords.filter((r) => r.soilMoisturePercentage != null).map((r) => Number(r.soilMoisturePercentage));
    const avgMoisture = validMoisture.length > 0 ? Math.round(validMoisture.reduce((a, b) => a + b, 0) / validMoisture.length) : "--";

    return (
        <div className="environment-page">
            {/* Header */}
            <div className="environment-header">
                <div className="environment-title-wrap">
                    <span className="env-tagline">Botanical Microclimate & Weather Intelligence</span>
                    <h1>Weather Station & Environmental Data</h1>
                    <p>Live meteorological forecasts, rain-aware plant care recommendations, and ambient sensor telemetry</p>
                </div>

                <div className="env-header-actions">
                    <button
                        className="btn-refresh-weather"
                        onClick={() => loadData(true)}
                        disabled={weatherLoading}
                        title="Fetch latest weather update"
                    >
                        {weatherLoading ? "Updating..." : "🔄 Refresh Weather"}
                    </button>
                    <button className="log-env-btn" onClick={() => handleOpenModal()}>
                        Log Sensor Reading
                    </button>
                </div>
            </div>

            {error && <div className="alert-message alert-error">{error}</div>}
            {weatherError && <div className="alert-message alert-error">{weatherError}</div>}
            {snapshotSuccess && <div className="alert-message alert-success">{snapshotSuccess}</div>}

            {/* LIVE WEATHER & FORECAST SECTION */}
            <div className="weather-hub-card">
                <div className="weather-hub-top">
                    <div className="weather-location-info">
                        <span className="weather-section-label">Atmospheric Station</span>
                        <h2>
                            {weatherData?.locationName || currentUser?.location || "Local Botanical Garden"}
                            {weatherData?.locationConfigured && weatherData.latitude != null && (
                                <span className="weather-coords-pill">
                                    📍 {Number(weatherData.latitude).toFixed(2)}°, {Number(weatherData.longitude).toFixed(2)}°
                                </span>
                            )}
                        </h2>
                        {weatherData?.fetchedAt && (
                            <span className="weather-updated-time">
                                Synced via Open-Meteo • {new Date(weatherData.fetchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        )}
                    </div>

                    {weatherData?.locationConfigured && (
                        <button
                            className="btn-save-snapshot"
                            onClick={handleLogWeatherSnapshot}
                            disabled={savingSnapshot}
                        >
                            {savingSnapshot ? "Saving..." : "💾 Log Weather Snapshot"}
                        </button>
                    )}
                </div>

                {!weatherData?.locationConfigured ? (
                    <div className="weather-unconfigured-box">
                        <div className="weather-unconfigured-icon">📍</div>
                        <div className="weather-unconfigured-content">
                            <h3>Set Your Profile Coordinates for Live Forecasts</h3>
                            <p>
                                Real-time weather forecasting and rain-aware care recommendations require your location coordinates.
                                Click below to add your city or auto-detect via GPS in your profile settings.
                            </p>
                            <Link to="/profile" className="btn-setup-location">
                                Configure Location in Profile →
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Current Weather Grid */}
                        <div className="current-weather-grid">
                            <div className="current-weather-main">
                                <div className="current-temp-hero">
                                    <span className="current-weather-emoji">
                                        {getWeatherEmoji(weatherData.currentWeatherCode, weatherData.isRaining)}
                                    </span>
                                    <div>
                                        <div className="current-temp-val">
                                            {weatherData.currentTemperatureCelsius != null ? `${weatherData.currentTemperatureCelsius}°C` : "--"}
                                        </div>
                                        <div className="current-condition-text">
                                            {weatherData.currentWeatherDescription || "Clear"}
                                        </div>
                                    </div>
                                </div>

                                <div className="weather-sub-metrics">
                                    <div className="sub-metric-item">
                                        <span className="sub-metric-label">Feels Like</span>
                                        <span className="sub-metric-val">
                                            {weatherData.currentApparentTempCelsius != null ? `${weatherData.currentApparentTempCelsius}°C` : "--"}
                                        </span>
                                    </div>
                                    <div className="sub-metric-item">
                                        <span className="sub-metric-label">Relative Humidity</span>
                                        <span className="sub-metric-val">
                                            {weatherData.currentHumidityPercentage != null ? `${weatherData.currentHumidityPercentage}%` : "--"}
                                        </span>
                                    </div>
                                    <div className="sub-metric-item">
                                        <span className="sub-metric-label">Rainfall Rate</span>
                                        <span className="sub-metric-val">
                                            {weatherData.currentPrecipitationMm != null ? `${weatherData.currentPrecipitationMm} mm` : "0.0 mm"}
                                        </span>
                                    </div>
                                    <div className="sub-metric-item">
                                        <span className="sub-metric-label">Wind Speed</span>
                                        <span className="sub-metric-val">
                                            {weatherData.currentWindSpeedKmH != null ? `${weatherData.currentWindSpeedKmH} km/h` : "--"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 7-Day Forecast Strip */}
                        {weatherData.dailyForecast && weatherData.dailyForecast.length > 0 && (
                            <div className="forecast-section">
                                <h3 className="forecast-section-title">7-Day Meteorological Outlook</h3>
                                <div className="forecast-strip">
                                    {weatherData.dailyForecast.map((day, idx) => {
                                        const dayDate = new Date(day.date);
                                        const dayLabel = idx === 0 ? "Today" : dayDate.toLocaleDateString("en-US", { weekday: "short" });
                                        const isRainyDay = (day.precipitationSumMm != null && day.precipitationSumMm > 1.0) || (day.precipitationProbabilityMax && day.precipitationProbabilityMax >= 50);

                                        return (
                                            <div key={idx} className={`forecast-day-card ${isRainyDay ? "rainy-day" : ""}`}>
                                                <span className="forecast-day-name">{dayLabel}</span>
                                                <span className="forecast-emoji">
                                                    {getWeatherEmoji(day.weatherCode, isRainyDay)}
                                                </span>
                                                <div className="forecast-temps">
                                                    <span className="temp-max">{day.tempMaxCelsius != null ? `${Math.round(day.tempMaxCelsius)}°` : "--"}</span>
                                                    <span className="temp-min">{day.tempMinCelsius != null ? `${Math.round(day.tempMinCelsius)}°` : "--"}</span>
                                                </div>
                                                <div className="forecast-rain-prob" title={`Precipitation: ${day.precipitationSumMm || 0} mm`}>
                                                    💧 {day.precipitationProbabilityMax != null ? `${day.precipitationProbabilityMax}%` : "0%"}
                                                </div>
                                                {day.precipitationSumMm > 0 && (
                                                    <span className="forecast-rain-mm">{day.precipitationSumMm} mm</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Weather-Aware Plant Care Advisor */}
                        {weatherData.recommendations && weatherData.recommendations.length > 0 && (
                            <div className="weather-advisor-section">
                                <div className="advisor-header">
                                    <span className="advisor-badge">AI Microclimate Insights</span>
                                    <h3>Weather-Aware Plant Care Advisor</h3>
                                </div>

                                <div className="advisor-cards-grid">
                                    {weatherData.recommendations.map((rec, idx) => (
                                        <div key={idx} className={`advisor-card severity-${rec.severity?.toLowerCase() || "info"}`}>
                                            <div className="advisor-card-top">
                                                <span className="advisor-category-tag">
                                                    {rec.category === "OUTDOOR_OPEN" && "☀️ Outdoor (Open Area)"}
                                                    {rec.category === "OUTDOOR_SHELTERED" && "🏡 Outdoor (Under Shelter)"}
                                                    {rec.category === "INDOOR" && "🌿 Indoor Plants"}
                                                    {rec.category === "GENERAL" && "🌱 General Gardening"}
                                                </span>
                                            </div>
                                            <h4 className="advisor-card-title">{rec.title}</h4>
                                            <p className="advisor-card-advice">{rec.advice}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* SENSOR TELEMETRY & HISTORICAL READINGS */}
            <div className="telemetry-section-header">
                <div>
                    <h2>Environmental Readings & Sensor Logs</h2>
                    <p>Historical telemetry captured from connected sensors, weather snapshots, and manual readings</p>
                </div>

                <div className="telemetry-filters-row">
                    <select
                        className="filter-select"
                        value={selectedPlantFilter}
                        onChange={(e) => setSelectedPlantFilter(e.target.value)}
                    >
                        <option value="ALL">All Plants & Garden Readings</option>
                        {userPlants.map((p) => (
                            <option key={p.id} value={String(p.id)}>
                                {p.nickname} ({p.placement || "Indoor"})
                            </option>
                        ))}
                    </select>
                </div>
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
                        <span className="env-metric-val">{totalRainLogged} mm</span>
                        <span className="env-metric-sub">Total Rainfall Logged</span>
                    </div>
                </div>

                <div className="env-metric-card">
                    <div className="env-metric-info">
                        <span className="env-metric-val">{avgMoisture}%</span>
                        <span className="env-metric-sub">Average Soil Moisture</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="dashboard-loading">
                    <div className="dashboard-spinner"></div>
                    <h3>Loading environmental telemetry...</h3>
                </div>
            ) : displayedRecords.length === 0 ? (
                <div className="empty-plants-container">
                    <h3>No environmental readings logged</h3>
                    <p>Click "Save Weather Snapshot" above or log a manual sensor reading to track your microclimate history.</p>
                    <button className="log-env-btn" style={{ margin: "0 auto" }} onClick={() => handleOpenModal()}>
                        Log First Reading
                    </button>
                </div>
            ) : (
                <div className="env-records-grid">
                    {displayedRecords.map((rec) => {
                        const plant = userPlants.find((p) => p.id === rec.plantId);
                        const plantName = rec.plantNickname || (plant ? plant.nickname : "General Garden");

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
                                        <span className="env-gauge-label">Rainfall</span>
                                        <span className="env-gauge-val">
                                            {rec.rainfallMm != null ? `${rec.rainfallMm} mm` : "0.0 mm"}
                                        </span>
                                    </div>

                                    <div className="env-gauge-item">
                                        <span className="env-gauge-label">Moisture</span>
                                        <span className="env-gauge-val">
                                            {rec.soilMoisturePercentage != null ? `${rec.soilMoisturePercentage}%` : "--"}
                                        </span>
                                    </div>
                                </div>

                                {rec.weatherCondition && (
                                    <div className="env-condition-badge">
                                        ⛅ {rec.weatherCondition}
                                    </div>
                                )}

                                <div className="env-timestamp">
                                    <span>{rec.locationId || "Garden"}</span>
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

            {/* Log / Edit Reading Modal */}
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
                                <label>Target Plant (Optional for general garden readings)</label>
                                <select
                                    name="plantId"
                                    value={formData.plantId}
                                    onChange={handleFormChange}
                                >
                                    <option value="">-- General Garden / Atmosphere --</option>
                                    {userPlants.map((p) => (
                                        <option key={p.id} value={String(p.id)}>
                                            {p.nickname} ({p.placement || "Indoor"})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Location / Area</label>
                                    <input
                                        type="text"
                                        name="locationId"
                                        placeholder="e.g. Sunny Balcony, Indoor Shelf"
                                        value={formData.locationId}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Sensor Tag / Source</label>
                                    <input
                                        type="text"
                                        name="sensorId"
                                        placeholder="e.g. SENS-BALCONY-01"
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
                                    <label>Rainfall (mm)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="rainfallMm"
                                        placeholder="0.0"
                                        value={formData.rainfallMm}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Weather Condition</label>
                                    <input
                                        type="text"
                                        name="weatherCondition"
                                        placeholder="e.g. Clear Sky, Rain, Overcast"
                                        value={formData.weatherCondition}
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
                                        <option value="Weather API (Open-Meteo)">Live Weather API</option>
                                        <option value="IoT Sensor">IoT Sensor Device</option>
                                        <option value="Manual Log">Manual Hygrometer / Meter</option>
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
