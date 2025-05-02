import React, { useState } from "react";
import Table from "../components/admin/Table";
import { Link } from "react-router-dom";

const Order = () => {

  const columns = [
    {
      id: "orderId",
      header: "ID",
      accessorKey: "id",
    },
    {
      id: "quantity",
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      id: "discount",
      header: "Discount",
      accessorKey: "discount",
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span className="red">{row.original.status}</span>
      ),
    },
    {
      id: "action",
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => (
        <Link to={`/order/${row.original.id}`}>View</Link>
      ),
    },
  ];
  const [rows] = useState([
    {
      id: "6666asdsad8cafasfe",
      amount: 1000,
      quantity: 1,
      discount: 469,
      status: "Pending",
      action: "View",
    },
  ]);
  const showPagination = false;
  const data = React.useMemo(() => rows, [rows]);
  return (
    <div className="order">
      <h1>My Orders</h1>
      {rows && rows.length > 0 ? (
        <Table
          columns={columns}
          data={data}
          heading={""}
          showPagination={showPagination}
          CCN={"order-table"}
        />
      ) : (
        <p>No Orders</p>
      )}
    </div>
  );
};
export default Order;
