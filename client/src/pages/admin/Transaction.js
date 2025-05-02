import React, { useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Table from '../../components/admin/Table'
import { Link } from 'react-router-dom'

const Transaction = () => {

  const [rows] = useState([
    {
      user: "Charas",
      amount: 4500,
      discount: 400,
      status: <span className="red">Processing</span>,
      quantity: 3,
      action: <Link to="/admin/transaction/sajknaskd">Manage</Link>,
    },
  
    {
      user: "Xavirors",
      amount: 6999,
      discount: 400,
      status: <span className="green">Shipped</span>,
      quantity: 6,
      action: <Link to="/admin/transaction/sajknaskd">Manage</Link>,
    },
    {
      user: "Xavirors",
      amount: 6999,
      discount: 400,
      status: <span className="purple">Delivered</span>,
      quantity: 6,
      action: <Link to="/admin/transaction/sajknaskd">Manage</Link>,
    },
  ]);
  
  const columns = [
    {
      id: "user",
      header: "Avatar",
      accessorKey: "user",
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
    },
    {
      id: "discount",
      header: "Discount",
      accessorKey: "discount",
    },
    {
      id: "quantity",
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => getValue(),
    },
    {
      id: "action",
      header: "Action",
      accessorKey: "action",
      cell: ({ getValue }) => getValue(),
    },
  ];


  const data = React.useMemo(() => rows, [rows]);
  const showPagination = false;
  

  return (
    <div className="admin-container ">
    <AdminSidebar />
    <main>
      <div>
        <h3>PRODUCTS</h3>
      </div>
      {data.length > 0 ?  <Table columns={columns} data={data}  showPagination={showPagination} CCN={"admin-transaction-table"}/> : <h1>No Data</h1>}
    </main>
  </div>
  )
}

export default Transaction
