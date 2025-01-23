package com.pharmasight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DistrictSalesDTO {
    private String districtName;
    private Double districtSales;
}
