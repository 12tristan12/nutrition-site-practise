package com.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.items.FoodLog;
import com.repositories.FoodLogRepository;

@RestController
@RequestMapping("/api/foodlog")
public class FoodLogController {

    private static final Long DEFAULT_USER_ID = 1L;

    private final FoodLogRepository repo;

    public FoodLogController(FoodLogRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<FoodLog> getByDate(@RequestParam(required = false) String date) {
        LocalDate localDate = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        return repo.findByUserIdAndDate(DEFAULT_USER_ID, localDate);
    }

    @PostMapping
    public ResponseEntity<FoodLog> addEntry(@RequestBody FoodLog entry) {
        entry.setUserId(DEFAULT_USER_ID);
        entry.setDate(LocalDate.now());
        return ResponseEntity.ok(repo.save(entry));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}