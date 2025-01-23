package com.pharmasight.controller;

import com.pharmasight.dto.SearchCriteriaDTO;
import com.pharmasight.service.ExcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class ExportController {

    private final ExcelService excelService;

    @GetMapping("/export-excel")
    public ResponseEntity<ByteArrayResource> exportExcel(SearchCriteriaDTO param) {
        try {
            ByteArrayResource excelResource = excelService.generateExcel(param);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.xlsx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excelResource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
