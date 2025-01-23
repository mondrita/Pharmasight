package com.pharmasight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DivisionSalesDTO {
    private Long divisionId;
    private String divisionName;
    private Double totalSales;
}
