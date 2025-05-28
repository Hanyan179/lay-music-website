package com.hansen.fateEchoes.fate_echoes.service.impl;

import com.hansen.fateEchoes.fate_echoes.model.Region;
import com.hansen.fateEchoes.fate_echoes.repository.RegionRepository;
import com.hansen.fateEchoes.fate_echoes.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegionServiceImpl implements RegionService {

    @Autowired
    private RegionRepository regionRepository;

    @Override
    public List<Region> getAllRegions() {
        return regionRepository.findAll();
    }
} 