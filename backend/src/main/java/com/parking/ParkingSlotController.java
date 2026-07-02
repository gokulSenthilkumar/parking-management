package com.parking;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/slots")
public class ParkingSlotController {

    private final ParkingSlotRepository slotRepository;
    private final ParkingSessionRepository sessionRepository;
    private final CustomerRepository customerRepository;
    private final SettingsRepository settingsRepository;

    public ParkingSlotController(ParkingSlotRepository slotRepository,
            ParkingSessionRepository sessionRepository,
            CustomerRepository customerRepository,
            SettingsRepository settingsRepository) {
        this.slotRepository = slotRepository;
        this.sessionRepository = sessionRepository;
        this.customerRepository = customerRepository;
        this.settingsRepository = settingsRepository;
    }

    @GetMapping
    public List<SlotResponse> getAllSlots() {
        return slotRepository.findAll().stream()
                .map(slot -> {
                    ParkingSession session = sessionRepository
                            .findBySlotIdAndStatus(slot.getId(), ParkingSession.Status.ACTIVE)
                            .orElse(null);
                    return SlotResponse.of(slot, session);
                })
                .toList();
    }

    @PostMapping
    public ParkingSlot addSlot(@RequestBody Map<String, String> body) {
        ParkingSlot slot = new ParkingSlot(body.get("slotNumber"));
        return slotRepository.save(slot);
    }

    @PostMapping("/{id}/checkin")
    public ResponseEntity<?> checkIn(@PathVariable Long id, @RequestBody Map<String, String> body) {
        ParkingSlot slot = slotRepository.findById(id).orElse(null);
        if (slot == null) {
            return ResponseEntity.notFound().build();
        }
        if (slot.getStatus() == ParkingSlot.Status.OCCUPIED) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Slot is already occupied"));
        }
        Long customerId = Long.valueOf(body.get("customerId"));
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Customer not found"));
        }
        String vehicleNumber = body.getOrDefault("vehicleNumber", customer.getVehicleNumber());

        double rate = settingsRepository.findById(1L)
                .map(Settings::getRatePerHourInr)
                .orElse(20.0);

        ParkingSession session = new ParkingSession();
        session.setSlot(slot);
        session.setCustomer(customer);
        session.setVehicleNumber(vehicleNumber);
        session.setEntryTime(LocalDateTime.now());
        session.setRatePerHour(rate);
        session.setStatus(ParkingSession.Status.ACTIVE);
        sessionRepository.save(session);

        slot.setStatus(ParkingSlot.Status.OCCUPIED);
        slotRepository.save(slot);

        return ResponseEntity.ok(SlotResponse.of(slot, session));
    }

    @PostMapping("/{id}/checkout")
    public ResponseEntity<?> checkOut(@PathVariable Long id) {
        ParkingSlot slot = slotRepository.findById(id).orElse(null);
        if (slot == null) {
            return ResponseEntity.notFound().build();
        }
        ParkingSession session = sessionRepository
                .findBySlotIdAndStatus(id, ParkingSession.Status.ACTIVE)
                .orElse(null);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Slot has no active session"));
        }

        LocalDateTime exitTime = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(session.getEntryTime(), exitTime);
        long hours = Math.max(1, (long) Math.ceil(minutes / 60.0));
        double fee = hours * session.getRatePerHour();

        session.setExitTime(exitTime);
        session.setFee(fee);
        session.setStatus(ParkingSession.Status.COMPLETED);
        sessionRepository.save(session);

        slot.setStatus(ParkingSlot.Status.AVAILABLE);
        slotRepository.save(slot);

        CheckoutResponse response = new CheckoutResponse(
                slot.getId(), slot.getSlotNumber(),
                session.getCustomer().getName(), session.getVehicleNumber(),
                session.getEntryTime(), exitTime, hours, fee);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id) {
        ParkingSlot slot = slotRepository.findById(id).orElse(null);
        if (slot == null) {
            return ResponseEntity.notFound().build();
        }
        if (sessionRepository.existsBySlotId(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Cannot delete a slot that has parking history"));
        }
        slotRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
