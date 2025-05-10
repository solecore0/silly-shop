import React, { useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Table from "../../components/admin/Table";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../../redux/product";
import config from "../../config";
import Loader from "../../components/Loader";

const Products = () => {
  const dispatch = useDispatch();
  const { allProducts, status, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const columns = [
    {
      id: "photo",
      header: "Photo",
      accessorKey: "photo",
      cell: ({ row }) => (
        <img
          src={`${config.UPLOADS_URL}${row.original.thumbnail}`}
          alt={row.original.name || "Product"}
          style={{width:"80px" , height:"80px" , borderRadius:"10px"}}
        />
      ),
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => row.original.name || "N/A",
    },
    {
      id: "price",
      header: "Price",
      accessorKey: "price",
      cell: ({ row }) => `$${row.original.price || 0}`,
    },
    {
      id: "stock",
      header: "Stock",
      accessorKey: "stock",
      cell: ({ row }) => row.original.stock || 0,
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        const productId = row.original._id;
        return productId ? (
          <Link to={`/admin/product/${productId}`}>
            <i className="fa-solid fa-eye"></i>
          </Link>
        ) : null;
      },
    },
  ];

  if (status === "loading") return <Loader />;
  if (status === "failed")
    return (
      <div className="error-message">
        Error: {error || "Failed to load products"}
      </div>
    );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        <div className="ProductDiv">
          <h3>PRODUCTS</h3>
          <button>
            <Link to="/admin/Addproduct">
              <i
                style={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                }}
                className="fa-solid fa-plus"
              ></i>
            </Link>
          </button>
        </div>
        {allProducts && allProducts.length > 0 ? (
          <Table
            columns={columns}
            data={allProducts}
            showPagination={false}
            CCN="admin-product-table"
          />
        ) : (
          <div className="flex items-center justify-center">
            <p>No Products</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
