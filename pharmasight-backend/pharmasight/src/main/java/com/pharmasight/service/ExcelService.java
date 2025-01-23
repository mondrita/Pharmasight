package com.pharmasight.service;

import com.pharmasight.dto.*;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class ExcelService {

    private final DivisionService divisionService;
    private final PrescriptionService prescriptionService;

    public ByteArrayResource generateExcel(SearchCriteriaDTO criteria) throws Exception {
        if (criteria.getLimit() == null) {
            criteria.setLimit(10);
        }
        Workbook workbook = new XSSFWorkbook();

        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle lightGreenStyle = createCellStyle(workbook, IndexedColors.LIGHT_GREEN);
        CellStyle lemonChiffonStyle = createCellStyle(workbook, IndexedColors.WHITE);

        createDistrictSalesSheet(workbook, criteria, headerStyle, lightGreenStyle, lemonChiffonStyle);

        createTopBrandsSheet(workbook, criteria, headerStyle, lightGreenStyle, lemonChiffonStyle);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return new ByteArrayResource(outputStream.toByteArray());
    }

    private void createDistrictSalesSheet(Workbook workbook, SearchCriteriaDTO criteria,
                                          CellStyle headerStyle, CellStyle lightGreenStyle, CellStyle lemonChiffonStyle) {
        Sheet districtSheet = workbook.createSheet("Division Sales");
        Row districtHeader = districtSheet.createRow(0);
        districtHeader.createCell(0).setCellValue("Division");
        districtHeader.createCell(1).setCellValue("District Name");
        districtHeader.createCell(2).setCellValue("District Sales");
        districtHeader.createCell(3).setCellValue("Market Share");

        for (int i = 0; i < 4; i++) {
            districtHeader.getCell(i).setCellStyle(headerStyle);
            districtSheet.setColumnWidth(i, 6000);
        }

        Set<Long> divisionsAdded = new HashSet<>();
        int districtRowNum = 1;
        boolean isLightGreen = true;

        for (long divisionId = 1; divisionId <= 8; divisionId++) {
            criteria.setDivisionId(divisionId);
            String divisionName = getDivisionNameById(divisionId);

            List<DistrictDTO> districts = divisionService.getDistrictLatLongsByDivision(divisionId);
            List<DistrictSalesDTO> districtSales = prescriptionService.getDivisionDemographicSalesDataById(criteria);
            List<DistrictMarketShareDTO> marketShare = prescriptionService.getDistrictMarketShare(criteria);

            CellStyle divisionRowStyle = isLightGreen ? lightGreenStyle : lemonChiffonStyle;

            for (DistrictDTO district : districts) {
                String districtName = district.getDistrictName();
                long districtSalesValue = districtSales.stream()
                        .filter(sales -> sales.getDistrictName().equals(districtName))
                        .findFirst()
                        .map(DistrictSalesDTO::getDistrictSales)
                        .orElse(0.0)
                        .longValue();

                double salesPercentage = marketShare.stream()
                        .filter(share -> share.getDistrictName().equals(districtName))
                        .findFirst()
                        .map(DistrictMarketShareDTO::getSalesPercentage)
                        .orElse(0.0);

                Row row = districtSheet.createRow(districtRowNum++);
                if (!divisionsAdded.contains(divisionId)) {
                    row.createCell(0).setCellValue(divisionName);
                    divisionsAdded.add(divisionId);
                } else {
                    row.createCell(0).setCellValue("");
                }
                row.createCell(1).setCellValue(districtName);
                row.createCell(2).setCellValue(districtSalesValue);
                row.createCell(3).setCellValue(salesPercentage);

                for (int i = 0; i < 4; i++) {
                    row.getCell(i).setCellStyle(divisionRowStyle);
                }
            }
            isLightGreen = !isLightGreen;
        }
    }

    private void createTopBrandsSheet(Workbook workbook, SearchCriteriaDTO criteria,
                                      CellStyle headerStyle, CellStyle lightGreenStyle, CellStyle lemonChiffonStyle) {
        Sheet brandSheet = workbook.createSheet("Top Brands");
        Row brandHeader = brandSheet.createRow(0);
        brandHeader.createCell(0).setCellValue("Division");
        brandHeader.createCell(1).setCellValue("Drug Name");
        brandHeader.createCell(2).setCellValue("Total Amount");

        for (int i = 0; i < 3; i++) {
            brandHeader.getCell(i).setCellStyle(headerStyle);
            brandSheet.setColumnWidth(i, 6000);
        }

        Set<Long> divisionsAdded = new HashSet<>();
        int brandRowNum = 1;
        boolean isLightGreen = true;

        for (long divisionId = 1; divisionId <= 8; divisionId++) {
            criteria.setDivisionId(divisionId);
            String divisionName = getDivisionNameById(divisionId);

            List<TopDrugDTO> topBrands = prescriptionService.getTopDrugs(criteria);
            CellStyle divisionRowStyle = isLightGreen ? lightGreenStyle : lemonChiffonStyle;

            for (TopDrugDTO brand : topBrands) {
                Row row = brandSheet.createRow(brandRowNum++);
                if (!divisionsAdded.contains(divisionId)) {
                    row.createCell(0).setCellValue(divisionName);
                    divisionsAdded.add(divisionId);
                } else {
                    row.createCell(0).setCellValue("");
                }
                row.createCell(1).setCellValue(brand.getDrugName());
                row.createCell(2).setCellValue(brand.getTotalAmount());

                for (int i = 0; i < 3; i++) {
                    row.getCell(i).setCellStyle(divisionRowStyle);
                }
            }
            isLightGreen = !isLightGreen;
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.SEA_GREEN.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return headerStyle;
    }

    private CellStyle createCellStyle(Workbook workbook, IndexedColors color) {
        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setFillForegroundColor(color.getIndex());
        cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return cellStyle;
    }

    private String getDivisionNameById(long divisionId) {
        switch ((int) divisionId) {
            case 1:
                return "Dhaka";
            case 2:
                return "Chittagong";
            case 3:
                return "Rajshahi";
            case 4:
                return "Khulna";
            case 5:
                return "Barishal";
            case 6:
                return "Sylhet";
            case 7:
                return "Rangpur";
            case 8:
                return "Mymensingh";
            default:
                return "Unknown";
        }
    }
}
