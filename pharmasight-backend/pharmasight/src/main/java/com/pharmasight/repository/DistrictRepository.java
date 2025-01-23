package com.pharmasight.repository;

import com.pharmasight.dto.DistrictDTO;
import com.pharmasight.model.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    @Query("SELECT new com.pharmasight.dto.DistrictDTO(d.name, d.latitude, d.longitude) " +
            "FROM District d " +
            "WHERE d.division.id = :divisionId")
    List<DistrictDTO> findDistrictLatLongsByDivision(@Param("divisionId") Long divisionId);
}
