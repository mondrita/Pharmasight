package com.pharmasight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TopDrugDTO {
    private Long id;
    private String drugName;
    private String strengthName;
    private String formationName;
    private double totalAmount;
}
