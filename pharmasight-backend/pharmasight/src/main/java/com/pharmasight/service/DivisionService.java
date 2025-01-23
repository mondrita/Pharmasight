package com.pharmasight.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.pharmasight.dto.DistrictDTO;
import com.pharmasight.dto.DivisionDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pharmasight.model.Division;
import com.pharmasight.repository.DistrictRepository;
import com.pharmasight.repository.DivisionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Service
public class DivisionService {

    private final DivisionRepository divisionRepository;

    private final DistrictRepository districtRepository;

    public void saveGeoJsonToDivision(Long id, MultipartFile file) throws IOException {
        try {
            Division division = divisionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Division not found"));

            ObjectMapper objectMapper = new ObjectMapper();

            JsonNode jsonNode = objectMapper.readTree(file.getInputStream());
            division.setGeoData(jsonNode.toString());
            divisionRepository.save(division);
        } catch (Exception e) {
            System.err.println("Error parsing GeoJSON: " + e.getMessage());
            throw e;
        }
    }

    public DivisionDto getGeoJsonDataByName(String divName) throws JsonProcessingException {
        Division division = divisionRepository.findByName(divName)
                .orElseThrow(() -> new RuntimeException("Division not found"));

        ObjectMapper objectMapper = new ObjectMapper();

        DivisionDto divisionDto = new DivisionDto();
        divisionDto.setDivisionName(division.getName());
        divisionDto.setGeoData(objectMapper.readTree(division.getGeoData()));
        divisionDto.setZoomVal(division.getZoomVal());
        return divisionDto;
    }

    public List<DistrictDTO> getDistrictLatLongsByDivision(Long divisionId){
        return districtRepository.findDistrictLatLongsByDivision(divisionId);
    }
}
