package com.pharmasight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DistrictMarketShareDTO {
    private String districtName;
    private Double totalSales;
    private Double salesPercentage;
}
