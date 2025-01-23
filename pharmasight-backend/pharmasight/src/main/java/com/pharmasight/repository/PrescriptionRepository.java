package com.pharmasight.repository;

import com.pharmasight.dto.DistrictMarketShareDTO;
import com.pharmasight.dto.DistrictSalesDTO;
import com.pharmasight.dto.DivisionSalesDTO;
import com.pharmasight.dto.TopDrugDTO;
import com.pharmasight.model.Prescription;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    @Query("SELECT new com.pharmasight.dto.DivisionSalesDTO(d.id, d.name, CAST(SUM(dr.price * m.dosage) AS double))" +
            "FROM Prescription p " +
            "JOIN p.organization o " +
            "JOIN o.address a " +
            "JOIN a.division d " +
            "JOIN p.medications m " +
            "JOIN m.drug dr " +
            "JOIN dr.generic g " +
            "JOIN dr.vendor v " +
            "WHERE g.id = :genericId " +
            "AND v.id = :vendorId " +
            "AND p.dateCreated BETWEEN :startDate AND :endDate " +
            "GROUP BY d.id,d.name " +
            "ORDER BY SUM(dr.price * m.dosage) DESC")
    List<DivisionSalesDTO> getSalesByDivisionById(@Param("genericId") Long genericId,
                                                  @Param("vendorId") Long vendorId,
                                                  @Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);



    @Query("SELECT new com.pharmasight.dto.TopDrugDTO(d.id, d.drugName, s.strengthName, f.formationName, SUM(m.dosage * d.price)) " +
            "FROM Medication m " +
            "JOIN m.prescription p " +
            "JOIN m.drug d " +
            "JOIN d.generic g " +
            "JOIN d.vendor v " +
            "JOIN p.organization o " +
            "JOIN o.address a " +
            "JOIN a.division x " +
            "JOIN d.formation f " +
            "JOIN d.strength s " +
            "WHERE g.id = :genericId " +
            "AND v.id = :vendorId " +
            "AND p.dateCreated BETWEEN :startDate AND :endDate " +
            "AND x.id = :divisionId " +
            "GROUP BY d.id, d.drugName, f.id " +
            "ORDER BY SUM(m.dosage * d.price) DESC")
    List<TopDrugDTO> getTopDrugs(
            @Param("genericId") Long genericId,
            @Param("vendorId") Long vendorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("divisionId") Long divisionId,
            @Param("limit") PageRequest limit);


    @Query("SELECT new com.pharmasight.dto.DistrictSalesDTO(dist.name, CAST(SUM(dr.price * m.dosage) AS double)) " +
            "FROM Prescription p " +
            "JOIN p.organization o " +
            "JOIN o.address a " +
            "JOIN a.district dist " +
            "JOIN a.division divi " +
            "JOIN p.medications m " +
            "JOIN m.drug dr " +
            "JOIN dr.generic g " +
            "JOIN dr.vendor v " +
            "WHERE divi.id = :divisionId " +
            "AND g.id = :genericId " +
            "AND v.id = :vendorId " +
            "AND p.dateCreated BETWEEN :startDate AND :endDate " +
            "GROUP BY dist.name " +
            "ORDER BY SUM(dr.price * m.dosage) DESC")

    List<DistrictSalesDTO> getSalesByDistrictById(@Param("divisionId") Long divisionId,
                                                  @Param("genericId") Long genericId,
                                                  @Param("vendorId") Long vendorId,
                                                  @Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);



    @Query(value = "WITH sales_data AS (" +
            "    SELECT dr.drug_name AS drugName, " +
            "           f.formation_name AS formation, " +
            "           SUM(m.dosage * dr.price) AS totalSales, " +
            "           dt.name AS location, " +
            "           MONTHNAME(p.date_created) AS saleMonth " +
            "    FROM medication m " +
            "    JOIN prescription p ON m.pres_id = p.id " +
            "    JOIN drug dr ON m.drug_id = dr.id " +
            "    JOIN formation f ON dr.formation_id = f.id " +
            "    JOIN organization o ON p.org_id = o.id " +
            "    JOIN address a ON o.address_id = a.id " +
            "    JOIN district dt ON a.district_id = dt.id " +
            "    JOIN division dv ON a.division_id = dv.id " +
            "    WHERE dr.id = :drugId " +
            "    AND p.date_created BETWEEN :startDate AND :endDate " +
            "    GROUP BY dr.drug_name, f.formation_name, dt.name, MONTHNAME(p.date_created) " +
            "), " +
            "location_sales AS ( " +
            "    SELECT location, " +
            "           SUM(totalSales) AS totalSales " +
            "    FROM sales_data " +
            "    GROUP BY location " +
            "), " +
            "month_sales AS ( " +
            "    SELECT saleMonth, " +
            "           SUM(totalSales) AS totalSales " +
            "    FROM sales_data " +
            "    GROUP BY saleMonth " +
            ") " +
            "SELECT MAX(s.drugName) AS Drug_Name, " +
            "       MAX(s.formation) AS Formation, " +
            "       SUM(s.totalSales) AS TotalSales, " +
            "       (SELECT location FROM location_sales ORDER BY totalSales DESC LIMIT 1) AS HighestSalesLocation, " +
            "       (SELECT location FROM location_sales ORDER BY totalSales ASC LIMIT 1) AS LowestSalesLocation, " +
            "       (SELECT saleMonth FROM month_sales ORDER BY totalSales DESC LIMIT 1) AS HighestSalesMonth, " +
            "       (SELECT saleMonth FROM month_sales ORDER BY totalSales ASC LIMIT 1) AS LowestSalesMonth " +
            "FROM sales_data s",
            nativeQuery = true)
    List<Object[]> getRawDrugReport(@Param("drugId") Long drugId,
                                    @Param("startDate") LocalDate startDate,
                                    @Param("endDate") LocalDate endDate);


    // DistrictMarketShare
    @Query("SELECT new com.pharmasight.dto.DistrictMarketShareDTO(dist.name, " +
            "SUM(dr.price * m.dosage), " +
            "SUM(dr.price * m.dosage) / totalSalesInDivision.totalSales * 100) " +
            "FROM Prescription p " +
            "JOIN p.organization o " +
            "JOIN o.address a " +
            "JOIN a.district dist " +
            "JOIN a.division divi " +
            "JOIN p.medications m " +
            "JOIN m.drug dr " +
            "JOIN dr.generic g " +
            "JOIN dr.vendor v " +
            "JOIN (SELECT SUM(dr.price * m.dosage) AS totalSales " +
            "FROM Prescription p " +
            "JOIN p.medications m " +
            "JOIN m.drug dr " +
            "JOIN dr.generic g " +
            "JOIN dr.vendor v " +
            "JOIN p.organization o " +
            "JOIN o.address a " +
            "WHERE a.division.id = :divisionId " +
            "AND g.id = :genericId " +
            "AND v.id = :vendorId " +
            "AND p.dateCreated BETWEEN :startDate AND :endDate) totalSalesInDivision " +
            "WHERE a.division.id = :divisionId " +
            "AND g.id = :genericId " +
            "AND v.id = :vendorId " +
            "AND p.dateCreated BETWEEN :startDate AND :endDate " +
            "GROUP BY dist.name, totalSalesInDivision.totalSales")
    List<DistrictMarketShareDTO> findDistrictMarketShare(@Param("genericId") Long genericId,
                                                         @Param("vendorId") Long vendorId,
                                                         @Param("startDate") LocalDate startDate,
                                                         @Param("endDate") LocalDate endDate,
                                                         @Param("divisionId") Long divisionId);


}
