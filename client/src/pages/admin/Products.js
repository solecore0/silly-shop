import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Table from "../../components/admin/Table";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../../redux/product";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const Products = () => {
  const dispatch = useDispatch();
  const Products = useSelector((state) => state.product);
  const { allProducts } = Products;
  const [rows, setRows] = useState(allProducts);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch, navigate, Products]);

  const columns = [
    {
      id: "photo",
      header: "Photo",
      accessorKey: "photo",
      cell: ({ getValue }) => (
        <img src={`${config.UPLOADS_URL}${getValue()}`} alt="Product" />
      ),
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
    },
    {
      id: "price",
      header: "Price",
      accessorKey: "price",
    },
    {
      id: "stock",
      header: "Stock",
      accessorKey: "stock",
    },
    {
      id: "action",
      header: "Action",
      accessorKey: "action",
      cell: ({ getValue }) => (
        <Link to={`/admin/product}`}>
          <i className="fa-solid fa-eye"></i>
        </Link>
      ),
    },
  ];

  const data = React.useMemo(() => rows, [rows]);
  const showPagination = false;

  return (
    <div className="admin-container ">
      <AdminSidebar />
      <main>
        <div className="ProductDiv">
          <h3>PRODUCTS</h3>
          <button>
            <Link to="/admin/Addproduct">
              <i className="fa-solid fa-plus"></i>
            </Link>
          </button>
        </div>
        {rows && rows.length > 0 ? (
          <Table
            columns={columns}
            data={data}
            showPagination={showPagination}
            CCN={"admin-product-table"}
          />
        ) : (
          <p>No Products</p>
        )}
      </main>
    </div>
  );
};

export default Products;
