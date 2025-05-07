import React, { useState, useEffect } from "react";
import "../css/search.css";
import Card from "../components/Card";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories, fetchProductSearch } from "../redux/product";
import { setQuery } from "../redux/product";

function Search() {
  const screenWidth = useSelector((state) => state.ui.screenWidth);
  const query = useSelector((state) => state.product.query);

  const dispatch = useDispatch();

  const [sort, setSort] = useState("asc");

  const [category, setCategory] = useState("");

  const [price, setPrice] = useState(100000);

  const [page, setPage] = useState(1);

  useEffect(() => {
    const tableData = { sort, category, price, query };
    dispatch(fetchProductSearch(tableData));
    dispatch(fetchCategories());
  }, [sort, category, price, query]);

  const categories = useSelector((state) => state.product.categories);
  const data = useSelector((state) => state.product.productSearch);

  const isPrevPage = page > 1;
  const isNextPage = page < data.length / 10;

  const itemsPerPage = 10;
  const paginatedItems = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="container">
      {screenWidth > 1000 ? (
        ""
      ) : (
        <div className="ser">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              if (e.target.value === undefined) {
                dispatch(setQuery(""));
              } else {
                dispatch(setQuery(e.target.value));
              }
            }}
            placeholder="Search by name..."
          />
        </div>
      )}
      <div className="search">
        <div className="choises">
          {screenWidth > 1000 ? <h1>Filter</h1> : ""}

          <div className="Slc">
            <h3>Category:</h3>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}>
              <option value="">Choose Catagory</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="Slc">
            <h3>Prices:</h3>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
              }}>
              <option value="asc">Price (Low to High)</option>
              <option value="dsc">Price (High to Low)</option>
            </select>
          </div>

          <div className="Slc">
            <h3>Max Price:</h3>
            <h3>${price}</h3>
          </div>
          <input
            type="range"
            min={100}
            max={100000}
            value={price}
            onChange={(e) => {
              setPrice(Number(e.target.value));
            }}
          />
        </div>

        <div className="result">
          <h1>Search Results</h1>
          <div className="cards">
            {paginatedItems.map((item) => (
              <Card key={item._id} item={item} />
            ))}
          </div>
          {paginatedItems.length === 0 ? (
            <p className="txt">Nothing here</p>
          ) : (
            ""
          )}

          {data.length <= 10 ? null : (
            <div className="pgch">
              <button
                disabled={!isPrevPage}
                onClick={() => setPage((prev) => prev - 1)}>
                Prev
              </button>
              <span>{page}</span>
              <button
                disabled={!isNextPage}
                onClick={() => setPage((prev) => prev + 1)}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
