package com.parking;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Settings {

    @Id
    private Long id = 1L;

    private Double ratePerHourInr = 20.0;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getRatePerHourInr() {
        return ratePerHourInr;
    }

    public void setRatePerHourInr(Double ratePerHourInr) {
        this.ratePerHourInr = ratePerHourInr;
    }
}
