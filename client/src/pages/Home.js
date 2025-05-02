import React, {  useState } from "react";
import "../css/Home.css";
import Card from "../components/Card";

import { useDispatch, useSelector } from "react-redux";


function Home() {
  
  const [query] = useState("");
  const [page, setPage] = useState(1);

 

  const Dispatch = useDispatch();



  const data = useSelector((state)=>state.product.productInfo);
  

  const isPrevPage = page > 1;
  const isNextPage = page < data.length / 10;

  const itemsPerPage = 10;
  const paginatedItems = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  return (
    <div className="home">
      <div className="Showcase">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRkkE4MAAkihr1xFfnmeMZPRNH4JEhIA-QZA&s"
          alt=""
        />
        <div className="cover"></div>
        <div className="data">
          <h1>EVERYTHING.</h1>
          <p>You Buy. We Sell.</p>
        </div>
      </div>
      <div className="main">
        <h1>Shop</h1>
        <div className="cards">
          {paginatedItems.map((item) => (
            <Card key={item._id} item={item} />
          ))}
        </div>
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
      </div>
    </div>
  );
}

export default Home;
