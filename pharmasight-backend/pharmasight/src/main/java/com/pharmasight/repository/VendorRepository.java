package com.pharmasight.repository;

import com.pharmasight.dto.VendorDTO;
import com.pharmasight.model.Vendor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VendorRepository extends JpaRepository<Vendor, Long> {
    @Query("SELECT new com.pharmasight.dto.VendorDTO(v.id, v.vendorName) " +
            "FROM Vendor v WHERE v.vendorName LIKE :prefix%")
    List<VendorDTO> findByVendorNamePrefix(String prefix, Pageable pageable);
}