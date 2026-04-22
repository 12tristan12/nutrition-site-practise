const BASE_URL = "http://localhost:8080/api"

export interface UserProfile{
    id: number;
    username: string;
    weight: number;
    height: number;
    age: number;
    activityLevel: string;
    intakeLevel: string;
}

export const login = async(username: string): Promise<UserProfile> =>{
  const res = await fetch(`${BASE_URL}/profile/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const getProfile = async(userId: number): Promise<UserProfile> => {
    const res = await fetch(`${BASE_URL}/profile/${userId}`);

    if (!res.ok)
        throw new Error("Failed to fetch!");
    return res.json();
};

export const saveProfile = async(userId: number, profile: Omit<UserProfile, "id" | "username">): Promise<void> => {
    await fetch(`${BASE_URL}/profile/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
};

export interface FoodLogEntry {
  id: number;
  foodId: number;
  servings: number;
}

export const getLogByDate = async (userId: number, date: String): Promise<FoodLogEntry[]> => {
  const res = await fetch(`${BASE_URL}/foodlog?userId=${userId}&date=${date}`);
  if (!res.ok) throw new Error("Failed to load food log");
  return res.json();
};

export const addLogEntry = async (
  userId: number,
  foodId: number,
  servings: number
): Promise<FoodLogEntry> => {
  const res = await fetch(`${BASE_URL}/foodlog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, foodId, servings }),
  });
  if (!res.ok) throw new Error("Failed to add food log entry");
  return res.json();
};

export const deleteLogEntry = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/foodlog/${id}`, { method: "DELETE" });
};