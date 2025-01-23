package com.pharmasight.controller;

import com.pharmasight.service.DivisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/upload")
public class FileUploadController {

    private final DivisionService divisionService;

    @PostMapping("/geojson/{id}")
    public String uploadGeoJson(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            divisionService.saveGeoJsonToDivision(id, file);
            return "GeoJSON uploaded successfully.";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
