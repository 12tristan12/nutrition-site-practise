package com.items;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="user_profile")
public class UserProfile{

    @Id
    private long id;

    private double weight;
    private double height;
    private int age;
    private String activityLevel;
    private String intakeLevel;

    public UserProfile (){}


    public UserProfile(Long id, double weight, double height, int age, String activityLevel, String intakeLevel) {
        
        this.id = id;
        this.weight = weight;
        this.height = height;
        this.age = age;
        this.activityLevel = activityLevel;
        this.intakeLevel = intakeLevel;
    }

    public Long getId(){
        return id;
    }

    public void setId(Long id){
        this.id = id;
    }

    public double getWeight(){
        return weight;
    }

    public void setWeight(double weight){
        this.weight = weight;
    }

    public double getHeight(){
        return height;
    }

    public void setHeight(double height){
        this.height = height;
    }

    public int getAge(){
        return age;
    }

    public void setAge(int age){
        this.age = age;
    }

    public String getActivityLevel(){
        return activityLevel;
    }

    public void setActivityLevel(String activityLevel){
        this.activityLevel = activityLevel;
    }

    public String getIntakeLevel(){
        return intakeLevel;
    }

    public void setIntakeLevel(String intakeLevel){
        this.intakeLevel = intakeLevel;
    }

}
