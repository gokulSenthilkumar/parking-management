package com.parking;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public final class ExcelExportUtil {

    private static final DateTimeFormatter DTF = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private ExcelExportUtil() {
    }

    public static byte[] historyToExcel(List<HistoryRow> rows) {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Parking History");
            CellStyle headerStyle = headerStyle(workbook);

            String[] headers = { "Session ID", "Slot", "Customer", "Phone", "Vehicle Number",
                    "Entry Time", "Exit Time", "Duration (hrs)", "Fee (INR)", "Status" };
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (HistoryRow r : rows) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(r.sessionId());
                row.createCell(1).setCellValue(r.slotNumber());
                row.createCell(2).setCellValue(r.customerName());
                row.createCell(3).setCellValue(r.phone());
                row.createCell(4).setCellValue(r.vehicleNumber());
                row.createCell(5).setCellValue(r.entryTime() != null ? r.entryTime().format(DTF) : "");
                row.createCell(6).setCellValue(r.exitTime() != null ? r.exitTime().format(DTF) : "");
                row.createCell(7).setCellValue(r.durationHours() != null ? r.durationHours() : 0);
                row.createCell(8).setCellValue(r.fee() != null ? r.fee() : 0);
                row.createCell(9).setCellValue(r.status());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            return toBytes(workbook);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public static byte[] revenueToExcel(RevenueSummary summary) {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Revenue Report");
            CellStyle headerStyle = headerStyle(workbook);

            Row summaryRow = sheet.createRow(0);
            summaryRow.createCell(0).setCellValue("Total Revenue (INR)");
            summaryRow.createCell(1).setCellValue(summary.totalRevenue());
            Row countRow = sheet.createRow(1);
            countRow.createCell(0).setCellValue("Total Sessions");
            countRow.createCell(1).setCellValue(summary.sessionCount());

            Row headerRow = sheet.createRow(3);
            String[] headers = { "Date", "Revenue (INR)", "Sessions" };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 4;
            for (RevenueSummary.DailyRevenue d : summary.byDate()) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(d.date());
                row.createCell(1).setCellValue(d.revenue());
                row.createCell(2).setCellValue(d.count());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            return toBytes(workbook);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private static CellStyle headerStyle(XSSFWorkbook workbook) {
        Font font = workbook.createFont();
        font.setBold(true);
        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        return style;
    }

    private static byte[] toBytes(XSSFWorkbook workbook) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        return out.toByteArray();
    }
}
