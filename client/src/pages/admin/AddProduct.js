import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createProduct } from "../../redux/product";
import { toast } from "react-toastify";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add states for form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const photoRef = useRef(null); // file ref
  const thumbnailRef = useRef(null); // file ref
  const [thumbnailName, setThumbnailName] = useState("");
  const [photoNames, setPhotoNames] = useState([]);

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
      toast.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    photoRef.current.forEach((file) => {
      formData.append("photos", file); // Use the exact expected field name
    });
    formData.append("thumbnail", thumbnailRef.current);
    formData.append("description", description);

    console.log(formData);

    await dispatch(createProduct(formData));
    // navigate("/admin/product");
  };

  return (
    <div className="registery" style={{ marginTop: "100px" }}>
      <h1>Create Product</h1>

      <form id="create-product-form" className="inp" onSubmit={handleSubmit}>
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
          type="text"
          placeholder="Description of Product"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="file-input-wrapper">
          {/* Thumbnail upload */}
          <label htmlFor="thumbnail-upload" className="upload-button">
            Upload Thumbnail
          </label>
          <input
            id="thumbnail-upload"
            type="file"
            accept="image/*"
            onChange={(e) => (thumbnailRef.current = e.target.files[0])}
            style={{ display: "none" }}
          />

          {/* Photo upload */}
          <label htmlFor="photo-upload" className="upload-button">
            Upload Photos (Max 5)
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (files.length > 5) {
                toast.error("You can only upload up to 5 files.");
                e.target.value = "";
                return;
              }
              photoRef.current = files;
            }}
            style={{ display: "none" }}
          />
        </div>
        <span className="hover-text" style={{ color: "yellowgreen" }}>
          Tip:press ctrl to select multiple images
        </span>
        <button type="submit">Make</button>
      </form>
    </div>
  );
};

export default AddProduct;
