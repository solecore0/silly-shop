import React, { useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Table from "../../components/admin/Table";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../redux/order";
import Loader from "../../components/Loader";

const Transaction = () => {
  const dispatch = useDispatch();
  const { allOrders, status } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const columns = [
    {
      id: "user",
      header: "Customer",
      accessorKey: "user",
      cell: ({ row }) => row.original.user?.name || "N/A",
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "total",
      cell: ({ row }) => `$${row.original.total || 0}`,
    },
    {
      id: "discount",
      header: "Discount",
      accessorKey: "discount",
      cell: ({ row }) => `$${row.original.discount || 0}`,
    },
    {
      id: "quantity",
      header: "Items",
      accessorKey: "orderItems",
      cell: ({ row }) => {
        const items = row.original.orderItems;
        return items
          ? items.reduce((sum, item) => sum + (item.quantity || 0), 0)
          : 0;
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status || "Processing";
        return <span className={status.toLowerCase()}>{status}</span>;
      },
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        const orderId = row.original._id;
        return orderId ? (
          <Link to={`/order/${orderId}`}>View Details</Link>
        ) : null;
      },
    },
  ];

  if (status === "loading") return <Loader />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        <h3>TRANSACTIONS</h3>
        {allOrders && allOrders.length > 0 ? (
          <Table
            columns={columns}
            data={allOrders}
            showPagination={false}
            CCN="admin-transaction-table"
          />
        ) : (
          <p>No transactions found</p>
        )}
      </main>
    </div>
  );
};

export default Transaction;
