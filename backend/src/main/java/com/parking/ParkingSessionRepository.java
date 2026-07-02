package com.parking;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingSessionRepository extends JpaRepository<ParkingSession, Long> {

    Optional<ParkingSession> findBySlotIdAndStatus(Long slotId, ParkingSession.Status status);

    List<ParkingSession> findByStatusAndExitTimeBetween(
            ParkingSession.Status status, LocalDateTime from, LocalDateTime to);

    List<ParkingSession> findByStatus(ParkingSession.Status status);

    boolean existsBySlotId(Long slotId);
}
