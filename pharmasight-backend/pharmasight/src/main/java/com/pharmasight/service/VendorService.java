package com.pharmasight.service;

import com.pharmasight.dto.VendorDTO;
import com.pharmasight.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    public List<VendorDTO> getSuggestions(String prefix, int limit) {
        try {
            Pageable pageable = PageRequest.of(0, limit);
            return vendorRepository.findByVendorNamePrefix(prefix, pageable);
        }catch (Exception e) {
            System.out.println(e.getMessage());
            throw e;
        }

    }
}