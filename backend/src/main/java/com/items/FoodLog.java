package com.items;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="food_log")

public class FoodLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long foodId;
    private double servings;
    private LocalDate date;

    public FoodLog() {}

    public FoodLog(long userId, long foodId, double servings, LocalDate date){

        this.userId = userId;
        this.foodId = foodId;
        this.servings = servings;
        this.date = date; 

    }

    public Long getId (){
        return id;
    }

    public void setId(long id){
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public Long getFoodId(){
        return foodId;
    }

    public void setFoodId(long foodId){
        this.foodId = foodId;
    }

    public double getServings() {
        return servings;
    }

    public void setServings(double servings){
        this.servings = servings;
    }

    public LocalDate getDate () {
        return date;
    }

    public void setDate (LocalDate date){
        this.date = date;
    }

}
