package com.hansen.fateEchoes.fate_echoes.repository;

import com.hansen.fateEchoes.fate_echoes.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {
} 