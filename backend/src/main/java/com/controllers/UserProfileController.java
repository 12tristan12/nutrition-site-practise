package com.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.items.UserProfile;
import com.repositories.UserProfileRepository;


@RestController
@RequestMapping("api/profile")


public class UserProfileController {

    private final UserProfileRepository repo;

    public UserProfileController(UserProfileRepository repo){
        this.repo = repo;
    }
    
    @PostMapping("/login")
    public ResponseEntity<UserProfile> login(@RequestBody LoginRequest request) {
        if (request.username() == null || request.username().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
 
        UserProfile profile = repo.findByUsername(request.username())
                .orElseGet(() -> repo.save(new UserProfile(request.username())));
 
        return ResponseEntity.ok(profile);
    }
 
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long userId) {
        return repo.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
 
    @PutMapping("/{userId}")
    public ResponseEntity<UserProfile> updateProfile(
            @PathVariable Long userId,
            @RequestBody UserProfile incoming) {
        return repo.findById(userId)
                .map(existing -> {
                    existing.setWeight(incoming.getWeight());
                    existing.setHeight(incoming.getHeight());
                    existing.setAge(incoming.getAge());
                    existing.setActivityLevel(incoming.getActivityLevel());
                    existing.setIntakeLevel(incoming.getIntakeLevel());
                    return ResponseEntity.ok(repo.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }
 

    record LoginRequest(String username) {}
}
