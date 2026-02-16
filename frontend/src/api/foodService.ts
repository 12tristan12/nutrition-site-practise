const BASE_URL = "http://localhost:8080/api"

export const getAllFoods = async (
    page: number = 0,
    size: number = 20,
    sortBy: string = "name",
    sortDir: string = "asc"
) => {
    const url = `${BASE_URL}/foods?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    
    const response = await fetch(url)

    if (!response.ok){
        throw new Error('Failed fetching')
    }

    return await response.json()
};

export const searchFoods = async (
    query: string,
    page: number = 0,
    size: number = 20
) => {
    const url = `${BASE_URL}/foods/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`;

    const response =  await fetch(url)

    if(!response.ok){
        throw new Error('Failed search')
    }

    return await response.json()
}

export const searchByID = async (id:number) =>{

    const url = `${BASE_URL}/foods/${id}`
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch food with id ${id}`);
    }
  
    return await response.json();
};


