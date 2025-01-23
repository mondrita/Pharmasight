package com.pharmasight.controller;

import com.pharmasight.dto.VendorDTO;
import com.pharmasight.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class VendorController {
    private final VendorService vendorService;

    @GetMapping("/vendor/search")
    public List<VendorDTO> getGenericSuggestions(
            @RequestParam String prefix,
            @RequestParam(defaultValue = "5") int limit) {

            return vendorService.getSuggestions(prefix, limit);
    }
}
