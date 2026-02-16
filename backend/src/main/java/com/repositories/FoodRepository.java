package com.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.items.Food;


@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    
    Page<Food> findByNameContainingIgnoreCase(String name, Pageable pageable);

    
    @Query("SELECT f FROM Food f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Food> searchByName(@Param("searchTerm") String searchTerm, Pageable pageable);
}