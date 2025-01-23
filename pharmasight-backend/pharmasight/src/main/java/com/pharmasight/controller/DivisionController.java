package com.pharmasight.controller;

import com.pharmasight.dto.DistrictDTO;
import com.pharmasight.dto.DivisionDto;
import com.pharmasight.service.DivisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/division")
public class DivisionController {

    private final DivisionService divisionService;

    @GetMapping("/boundary")
    public DivisionDto getGeoJsonDataByName(@RequestParam("name") String name) {
        try {
            return divisionService.getGeoJsonDataByName(name);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving GeoJSON data: " + e.getMessage());
        }
    }

    @GetMapping("/district-coordinates")
    public ResponseEntity<List<DistrictDTO>> getDistrictLatLongs(@RequestParam Long divisionId) {
        List<DistrictDTO> districtLatLongs = divisionService.getDistrictLatLongsByDivision(divisionId);
        return ResponseEntity.ok(districtLatLongs);
    }

}
