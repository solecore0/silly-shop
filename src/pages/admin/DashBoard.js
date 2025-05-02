import React  from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import {BarChart , DoughnutChart  } from '../../components/admin/Charts';
import data from '../../assets/data.json'
import Table from '../../components/admin/Table';

const columns = [
  {
    id: "id",
    header: "Id",
    accessorKey: "_id",
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
  },
];



const DashBoard = () => {

  const rows = React.useMemo(() => data.transaction, [data.transaction]);





  return (
    <div className='admin-container'>
      <AdminSidebar />
      <main>
        <div className='search-bar'>
          <span><i className='fa-solid fa-search'></i></span>
          <input type="text" placeholder='Search for data,user or stocks'/>
          <span><i className='fa-solid fa-bell'></i></span>
         <span><i className="fa-regular fa-circle-user"></i></span> 
        </div>
        <section className='graph-container'>
          <div className="revenue-graph">
            <h2>Revenue & Transactions</h2>
            <BarChart 
             data_2={[300, 144, 433, 655, 237, 755, 190]}
             data_1={[200, 444, 343, 556, 778, 455, 990]}
             title_1="Revenue"
             title_2="Transaction"
             bgColor_1="rgb(0, 115, 255)"
             bgColor_2="rgba(53, 162, 235, 0.8)"
             horizontal={false}
             labels={["January", "February", "March", "April", "May", "June", "July"]}
            />
          </div>

          <div className="dashboard-categories">
            <h2>Inventory</h2>

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

        <section className="transaction-container">
          <div className="gender-chart">
            <h2>Gender Ratio</h2>
            <DoughnutChart
              className="gender-doughnut"
              labels={["Female", "Male"]}
              data={[12, 19]}
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
             <Table data={rows} columns={columns} heading={"TOP-TRANSACTIONS"} showPagination={false} /> 
        </section>

        
      </main>
    </div>
  )
};


const CategoryItem = ({ color, value, heading }) => (
  <div className="category-item">
    <h3>{heading}</h3>
    <div className='progress '>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default DashBoard
