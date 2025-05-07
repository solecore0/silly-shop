import React, { useEffect, useCallback } from "react";
import Table from "../components/admin/Table";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/order";
import Loader from "../components/Loader";

const Order = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { orders, status } = useSelector((state) => state.order);

  const fetchOrders = useCallback(async () => {
    await dispatch(fetchMyOrders());
  }, [dispatch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchOrders();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchOrders]);

  const columns = [
    {
      id: "orderId",
      header: "ID",
      accessorKey: "_id",
    },
    {
      id: "quantity",
      header: "Quantity",
      accessorKey: "orderItems",
      cell: ({ row }) => {
        const items = row.original.orderItems;
        return items
          ? items.reduce((total, item) => total + item.quantity, 0)
          : 0;
      },
    },
    {
      id: "discount",
      header: "Discount",
      accessorKey: "discount",
      cell: ({ row }) => `$${row.original.discount || 0}`,
    },
    {
      id: "total",
      header: "Total",
      accessorKey: "total",
      cell: ({ row }) => `$${row.original.total || 0}`,
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
        return orderId ? <Link to={`/order/${orderId}`}>View</Link> : null;
      },
    },
  ];

  if (status === "loading") return <Loader />;

  return (
    <div className="order">
      <h1>My Orders</h1>
      {orders && orders.length > 0 ? (
        <Table
          columns={columns}
          data={orders}
          heading=""
          showPagination={false}
          CCN="order-table"
        />
      ) : (
        <p>No Orders</p>
      )}
    </div>
  );
};

export default Order;
