package com.controllers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.items.Food;
import com.services.FoodService;


@RestController
@RequestMapping("api/foods")
@CrossOrigin(origins = "*")


public class FoodController {
    
    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }



    @GetMapping
    public ResponseEntity<Page<Food>> getAllFoods(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "name") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Food> foods = foodService.getAllFoods(pageable);
        return ResponseEntity.ok(foods);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Food> getFoodById(@PathVariable Long id) {
        return foodService.getFoodById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<Food>> searchFoods(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Food> foods = foodService.searchFoods(q, pageable);
        return ResponseEntity.ok(foods);
    }
    
    @PostMapping
    public ResponseEntity<Food> createFood(@RequestBody Food food) {
        Food savedFood = foodService.saveFood(food);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFood);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Food> updateFood(@PathVariable Long id, @RequestBody Food food) {
        return foodService.getFoodById(id)
                .map(existingFood -> {
                    food.setId(id);
                    Food updatedFood = foodService.saveFood(food);
                    return ResponseEntity.ok(updatedFood);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        return foodService.getFoodById(id)
                .map(food -> {
                    foodService.deleteFood(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
