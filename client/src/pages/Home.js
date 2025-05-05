import React, { useState } from "react";
import Card from "../components/Card";

import { useDispatch, useSelector } from "react-redux";

function Home() {
  const [query] = useState("");
  const [page, setPage] = useState(1);

  const Dispatch = useDispatch();

  const data = useSelector((state) => state.product.productInfo);

  const isPrevPage = page > 1;
  const isNextPage = page < data.length / 10;

  const itemsPerPage = 10;
  const paginatedItems = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const url = "https://www.premierline.co.uk/wp-content/uploads/2020/02/shop-layout-desktop-stage-4.jpeg"; 
  return (
    <div className="home">
      <div className="Showcase">
        <img
          src={url}
          alt=""
        />
        <div className="cover"></div>
        <div className="data">
          <h1>EVERYTHING.</h1>
          <p>You Buy. We Sell.</p>
        </div>
      </div>
      <div className="main">
        <h1>Latest Product</h1>
        {data?.length > 0 ? (
          <div className="cards">
            {paginatedItems.map((item) => (
              <Card key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="no-data">
            <h2>No Items Exist.</h2>
          </div>
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
  );
}

export default Home;
