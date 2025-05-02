import React, { useState,useRef} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createProduct} from "../../redux/product";

const AddProduct = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add states for form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const photoRef = useRef(null); // file ref

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      setPrice(value);
    }
  };

  const handleStockChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      setStock(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !price || !stock || !category || !photoRef.current) {
      alert("All fields are required.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("photo", photoRef.current); // this is the File object
  
    await dispatch(createProduct(formData));
    navigate("/admin/product");
  };

  return (
    <div className="registery">
      <h1>Product Info</h1>

      <form className="inp" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={handlePriceChange}
          min="0"
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={handleStockChange}
          min="0"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="file"
          placeholder="Photo URL"
          accept="image/*"
         
          onChange={(e) => photoRef.current = e.target.files[0]}
        />
        <button type="submit">Make</button>
      </form>
    </div>
  );
};

export default AddProduct;
