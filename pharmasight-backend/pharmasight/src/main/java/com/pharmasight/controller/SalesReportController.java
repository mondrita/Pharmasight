package com.pharmasight.controller;

import com.pharmasight.dto.*;
import com.pharmasight.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sales-info")

public class SalesReportController {
    private final PrescriptionService prescriptionService;

    @GetMapping("/demographic")
    public ResponseEntity<DemographicDTO> getSalesDataById(SearchCriteriaDTO param) {
        DemographicDTO salesData = prescriptionService.getDemographicSalesDataById(param);
        return ResponseEntity.ok(salesData);
    }

    @GetMapping("/top-brands")
    public List<TopDrugDTO> getTopBrands(SearchCriteriaDTO param) {
        return prescriptionService.getTopDrugs(param);
    }

    @GetMapping("/demographic-districts")
    public ResponseEntity<List<DistrictSalesDTO>> getDistrictSales(SearchCriteriaDTO param) {
        List<DistrictSalesDTO> salesByDistrict = prescriptionService.getDivisionDemographicSalesDataById(param);
        return ResponseEntity.ok(salesByDistrict);
    }
    @GetMapping("/district-market-share")
    public ResponseEntity<List<DistrictMarketShareDTO>> getDistrictMarketShare(SearchCriteriaDTO param) {
        List<DistrictMarketShareDTO> districtSales = prescriptionService.getDistrictMarketShare(param);

        return ResponseEntity.ok(districtSales);
    }

    @GetMapping("/Drug-report")
    public ResponseEntity<DrugReportDTO> getReport(SearchCriteriaDTO param) {
        DrugReportDTO report= prescriptionService.getDrugReport(param);
        return ResponseEntity.ok(report);
    }
}
