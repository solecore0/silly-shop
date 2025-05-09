import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Table from "../../components/admin/Table";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "../../redux/user";
import config from "../../config";
import Loader from "../../components/Loader";

const Customer = () => {
  const dispatch = useDispatch();
  const { allUsers , status } = useSelector((state) => state.user);

  console.log(allUsers);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const columns = [
    {
      id: "avatar",
      header: "Avatar",
      accessorKey: "avatar",
      cell: ({ row }) => (
        <img
          className="Cimg avatar"
          src={row.original.photo}
          alt={row.original.name.slice(0, 1) || "Product"}
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
      id: "gender",
      header: "Gender",
      accessorKey: "gender",
      cell: ({ row }) => row.original.gender || "N/A",
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => row.original.email || "N/A",
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => row.original.role || "N/A",
    },
    {
      id: "action",
      header: "Action",
      accessorKey: "action",
      cell: ({ getValue }) => 
        <button className="trash">
          <i className="fa-solid fa-trash"></i>
        </button>
        ,
    },
  ];


  const showPagination = false;

  if (status === "loading") return <Loader />;

  return (
    <div className="admin-container ">
      <AdminSidebar />
      <main>
        <div>
          <h3>PRODUCTS</h3>
        </div>
        {allUsers && allUsers.length > 0 ? (
          <Table
            columns={columns}
            data={allUsers}
            showPagination={false}
            CCN="admin-product-table"
          />
        ) : (
          <div className="flex items-center justify-center">
            <p>No users? why you not admin?</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Customer;
