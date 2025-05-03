import React, { useEffect } from 'react'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import data from "../../../assets/data.json";
import { useSelector, useDispatch } from "react-redux";
import { fetchPieData } from '../../../redux/charts';

const PieCharts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPieData());
  }, [dispatch]);
  const pieData = useSelector((state) => state.chart.pieData);

  // Helper function to check if data array sums to non-zero
  const hasNonZeroSum = (dataArray) => {
    return Array.isArray(dataArray) && dataArray.reduce((sum, value) => sum + value, 0) > 0;
  };

  const NoDataMessage = () => (
    <div style={{ 
      height: '300px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '1.2rem',
      color: '#666'
    }}>
      No Data Available
    </div>
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>

        {/* Order Fulfillment Section */}
        <section>
          <h2>Order Fulfillment Ratio</h2>
          {pieData?.orderFullfillment && hasNonZeroSum([
            pieData.orderFullfillment.processing,
            pieData.orderFullfillment.shipped,
            pieData.orderFullfillment.delivered
          ]) ? (
            <PieChart
              labels={["Processing", "Shipped", "Delivered"]}
              data={[pieData.orderFullfillment.processing, pieData.orderFullfillment.shipped, pieData.orderFullfillment.delivered]}
              backgroundColor={[
                `hsl(110,80%, 80%)`,
                `hsl(110,80%, 50%)`,
                `hsl(110,40%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          ) : <NoDataMessage />}
        </section>

        {/* Product Categories Section */}
        <section>
          <h2>Product Categories Ratio</h2>
          {pieData?.productCategories && hasNonZeroSum(pieData.productCategories.map(cat => cat.value)) ? (
            <DoughnutChart
              labels={pieData.productCategories.map(cat => cat.name)}
              data={pieData.productCategories.map(cat => cat.value)}
              backgroundColor={data.categories.map(
                (i) => `hsl(${i.value * 4}, ${i.value}%, 50%)`
              )}
              legends={false}
              offset={[0, 0, 0, 80]}
            />
          ) : <NoDataMessage />}
        </section>

        {/* Stock Availability Section */}
        <section>
          <h2>Stock Availability</h2>
          {pieData?.stockAvailablity && hasNonZeroSum([
            pieData.stockAvailablity.inStock,
            pieData.stockAvailablity.outOfStock
          ]) ? (
            <DoughnutChart
              labels={["In Stock", "Out Of Stock"]}
              data={[
                pieData.stockAvailablity.inStock,
                pieData.stockAvailablity.outOfStock,
              ]}
              backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
              legends={false}
              offset={[0, 80]}
              cutout={"70%"}
            />
          ) : <NoDataMessage />}
        </section>

        {/* Revenue Distribution Section */}
        <section>
          <h2>Revenue Distribution</h2>
          {pieData?.revenueDistribution && hasNonZeroSum([
            pieData.revenueDistribution.marketingCost,
            pieData.revenueDistribution.discount,
            pieData.revenueDistribution.burnt,
            pieData.revenueDistribution.productionCost,
            pieData.revenueDistribution.netMargin
          ]) ? (
            <DoughnutChart
              labels={[
                "Marketing Cost",
                "Discount",
                "Burnt",
                "Production Cost",
                "Net Margin",
              ]}
              data={[
                pieData.revenueDistribution.marketingCost,
                pieData.revenueDistribution.discount,
                pieData.revenueDistribution.burnt,
                pieData.revenueDistribution.productionCost,
                pieData.revenueDistribution.netMargin,
              ]}
              backgroundColor={[
                "hsl(110,80%,40%)",
                "hsl(19,80%,40%)",
                "hsl(69,80%,40%)",
                "hsl(300,80%,40%)",
                "rgb(53, 162, 255)",
              ]}
              legends={false}
              offset={[20, 30, 20, 30, 80]}
            />
          ) : <NoDataMessage />}
        </section>

        {/* Users Age Group Section */}
        <section>
          <h2>Users Age Group</h2>
          {pieData?.usersAgeGroup && hasNonZeroSum([
            pieData.usersAgeGroup.teen,
            pieData.usersAgeGroup.adult,
            pieData.usersAgeGroup.old
          ]) ? (
            <PieChart
              labels={[
                "Teenager(Below 20)",
                "Adult (20-40)",
                "Older (above 40)",
              ]}
              data={[pieData.usersAgeGroup.teen, pieData.usersAgeGroup.adult, pieData.usersAgeGroup.old]}
              backgroundColor={[
                `hsl(10, ${80}%, 80%)`,
                `hsl(10, ${80}%, 50%)`,
                `hsl(10, ${40}%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          ) : <NoDataMessage />}
        </section>

        {/* Admin Customer Section */}
        <section>
          <h2>User Types</h2>
          {pieData?.adminCustomer && hasNonZeroSum([
            pieData.adminCustomer.admin,
            pieData.adminCustomer.customers
          ]) ? (
            <DoughnutChart
              labels={["Admin", "Customers"]}
              data={[
                pieData.adminCustomer.admin,
                pieData.adminCustomer.customers
              ]}
              backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
              offset={[0, 50]}
            />
          ) : <NoDataMessage />}
        </section>
      </main>
    </div>
  );
};

export default PieCharts;
