package com.pharmasight.service;

import com.pharmasight.dto.*;
import com.pharmasight.exceptions.ResourceNotFoundException;
import com.pharmasight.repository.GenericRepository;
import com.pharmasight.repository.PrescriptionRepository;
import com.pharmasight.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final GenericRepository genericRepository;
    private final VendorRepository vendorRepository;

    public DemographicDTO getDemographicSalesDataById(SearchCriteriaDTO param) {
        checkGenericExistence(param);

        List<DivisionSalesDTO> divisionSales = prescriptionRepository.getSalesByDivisionById(
                param.getGenericId(), param.getVendorId(), param.getStartDate(), param.getEndDate()
        );

        double totalSales = divisionSales.stream()
                .mapToDouble(DivisionSalesDTO::getTotalSales)
                .sum();

        return new DemographicDTO(totalSales, divisionSales);
    }

    private void checkGenericExistence(SearchCriteriaDTO param) {
        boolean genericExists = genericRepository.existsById(param.getGenericId());
        if (!genericExists) {
            throw new ResourceNotFoundException("Generic ID " + param.getGenericId() + " does not exist.");
        }
        boolean vendorExists = vendorRepository.existsById(param.getVendorId());
        if (!vendorExists) {

            throw new ResourceNotFoundException("Vendor ID " + param.getVendorId() + " does not exist.");
        }
    }

    public List<TopDrugDTO> getTopDrugs(SearchCriteriaDTO param) {

        try{
            return prescriptionRepository.getTopDrugs(
                    param.getGenericId(), param.getVendorId(), param.getStartDate(), param.getEndDate(),
                    param.getDivisionId(), PageRequest.of(0, param.getLimit()));
        }catch (Exception e) {
            System.out.println(e.getMessage());
            throw e;
        }
    }

    public List<DistrictSalesDTO> getDivisionDemographicSalesDataById(SearchCriteriaDTO param) {
        checkGenericExistence(param);

        return prescriptionRepository.getSalesByDistrictById(param.getDivisionId(), param.getGenericId(), param.getVendorId(), param.getStartDate(), param.getEndDate());
    }

    public DrugReportDTO getDrugReport(SearchCriteriaDTO param) {
        try {
            List<Object[]> results = prescriptionRepository.getRawDrugReport(
                    param.getDrugId(), param.getStartDate(), param.getEndDate()
            );

            if (results.isEmpty()) {
                throw new ResourceNotFoundException("No report found for the given criteria.");
            }

            Object[] row = results.get(0);
            return new DrugReportDTO(
                    (String) row[0],
                    (String) row[1],
                    (Double) row[2],
                    (String) row[3],
                    (String) row[4],
                    (String) row[5],
                    (String) row[6]
            );
        } catch (Exception e) {
            System.err.println("Error fetching drug report: " + e.getMessage());
            throw e;
        }
    }


    // DistrictMarketShare
    public List<DistrictMarketShareDTO> getDistrictMarketShare(SearchCriteriaDTO param) {
        return prescriptionRepository.findDistrictMarketShare(param.getGenericId(), param.getVendorId(), param.getStartDate(), param.getEndDate(), param.getDivisionId());
    }

}

