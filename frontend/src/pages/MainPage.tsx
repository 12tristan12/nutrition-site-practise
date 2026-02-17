import { useEffect, useState } from "react";
import { getAllFoods, searchFoods } from "../api/foodService";
import { SearchBar }  from "../components/SearchBar";
import type { Product } from "../types/Food";
import { ProductItem } from "../components/ProductItem";


function MainPage(){

    const [foods, setFoods] = useState<Product[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect (() => {
        const fetchData = async () =>{ 
            try {
                setLoading(true);

                let response;

                if (searchQuery.trim() === ""){
                    response = await getAllFoods(currentPage, 20);
                }
                else {
                    response = await searchFoods(searchQuery, currentPage, 20);
                }
                
                setFoods(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
                setError(null);

            }
            catch(err) {
                setError("FAiled loading foods");
            }
            finally{
                setLoading(false);
            }
        };

        fetchData();
    },
    [currentPage, searchQuery]);

    const handleSearch = (query: string) => {
      setSearchQuery(query);
      setCurrentPage(0); 
    };

    const handleNextPage = () =>{
        if (currentPage < totalPages -1){
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0){
            setCurrentPage(currentPage - 1);
        }
    };

    return (
    <div className="main-page-container">
      <header>
        <div className = "main-page-header">
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
                <ProductItem key={food.id} product={food} />
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 0}>
            Previous
          </button>

          <span>Page {currentPage + 1} of {totalPages}</span>

          <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
export default MainPage;