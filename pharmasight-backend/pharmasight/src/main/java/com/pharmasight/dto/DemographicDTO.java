package com.pharmasight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemographicDTO {
    private Double totalBDSales;
    private List<DivisionSalesDTO> divisionSales;
}
