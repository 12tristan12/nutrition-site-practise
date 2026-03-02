package com.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.items.UserProfile;


@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long>{


    
}
