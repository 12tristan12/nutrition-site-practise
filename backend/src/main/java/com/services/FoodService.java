package com.services;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.items.Food;
import com.repositories.FoodRepository;


@Service
@Transactional(readOnly = true)
public class FoodService {
    
    private final FoodRepository foodRepository;

    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }
    
    public Page<Food> getAllFoods(Pageable pageable) {
        return foodRepository.findAll(pageable);
    }
    
    public Optional<Food> getFoodById(Long id) {
        return foodRepository.findById(id);
    }
    
    public Page<Food> searchFoods(String searchTerm, Pageable pageable) {
        return foodRepository.searchByName(searchTerm, pageable);
    }
    
    @Transactional
    public Food saveFood(Food food) {
        return foodRepository.save(food);
    }
    
    @Transactional
    public void deleteFood(Long id) {
        foodRepository.deleteById(id);
    }
}