package com.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.items.UserProfile;
import com.repositories.UserProfileRepository;


@RestController
@RequestMapping("api/profile")


public class UserProfileController {

    private static final Long DEFAULT_USER_ID = 1L;

    private final UserProfileRepository repo;

    public UserProfileController(UserProfileRepository repo){
        this.repo = repo;
    }
    
    @GetMapping
    public ResponseEntity<UserProfile> getProfileID() {
        return repo.findById(DEFAULT_USER_ID).map(ResponseEntity::ok).orElseGet(() -> {
            UserProfile defaults = new UserProfile(DEFAULT_USER_ID, 70, 165, 25, "moderate", "maintain");
            return ResponseEntity.ok(repo.save(defaults));
        });
    }
    
    @PutMapping
    public ResponseEntity<UserProfile> updateProfile(@RequestBody UserProfile incoming) {
        incoming.setId(DEFAULT_USER_ID);
        return ResponseEntity.ok(repo.save(incoming));
    }
}
