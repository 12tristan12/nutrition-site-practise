const BASE_URL = "http://localhost:8080/api"

export interface UserProfile{

    weight: number;
    height: number;
    age: number;
    activityLevel: string;
    intakeLevel: string;
}

export const getProfile = async(): Promise<UserProfile> => {
    const res = await fetch(`${BASE_URL}/profile`);

    if (!res.ok)
        throw new Error("Failed to fetch!");
    return res.json();
};

export const saveProfile = async(profile: UserProfile): Promise<void> => {
    await fetch(`${BASE_URL}/profile`, {
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

export const getLogByDate = async (date: String): Promise<FoodLogEntry[]> => {
  const res = await fetch(`${BASE_URL}/foodlog?date=${date}`);
  if (!res.ok) throw new Error("Failed to load food log");
  return res.json();
};

export const addLogEntry = async (
  foodId: number,
  servings: number
): Promise<FoodLogEntry> => {
  const res = await fetch(`${BASE_URL}/foodlog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ foodId, servings }),
  });
  if (!res.ok) throw new Error("Failed to add food log entry");
  return res.json();
};

export const deleteLogEntry = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/foodlog/${id}`, { method: "DELETE" });
};