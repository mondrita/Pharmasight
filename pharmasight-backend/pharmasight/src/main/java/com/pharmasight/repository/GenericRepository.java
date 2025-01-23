package com.pharmasight.repository;

import com.pharmasight.model.Generic;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenericRepository extends JpaRepository<Generic, Long> {


    @Query("SELECT g FROM Generic g WHERE g.genericName LIKE :prefix%")
    List<Generic> findByGenericNamePrefix(String prefix, Pageable pageable);
}
