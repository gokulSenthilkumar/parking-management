package com.parking;

import java.time.LocalDateTime;

public record HistoryRow(
        Long sessionId,
        String slotNumber,
        String customerName,
        String phone,
        String vehicleNumber,
        LocalDateTime entryTime,
        LocalDateTime exitTime,
        Long durationHours,
        Double fee,
        String status) {

    public static HistoryRow of(ParkingSession s) {
        Long hours = null;
        if (s.getExitTime() != null) {
            long minutes = java.time.temporal.ChronoUnit.MINUTES.between(s.getEntryTime(), s.getExitTime());
            hours = Math.max(1, (long) Math.ceil(minutes / 60.0));
        }
        return new HistoryRow(
                s.getId(), s.getSlot().getSlotNumber(), s.getCustomer().getName(), s.getCustomer().getPhone(),
                s.getVehicleNumber(), s.getEntryTime(), s.getExitTime(), hours, s.getFee(), s.getStatus().name());
    }
}
