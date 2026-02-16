package com.loaders;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;
import java.util.logging.Logger;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.items.Food;
import com.repositories.FoodRepository;

@Component

public class DataLoader implements CommandLineRunner {
    
    private static final Logger log = Logger.getLogger(DataLoader.class.getName());

    private final FoodRepository foodRepository;

    public DataLoader(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        if (foodRepository.count() == 0) {
            log.info("Database is empty. Loading data from JSON...");
            loadFoodsFromJson();
        } else {
            log.info("Database already contains {} foods. Skipping data load.");
        }
    }
    
    private void loadFoodsFromJson() {
        try {
            Gson gson = new Gson();
            FileReader reader = new FileReader("..//scraper/output/foods_selver.json");
            
            Type listType = new TypeToken<List<Food>>(){}.getType();
            List<Food> foods = gson.fromJson(reader, listType);
            
            reader.close();
            
            log.info("Loaded {} foods from JSON");
            
            foodRepository.saveAll(foods);
            
            log.info("Successfully imported {} foods into database");
            
        } catch (IOException e) {
            log.info("Error");
        }
    }
}