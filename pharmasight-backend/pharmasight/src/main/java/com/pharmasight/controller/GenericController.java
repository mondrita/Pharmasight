package com.pharmasight.controller;

import com.pharmasight.model.Generic;
import com.pharmasight.service.GenericService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class GenericController {

    private final GenericService genericService;

    @GetMapping("/generic/search")
    public List<Generic> getGenericSuggestions(@RequestParam String prefix,
                                               @RequestParam(defaultValue = "5") int limit) {
        return genericService.getSuggestions(prefix, limit);
    }
}