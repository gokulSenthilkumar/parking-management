package com.parking;

import java.util.List;

public record RevenueSummary(double totalRevenue, long sessionCount, List<DailyRevenue> byDate) {

    public record DailyRevenue(String date, double revenue, long count) {
    }
}
