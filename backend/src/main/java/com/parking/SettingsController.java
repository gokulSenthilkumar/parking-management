package com.parking;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsRepository settingsRepository;

    public SettingsController(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    @GetMapping
    public Settings getSettings() {
        return settingsRepository.findById(1L).orElseGet(() -> settingsRepository.save(new Settings()));
    }

    @PutMapping
    public Settings updateSettings(@RequestBody Map<String, Double> body) {
        Settings settings = settingsRepository.findById(1L).orElseGet(Settings::new);
        settings.setRatePerHourInr(body.get("ratePerHourInr"));
        return settingsRepository.save(settings);
    }
}
