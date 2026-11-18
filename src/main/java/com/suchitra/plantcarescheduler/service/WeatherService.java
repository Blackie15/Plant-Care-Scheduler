package com.suchitra.plantcarescheduler.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.suchitra.plantcarescheduler.dto.weatherdto.DailyForecastDTO;
import com.suchitra.plantcarescheduler.dto.weatherdto.PlantCareWeatherRecommendationDTO;
import com.suchitra.plantcarescheduler.dto.weatherdto.WeatherResponseDTO;
import com.suchitra.plantcarescheduler.entity.Plant;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.repository.PlantRepository;
import com.suchitra.plantcarescheduler.repository.UserRepository;

@Service
public class WeatherService {

    private final UserRepository userRepository;
    private final PlantRepository plantRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public WeatherService(UserRepository userRepository,
                          PlantRepository plantRepository,
                          RestTemplateBuilder restTemplateBuilder,
                          ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.plantRepository = plantRepository;
        this.restTemplate = restTemplateBuilder.build();
        this.objectMapper = objectMapper;
    }

    public WeatherResponseDTO getWeatherForUser(String userEmail, Double overrideLat, Double overrideLng) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        User user = userOpt.orElse(null);

        Double lat = overrideLat;
        Double lng = overrideLng;
        String locationName = null;

        if (user != null) {
            locationName = user.getLocation();
            if (lat == null) {
                lat = user.getLatitude();
            }
            if (lng == null) {
                lng = user.getLongitude();
            }
        }

        if (lat == null || lng == null) {
            return WeatherResponseDTO.builder()
                    .locationConfigured(false)
                    .locationName(locationName)
                    .latitude(lat)
                    .longitude(lng)
                    .statusMessage("No GPS coordinates configured in your profile. Please add your city or coordinates in Edit Profile to view live weather.")
                    .recommendations(List.of(
                            PlantCareWeatherRecommendationDTO.builder()
                                    .category("GENERAL")
                                    .title("Set Profile Location")
                                    .advice("Configure your location and GPS coordinates in your profile to receive automated weather forecasts and rain-aware care alerts.")
                                    .severity("INFO")
                                    .build()
                    ))
                    .build();
        }

        return fetchLiveWeather(lat, lng, locationName, user);
    }

    private WeatherResponseDTO fetchLiveWeather(Double lat, Double lng, String locationName, User user) {
        String url = String.format(
                "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto",
                lat, lng
        );

        try {
            String jsonString = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(jsonString);

            JsonNode current = root.path("current");
            JsonNode daily = root.path("daily");

            BigDecimal currentTemp = current.has("temperature_2m") ? BigDecimal.valueOf(current.path("temperature_2m").asDouble()).setScale(1, RoundingMode.HALF_UP) : null;
            Integer currentHumidity = current.has("relative_humidity_2m") ? current.path("relative_humidity_2m").asInt() : null;
            BigDecimal currentApparent = current.has("apparent_temperature") ? BigDecimal.valueOf(current.path("apparent_temperature").asDouble()).setScale(1, RoundingMode.HALF_UP) : null;
            BigDecimal currentPrecip = current.has("precipitation") ? BigDecimal.valueOf(current.path("precipitation").asDouble()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            BigDecimal currentWind = current.has("wind_speed_10m") ? BigDecimal.valueOf(current.path("wind_speed_10m").asDouble()).setScale(1, RoundingMode.HALF_UP) : null;
            int weatherCode = current.path("weather_code").asInt(0);
            String weatherDescription = mapWeatherCodeToDescription(weatherCode);
            boolean isRaining = currentPrecip.compareTo(BigDecimal.ZERO) > 0 || (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);

            // Daily 7-day forecast
            List<DailyForecastDTO> forecasts = new ArrayList<>();
            JsonNode times = daily.path("time");
            JsonNode codes = daily.path("weather_code");
            JsonNode maxTemps = daily.path("temperature_2m_max");
            JsonNode minTemps = daily.path("temperature_2m_min");
            JsonNode precipSums = daily.path("precipitation_sum");
            JsonNode precipProbs = daily.path("precipitation_probability_max");

            for (int i = 0; i < times.size(); i++) {
                LocalDate date = LocalDate.parse(times.get(i).asText());
                int dayCode = codes.path(i).asInt(0);
                BigDecimal maxT = maxTemps.has(i) ? BigDecimal.valueOf(maxTemps.get(i).asDouble()).setScale(1, RoundingMode.HALF_UP) : null;
                BigDecimal minT = minTemps.has(i) ? BigDecimal.valueOf(minTemps.get(i).asDouble()).setScale(1, RoundingMode.HALF_UP) : null;
                BigDecimal pSum = precipSums.has(i) ? BigDecimal.valueOf(precipSums.get(i).asDouble()).setScale(1, RoundingMode.HALF_UP) : BigDecimal.ZERO;
                Integer pProb = precipProbs.has(i) ? precipProbs.get(i).asInt() : 0;

                forecasts.add(DailyForecastDTO.builder()
                        .date(date)
                        .weatherCode(dayCode)
                        .weatherDescription(mapWeatherCodeToDescription(dayCode))
                        .tempMaxCelsius(maxT)
                        .tempMinCelsius(minT)
                        .precipitationSumMm(pSum)
                        .precipitationProbabilityMax(pProb)
                        .build());
            }

            // Generate placement-aware recommendations
            List<Plant> userPlants = user != null ? plantRepository.findByOwner(user) : List.of();
            List<PlantCareWeatherRecommendationDTO> recommendations = generateRecommendations(currentTemp, currentPrecip, isRaining, forecasts, userPlants);

            return WeatherResponseDTO.builder()
                    .locationConfigured(true)
                    .locationName(locationName)
                    .latitude(lat)
                    .longitude(lng)
                    .timezone(root.path("timezone").asText("auto"))
                    .fetchedAt(LocalDateTime.now())
                    .currentTemperatureCelsius(currentTemp)
                    .currentHumidityPercentage(currentHumidity)
                    .currentApparentTempCelsius(currentApparent)
                    .currentPrecipitationMm(currentPrecip)
                    .currentWindSpeedKmH(currentWind)
                    .currentWeatherCode(weatherCode)
                    .currentWeatherDescription(weatherDescription)
                    .isRaining(isRaining)
                    .dailyForecast(forecasts)
                    .recommendations(recommendations)
                    .statusMessage("Live weather retrieved successfully.")
                    .build();

        } catch (Exception ex) {
            return WeatherResponseDTO.builder()
                    .locationConfigured(true)
                    .locationName(locationName)
                    .latitude(lat)
                    .longitude(lng)
                    .statusMessage("Failed to retrieve weather from Open-Meteo API: " + ex.getMessage())
                    .recommendations(List.of(
                            PlantCareWeatherRecommendationDTO.builder()
                                    .category("GENERAL")
                                    .title("Weather Service Notice")
                                    .advice("Could not fetch remote forecast. Check your network connection or verify your coordinates.")
                                    .severity("WARNING")
                                    .build()
                    ))
                    .build();
        }
    }

    private List<PlantCareWeatherRecommendationDTO> generateRecommendations(
            BigDecimal currentTemp,
            BigDecimal currentPrecip,
            boolean isRaining,
            List<DailyForecastDTO> forecasts,
            List<Plant> userPlants) {

        List<PlantCareWeatherRecommendationDTO> recs = new ArrayList<>();

        long outdoorOpenCount = userPlants.stream()
                .filter(p -> "Outdoor – Open area".equalsIgnoreCase(p.getPlacement()))
                .count();

        long outdoorShelteredCount = userPlants.stream()
                .filter(p -> "Outdoor – Under shelter".equalsIgnoreCase(p.getPlacement()))
                .count();

        long indoorCount = userPlants.stream()
                .filter(p -> p.getPlacement() == null || "Indoor".equalsIgnoreCase(p.getPlacement()))
                .count();

        // Check today's forecast
        BigDecimal todayPrecipSum = BigDecimal.ZERO;
        int todayPrecipProb = 0;
        BigDecimal todayMaxTemp = currentTemp != null ? currentTemp : BigDecimal.valueOf(25);

        if (!forecasts.isEmpty()) {
            DailyForecastDTO today = forecasts.get(0);
            todayPrecipSum = today.getPrecipitationSumMm() != null ? today.getPrecipitationSumMm() : BigDecimal.ZERO;
            todayPrecipProb = today.getPrecipitationProbabilityMax() != null ? today.getPrecipitationProbabilityMax() : 0;
            if (today.getTempMaxCelsius() != null) {
                todayMaxTemp = today.getTempMaxCelsius();
            }
        }

        boolean significantRainExpected = isRaining
                || todayPrecipSum.compareTo(BigDecimal.valueOf(1.5)) >= 0
                || todayPrecipProb >= 50;

        // 1. Outdoor - Open Area
        if (outdoorOpenCount > 0 || userPlants.isEmpty()) {
            if (significantRainExpected) {
                recs.add(PlantCareWeatherRecommendationDTO.builder()
                        .category("OUTDOOR_OPEN")
                        .title("Rain Expected: Consider Skipping Outdoor Watering")
                        .advice(String.format(
                                "Rainfall is forecast today (~%.1f mm with %d%% chance). Plants in open outdoor areas (%d plant%s) will receive natural hydration. Consider postponing scheduled watering.",
                                todayPrecipSum, todayPrecipProb, outdoorOpenCount, outdoorOpenCount == 1 ? "" : "s"
                        ))
                        .severity("WARNING")
                        .build());
            } else {
                recs.add(PlantCareWeatherRecommendationDTO.builder()
                        .category("OUTDOOR_OPEN")
                        .title("Outdoor Open Plants: Normal Watering")
                        .advice(String.format(
                                "No significant rain forecast today (~%.1f mm). Inspect soil moisture for your %d open outdoor plant%s and water as scheduled.",
                                todayPrecipSum, outdoorOpenCount, outdoorOpenCount == 1 ? "" : "s"
                        ))
                        .severity("INFO")
                        .build());
            }
        }

        // 2. Outdoor - Sheltered
        if (outdoorShelteredCount > 0 || userPlants.isEmpty()) {
            if (significantRainExpected) {
                recs.add(PlantCareWeatherRecommendationDTO.builder()
                        .category("OUTDOOR_SHELTERED")
                        .title("Sheltered Outdoor Plants: Check Soil Before Watering")
                        .advice(String.format(
                                "Although rain is predicted, plants under shelter (covered balcony or porch: %d plant%s) may only catch wind-blown mist. Check soil moisture manually before deciding to water.",
                                outdoorShelteredCount, outdoorShelteredCount == 1 ? "" : "s"
                        ))
                        .severity("INFO")
                        .build());
            } else {
                recs.add(PlantCareWeatherRecommendationDTO.builder()
                        .category("OUTDOOR_SHELTERED")
                        .title("Sheltered Outdoor Plants: Regular Care")
                        .advice(String.format(
                                "Mild outdoor climate. Monitor your %d sheltered plant%s and follow their regular watering frequency.",
                                outdoorShelteredCount, outdoorShelteredCount == 1 ? "" : "s"
                        ))
                        .severity("INFO")
                        .build());
            }
        }

        // 3. Indoor Plants
        if (indoorCount > 0 || userPlants.isEmpty()) {
            recs.add(PlantCareWeatherRecommendationDTO.builder()
                    .category("INDOOR")
                    .title("Indoor Plants: Unaffected by Outdoor Rain")
                    .advice(String.format(
                            "Indoor plants (%d plant%s) are protected from outdoor precipitation. Water according to their indoor schedule and ambient room humidity.",
                            indoorCount, indoorCount == 1 ? "" : "s"
                    ))
                    .severity("SUCCESS")
                    .build());
        }

        // 4. Extreme Weather Alerts
        if (todayMaxTemp.compareTo(BigDecimal.valueOf(35.0)) >= 0) {
            recs.add(PlantCareWeatherRecommendationDTO.builder()
                    .category("GENERAL")
                    .title("High Heat Warning")
                    .advice(String.format("Temperatures are expected to reach %.1f°C today. Moisture evaporates quickly in high heat. Check delicate plants for dehydration and provide afternoon shade if possible.", todayMaxTemp))
                    .severity("WARNING")
                    .build());
        } else if (todayMaxTemp.compareTo(BigDecimal.valueOf(5.0)) <= 0) {
            recs.add(PlantCareWeatherRecommendationDTO.builder()
                    .category("GENERAL")
                    .title("Cold / Frost Alert")
                    .advice("Cold conditions detected. Protect sensitive outdoor plants from frost damage by bringing them indoors or adding protective covers.")
                    .severity("WARNING")
                    .build());
        }

        return recs;
    }

    private String mapWeatherCodeToDescription(int code) {
        return switch (code) {
            case 0 -> "Clear Sky";
            case 1 -> "Mainly Clear";
            case 2 -> "Partly Cloudy";
            case 3 -> "Overcast";
            case 45, 48 -> "Foggy";
            case 51, 53, 55 -> "Drizzle";
            case 56, 57 -> "Freezing Drizzle";
            case 61, 63, 65 -> "Rain";
            case 66, 67 -> "Freezing Rain";
            case 71, 73, 75, 77 -> "Snowfall";
            case 80, 81, 82 -> "Rain Showers";
            case 85, 86 -> "Snow Showers";
            case 95 -> "Thunderstorm";
            case 96, 99 -> "Thunderstorm with Hail";
            default -> "Variable Weather";
        };
    }
}
