import { useEffect, useState } from "react";
import { getAllFoods, searchFoods } from "../api/foodService";
import { SearchBar }  from "../components/SearchBar";
import type { Product } from "../types/Food";
import  ProductItem from "../components/ProductItem";
import NutritionBars from "../components/NutritionBars";
import MacroCalculator from "../components/MacroCalculator";
import ActivityCalculator from "../components/ActivityCalculator.tsx"
import { addLogEntry, deleteLogEntry, getProfile, getLogByDate, saveProfile } from "../api/profileService.ts";
import WeekCalendar from "../components/WeekCalendar";
import type { UserProfile } from "../api/profileService";
import LoginPopup from "../components/LoginPopup";

interface ConsumedFood {
  logId: number;
  food: Product;
  servings: number;
}

const toDateString = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;

function MainPage(){

    const [foods, setFoods] = useState<Product[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [consumedFoods, setConsumedFoods] = useState<ConsumedFood[]>([]);
    const [weight, setWeight] = useState<string>("70");
    const [height, setHeight] = useState<string>("165");
    const [age, setAge] = useState<string>("35");
    const [activityLevel, setActivityLevel] = useState<string>("moderate");
    const [intakeLevel, setIntakeLevel] = useState<string>("maintain");
    const [selectedDate, setSelectedDate] = useState<string>(toDateString(new Date()));
    const [user, setUser] = useState<UserProfile | null>(null);


    useEffect(() => {
    const savedId = localStorage.getItem("userId");
    if (savedId) {
      getProfile(Number(savedId))
        .then((p) => {
          setUser(p);
          applyProfile(p);
        })
        .catch(() => localStorage.removeItem("userId")); // stale id — show login again
    }
  }, []);
 
  const applyProfile = (p: UserProfile) => {
    setWeight(String(p.weight));
    setHeight(String(p.height));
    setAge(String(p.age));
    setActivityLevel(p.activityLevel);
    setIntakeLevel(p.intakeLevel);
  };
 
  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    applyProfile(profile);
  };
 

  useEffect(() => {
    if (!user) return;
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    if (!w || !h || !a) return;
 
    const timer = setTimeout(() => {
      saveProfile(user.id, { weight: w, height: h, age: a, activityLevel, intakeLevel })
        .catch(console.error);
    }, 600);
 
    return () => clearTimeout(timer);
  }, [weight, height, age, activityLevel, intakeLevel]);
 
 
  useEffect(() => {
    if (!user) return;
    getLogByDate(user.id, selectedDate)
      .then(async (entries) => {
        const consumed = await Promise.all(
          entries.map(async (e) => {
            const res = await fetch(`http://localhost:8080/api/foods/${e.foodId}`);
            const food: Product = await res.json();
            return { logId: e.id, food, servings: e.servings };
          })
        );
        setConsumedFoods(consumed);
      })
      .catch(console.error);
  }, [selectedDate, user]);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response =
          searchQuery.trim() === ""
            ? await getAllFoods(currentPage, 20)
            : await searchFoods(searchQuery, currentPage, 20);
        setFoods(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        setError(null);
      } catch {
        setError("Failed loading foods");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchQuery]);
 
  const handleSearch = (query: string) => { setSearchQuery(query); setCurrentPage(0); };
  const handleNextPage = () => { if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 0) setCurrentPage(currentPage - 1); };
 
  const handleAddFood = async (food: Product, servings: number) => {
    if (!user) return;
    try {
      const entry = await addLogEntry(user.id, food.id, servings);
      setConsumedFoods((prev) => [...prev, { logId: entry.id, food, servings }]);
    } catch {
      console.error("Failed to save food log entry");
    }
  };
 
  const handleRemoveFood = async (logId: number) => {
    try {
      await deleteLogEntry(logId);
      setConsumedFoods((prev) => prev.filter((f) => f.logId !== logId));
    } catch {
      console.error("Failed to delete food log entry");
    }
  };
 
  const handleWeightChange   = (e: React.ChangeEvent<HTMLInputElement>)  => setWeight(e.target.value);
  const handleHeightChange   = (e: React.ChangeEvent<HTMLInputElement>)  => setHeight(e.target.value);
  const handleAgeChange      = (e: React.ChangeEvent<HTMLInputElement>)  => setAge(e.target.value);
  const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => setActivityLevel(e.target.value);
  const handleIntakeChange   = (e: React.ChangeEvent<HTMLSelectElement>) => setIntakeLevel(e.target.value);
 
  return (
    <div className="main-page-wrapper">
      {!user && <LoginPopup onLogin={handleLogin} />}
 
      <div className="left-side">
        <header>
          <div className="main-page-header">
            <h1>Nutrition Tracker</h1>
          </div>
          <SearchBar onSearch={handleSearch} />
        </header>
 
        <main>
          <p>Showing {foods.length} of {totalElements} foods</p>
          {loading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          {!loading && !error && (
            <div className="food-grid">
              {foods.length === 0 ? (
                <p>No foods found</p>
              ) : (
                foods.map((food) => (
                  <ProductItem key={food.id} food={food} onAddFood={handleAddFood} />
                ))
              )}
            </div>
          )}
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 0}>Previous</button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</button>
          </div>
        </main>
 
      
      </div>
 
      <div className="right-side">
        <NutritionBars
          consumedFoods={consumedFoods}
          weight={weight}
          age={age}
          height={height}
          activitylevel={activityLevel}
          intakelevel={intakeLevel}
          onRemoveFood={handleRemoveFood}
        />
        <div className="below-bars">
          <MacroCalculator
            weight={weight}
            height={height}
            age={age}
            onWeightChange={handleWeightChange}
            onHeightChange={handleHeightChange}
            onAgeChange={handleAgeChange}
          />
          <ActivityCalculator
            activitylevel={activityLevel}
            intakelevel={intakeLevel}
            onActivityChange={handleActivityChange}
            onIntakeChange={handleIntakeChange}
          />
        </div>
        <WeekCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>
    </div>
  );
}
 
export default MainPage;