package com.parking;

import java.time.LocalDateTime;

public record SlotResponse(
        Long id,
        String slotNumber,
        String status,
        Long sessionId,
        Long customerId,
        String customerName,
        String phone,
        String vehicleNumber,
        LocalDateTime entryTime) {

    public static SlotResponse of(ParkingSlot slot, ParkingSession session) {
        if (session == null) {
            return new SlotResponse(slot.getId(), slot.getSlotNumber(), slot.getStatus().name(),
                    null, null, null, null, null, null);
        }
        Customer c = session.getCustomer();
        return new SlotResponse(slot.getId(), slot.getSlotNumber(), slot.getStatus().name(),
                session.getId(), c.getId(), c.getName(), c.getPhone(),
                session.getVehicleNumber(), session.getEntryTime());
    }
}
