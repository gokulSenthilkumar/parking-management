package com.parking;

import java.time.LocalDateTime;

public record CheckoutResponse(
        Long slotId,
        String slotNumber,
        String customerName,
        String vehicleNumber,
        LocalDateTime entryTime,
        LocalDateTime exitTime,
        long durationHours,
        double fee) {
}
