package com.parking;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;

    private final ParkingSessionRepository sessionRepository;

    public ReportController(ParkingSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @GetMapping("/history")
    public List<HistoryRow> getHistory(
            @RequestParam(required = false) String from, @RequestParam(required = false) String to) {
        return historyRows(from, to);
    }

    @GetMapping("/history/export")
    public ResponseEntity<byte[]> exportHistory(
            @RequestParam(required = false) String from, @RequestParam(required = false) String to) {
        byte[] bytes = ExcelExportUtil.historyToExcel(historyRows(from, to));
        return excelResponse(bytes, "parking-history.xlsx");
    }

    @GetMapping("/revenue")
    public RevenueSummary getRevenue(
            @RequestParam(required = false) String from, @RequestParam(required = false) String to) {
        return revenueSummary(from, to);
    }

    @GetMapping("/revenue/export")
    public ResponseEntity<byte[]> exportRevenue(
            @RequestParam(required = false) String from, @RequestParam(required = false) String to) {
        byte[] bytes = ExcelExportUtil.revenueToExcel(revenueSummary(from, to));
        return excelResponse(bytes, "revenue-report.xlsx");
    }

    private List<HistoryRow> historyRows(String from, String to) {
        LocalDateTime fromDt = parseFrom(from);
        LocalDateTime toDt = parseTo(to);
        return sessionRepository.findAll().stream()
                .filter(s -> !s.getEntryTime().isBefore(fromDt) && !s.getEntryTime().isAfter(toDt))
                .sorted(Comparator.comparing(ParkingSession::getEntryTime).reversed())
                .map(HistoryRow::of)
                .toList();
    }

    private RevenueSummary revenueSummary(String from, String to) {
        LocalDateTime fromDt = parseFrom(from);
        LocalDateTime toDt = parseTo(to);

        List<ParkingSession> completed = sessionRepository.findByStatus(ParkingSession.Status.COMPLETED).stream()
                .filter(s -> !s.getExitTime().isBefore(fromDt) && !s.getExitTime().isAfter(toDt))
                .toList();

        double total = completed.stream().mapToDouble(ParkingSession::getFee).sum();

        Map<String, double[]> byDateMap = new TreeMap<>();
        for (ParkingSession s : completed) {
            String date = s.getExitTime().format(DATE_FMT);
            double[] agg = byDateMap.computeIfAbsent(date, k -> new double[2]);
            agg[0] += s.getFee();
            agg[1] += 1;
        }
        List<RevenueSummary.DailyRevenue> byDate = byDateMap.entrySet().stream()
                .map(e -> new RevenueSummary.DailyRevenue(e.getKey(), e.getValue()[0], (long) e.getValue()[1]))
                .sorted(Comparator.comparing(RevenueSummary.DailyRevenue::date).reversed())
                .toList();

        return new RevenueSummary(total, completed.size(), byDate);
    }

    private LocalDateTime parseFrom(String from) {
        return from == null || from.isBlank() ? LocalDateTime.MIN : LocalDate.parse(from).atStartOfDay();
    }

    private LocalDateTime parseTo(String to) {
        return to == null || to.isBlank() ? LocalDateTime.MAX : LocalDate.parse(to).atTime(23, 59, 59);
    }

    private ResponseEntity<byte[]> excelResponse(byte[] bytes, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(
                org.springframework.http.ContentDisposition.attachment().filename(filename).build());
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(bytes);
    }
}
