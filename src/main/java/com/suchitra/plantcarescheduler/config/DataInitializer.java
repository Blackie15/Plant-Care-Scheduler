package com.suchitra.plantcarescheduler.config;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.suchitra.plantcarescheduler.entity.Role;
import com.suchitra.plantcarescheduler.entity.Species;
import com.suchitra.plantcarescheduler.entity.User;
import com.suchitra.plantcarescheduler.repository.SpeciesRepository;
import com.suchitra.plantcarescheduler.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SpeciesRepository speciesRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            SpeciesRepository speciesRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.speciesRepository = speciesRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private void seedSpeciesIfMissing(
            String commonName,
            String scientificName,
            String familyName,
            String careDifficulty,
            String lightRequirements,
            Integer waterFrequencyDays,
            Integer humidityMin,
            Integer humidityMax,
            String careTips) {

        if (speciesRepository.findByScientificName(scientificName).isEmpty()) {
            Species s = new Species();
            s.setCommonName(commonName);
            s.setScientificName(scientificName);
            s.setFamilyName(familyName);
            s.setCareDifficulty(careDifficulty);
            s.setLightRequirements(lightRequirements);
            s.setWaterFrequencyDays(waterFrequencyDays);
            s.setHumidityMin(humidityMin);
            s.setHumidityMax(humidityMax);
            s.setGrowthRate("Medium");
            s.setCareTips(careTips);
            speciesRepository.save(s);
        }
    }

    private void seedSpecialistIfMissing(
            String username,
            String email,
            String password,
            String location,
            String gardeningExperience) {

        if (!userRepository.existsByEmail(email) && !userRepository.existsByUsername(username)) {
            User specialist = new User();
            specialist.setUsername(username);
            specialist.setEmail(email);
            specialist.setPasswordHash(passwordEncoder.encode(password));
            specialist.setRole(Role.SPECIALIST);
            specialist.setIsActive(true);
            specialist.setEmailVerified(true);
            specialist.setLocation(location);
            specialist.setGardeningExperience(gardeningExperience);
            specialist.setTimezone("UTC");
            specialist.setCreatedDate(LocalDateTime.now());
            userRepository.save(specialist);
        }
    }

    @Override
    public void run(String... args) {
        // Seed Verified Plant Care Specialists
        seedSpecialistIfMissing(
                "dr_clara_vance",
                "dr.clara@plantcare.com",
                "Specialist@123",
                "Senior Botanist - Tropical Flora & Pathology",
                "15+ years diagnosing plant diseases, fungal rot, and rare aroids.");

        seedSpecialistIfMissing(
                "marcus_reed",
                "marcus.reed@plantcare.com",
                "Specialist@123",
                "Horticulture & Soil Nutrition Specialist",
                "10+ years expert in succulent care, cacti, soil chemistry, and lighting.");

        seedSpecialistIfMissing(
                "dr_elena_rostova",
                "dr.elena@plantcare.com",
                "Specialist@123",
                "Exotic Variegated Plants Researcher",
                "12+ years in plant tissue culture, micro-propagation, and pest mitigation.");

        // Beginner & General Species
        seedSpeciesIfMissing(
                "Unknown / General Houseplant",
                "Plantae generalis",
                "General",
                "Easy",
                "Moderate Indirect Light",
                7,
                40,
                70,
                "Beginner Friendly: Check soil moisture once a week. Water when the top 1-2 inches of soil feel dry.");

        seedSpeciesIfMissing(
                "Unknown Succulent / Cactus",
                "Succulenta generalis",
                "Crassulaceae",
                "Very Easy",
                "Bright Direct Sunlight",
                14,
                30,
                50,
                "Drought hardy: Water sparsely every 2-3 weeks. Allow soil to dry out completely.");

        seedSpeciesIfMissing(
                "Unknown Flowering Plant",
                "Flora generalis",
                "General",
                "Moderate",
                "Bright Filtered Light",
                5,
                50,
                70,
                "Keep soil evenly moist and place in bright light to support flowering.");

        // Popular Species
        seedSpeciesIfMissing(
                "Monstera Deliciosa",
                "Monstera deliciosa",
                "Araceae",
                "Easy",
                "Bright Indirect",
                7,
                60,
                80,
                "Wipe leaves regularly. Water when top 2 inches of soil are dry.");

        seedSpeciesIfMissing(
                "Snake Plant",
                "Sansevieria trifasciata",
                "Asparagaceae",
                "Very Easy",
                "Low to Bright Indirect",
                14,
                30,
                50,
                "Extremely hardy and air-purifying. Avoid overwatering.");

        seedSpeciesIfMissing(
                "Peace Lily",
                "Spathiphyllum wallisii",
                "Araceae",
                "Moderate",
                "Medium Indirect",
                5,
                50,
                70,
                "Droops when thirsty. Keep in gentle, indirect lighting.");

        seedSpeciesIfMissing(
                "Golden Pothos",
                "Epipremnum aureum",
                "Araceae",
                "Very Easy",
                "Low to Bright Indirect",
                7,
                40,
                70,
                "Great trailing vine. Thrives almost anywhere indoors.");

        seedSpeciesIfMissing(
                "Fiddle Leaf Fig",
                "Ficus lyrata",
                "Moraceae",
                "Challenging",
                "Bright Filtered Light",
                7,
                50,
                65,
                "Keep in one stable bright spot. Water consistently once a week.");

        seedSpeciesIfMissing(
                "Aloe Vera",
                "Aloe barbadensis miller",
                "Asphodelaceae",
                "Easy",
                "Direct to Bright Indirect",
                14,
                30,
                50,
                "Use cactus mix. Water deeply only when soil is bone dry.");
    }
}
