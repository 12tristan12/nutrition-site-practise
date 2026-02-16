package com.items;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name="foods")   

public class Food {

    @Id 
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=500)
    private String name;

    @Column(name = "caloriesPer100g")
    private double caloriesPer100g;

    @Column(name = "proteinPer100g")
    private double proteinPer100g;

    @Column(name = "fatPer100")
    private double fatPer100g;

    @Column(name = "carbsPer100g")
    private double carbsPer100g;

    @Column(name = "sugarPer100g")
    private double sugarPer100g;

    @Column(columnDefinition = "TEXT[]")
    private String[] allergies;

    public Food() {
    }

    public Food(Long id, String name, Double caloriesPer100g, Double proteinPer100g, 
                Double fatPer100g, Double carbsPer100g, Double sugarPer100g, String[] allergies) {
        this.id = id;
        this.name = name;
        this.caloriesPer100g = caloriesPer100g;
        this.proteinPer100g = proteinPer100g;
        this.fatPer100g = fatPer100g;
        this.carbsPer100g = carbsPer100g;
        this.sugarPer100g = sugarPer100g;
        this.allergies = allergies;
    }

    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Double getCaloriesPer100g() {
        return caloriesPer100g;
    }
    
    public void setCaloriesPer100g(Double caloriesPer100g) {
        this.caloriesPer100g = caloriesPer100g;
    }
    
    public Double getProteinPer100g() {
        return proteinPer100g;
    }
    
    public void setProteinPer100g(Double proteinPer100g) {
        this.proteinPer100g = proteinPer100g;
    }
    
    public Double getFatPer100g() {
        return fatPer100g;
    }
    
    public void setFatPer100g(Double fatPer100g) {
        this.fatPer100g = fatPer100g;
    }
    
    public Double getCarbsPer100g() {
        return carbsPer100g;
    }
    
    public void setCarbsPer100g(Double carbsPer100g) {
        this.carbsPer100g = carbsPer100g;
    }
    
    public Double getSugarPer100g() {
        return sugarPer100g;
    }
    
    public void setSugarPer100g(Double sugarPer100g) {
        this.sugarPer100g = sugarPer100g;
    }
    
    public String[] getAllergies() {
        return allergies;
    }
    
    public void setAllergies(String[] allergies) {
        this.allergies = allergies;
    }
}
