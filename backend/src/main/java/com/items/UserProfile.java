package com.items;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="user_profile")
public class UserProfile{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true, nullable = false)
    private String username;

    private double weight;
    private double height;
    private int age;
    private String activityLevel;
    private String intakeLevel;

    public UserProfile (){}


    public UserProfile(String username) {
        
        this.username = username;
        this.weight = 70;
        this.height = 165;
        this.age = 25;
        this.activityLevel = "moderate";
        this.intakeLevel = "maintain";
    }

    public Long getId(){
        return id;
    }

    public String getUsername(){ 
        return username; 
    }


    public void setUsername(String username){
         this.username = username; 
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
