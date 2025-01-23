package com.pharmasight.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DivisionDto {
    private String divisionName;
    private JsonNode geoData;
    private Double zoomVal;
}
