package com.pharmasight.service;

import com.pharmasight.model.Generic;
import com.pharmasight.repository.GenericRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GenericService {

    private final GenericRepository genericRepository;

    public List<Generic> getSuggestions(String prefix, int limit) {
        try {
            Pageable pageable = PageRequest.of(0, limit);
            return genericRepository.findByGenericNamePrefix(prefix, pageable);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw e;
        }
    }
}
