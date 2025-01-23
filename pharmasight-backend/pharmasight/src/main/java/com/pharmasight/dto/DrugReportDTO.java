package com.pharmasight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DrugReportDTO {
    private String drugName;
    private String formation;
    private Double totalSales;
    private String highestSalesLocation;
    private String lowestSalesLocation;
    private String highestSalesMonth;
    private String lowestSalesMonth;
}
