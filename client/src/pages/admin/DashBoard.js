import React , {useState,useEffect} from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import {BarChart , DoughnutChart  } from '../../components/admin/Charts';
import data from '../../assets/data.json'
import Table from '../../components/admin/Table';
import { useSelector,useDispatch } from 'react-redux';
import { fetchDashData } from '../../redux/charts';

const columns = [
  {
    id: "id",
    header: "Id",
    accessorKey: "_id",
    cell: ({ row }) => row.original._id || "N/A",
  },
  {
    id: "quantity",
    header: "Quantity",
    accessorKey: "quantity",
    cell: ({ row }) => row.original.orderItems || "N/A",
  },
  {
    id: "discount",
    header: "Discount",
    accessorKey: "discount",
    cell: ({ row }) => row.original.discount || "N/A",
  },
  {
    id: "amount",
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => row.original.total || "N/A",
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => row.original.status|| "N/A",
  },
];



const DashBoard = () => {

const dispatch = useDispatch();
const { dashData } = useSelector((state) => state.chart);

useEffect(() => {
  dispatch(fetchDashData());
}, [dispatch]);

console.log(dashData)



  return (
    <div className='admin-container'>
      <AdminSidebar />
      <main>   
        <section className='graph-container '>
          <h1>Dashboard</h1>
          <div className="revenue-graph">
            <h2 style={{marginBottom:"2rem" }}>Revenue & Transactions</h2>
            <BarChart 
             data_2={dashData?.chart?.lastSixMonthRevenue}
             data_1={dashData?.chart?.lastSixMonthOrders}
             title_1="Revenue"
             title_2="Transaction"
             bgColor_1="rgb(0, 115, 255)"
             bgColor_2="rgba(53, 162, 235, 0.8)"
             horizontal={false}
             labels={["January", "February", "March", "April", "May", "June", "July"]}
            />
          </div>

          <div className="dashboard-categories">
            <h2 style={{marginBottom:"2rem" }}>Inventory</h2>

            <div className='categories'>
              {data.categories.map((i) => (
                <CategoryItem
                  key={i.heading}
                  value={i.value}
                  heading={i.heading}
                  color={`hsl(${i.value * 4}, ${i.value}%, 50%)`}
                />
              ))}
            </div>
          </div>

        </section>

        <section className="transaction-container mt">
          <div className="gender-chart">
            <h2 style={{marginBottom:"2rem" }}>Gender Ratio</h2>
            <DoughnutChart
              className="gender-doughnut "
              labels={["Female", "Male"]}
              data={[dashData?.userRatio?.female, dashData?.userRatio?.male]}
              backgroundColor={[
                "hsl(340, 82%, 56%)",
                "rgba(53, 162, 235, 0.8)",
              ]}

              cutout={90}
            />
            <p>
            <i className="fa-solid fa-person-half-dress"></i>
            </p>
          </div>
          {dashData?.topTransactions && <Table data={dashData?.topTransactions} columns={columns} heading={"TOP-TRANSACTIONS"} showPagination={false} /> }
             
        </section>

        
      </main>
    </div>
  )
};


const CategoryItem = ({ color, value, heading }) => (
  <div className="category-item">
    <h3 >{heading}</h3>
    <div className='progress '>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
          height: "100%"
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default DashBoard
