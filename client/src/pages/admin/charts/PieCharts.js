import React, {useEffect} from 'react'
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

  // Helper function to check if data array has non-zero values
  const hasNonZeroValues = (dataArray) => {
    return Array.isArray(dataArray) && dataArray.some(value => value > 0);
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>

        {/* Order Fulfillment Section */}
        {pieData?.orderFullfillment && hasNonZeroValues([
          pieData.orderFullfillment.processing,
          pieData.orderFullfillment.shipped,
          pieData.orderFullfillment.delivered
        ]) && (
          <section>
            <div>
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
            </div>
            <h2>Order Fulfillment Ratio</h2>
          </section>
        )}

        {/* Product Categories Section */}
        {pieData?.productCategories && pieData.productCategories.some(cat => cat.value > 0) && (
          <section>
            <div>
              <DoughnutChart
                labels={pieData.productCategories.map(cat => cat.name)}
                data={pieData.productCategories.map(cat => cat.value)}
                backgroundColor={data.categories.map(
                  (i) => `hsl(${i.value * 4}, ${i.value}%, 50%)`
                )}
                legends={false}
                offset={[0, 0, 0, 80]}
              />
            </div>
            <h2>Product Categories Ratio</h2>
          </section>
        )}

        {/* Stock Availability Section */}
        {pieData?.stockAvailablity && hasNonZeroValues([
          pieData.stockAvailablity.inStock,
          pieData.stockAvailablity.outOfStock
        ]) && (
          <section>
            <div>
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
            </div>
            <h2>Stock Availability</h2>
          </section>
        )}

        {/* Revenue Distribution Section */}
        {pieData?.revenueDistribution && hasNonZeroValues([
          pieData.revenueDistribution.marketingCost,
          pieData.revenueDistribution.discount,
          pieData.revenueDistribution.burnt,
          pieData.revenueDistribution.productionCost,
          pieData.revenueDistribution.netMargin
        ]) && (
          <section>
            <div>
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
            </div>
            <h2>Revenue Distribution</h2>
          </section>
        )}

        {/* Users Age Group Section */}
        {pieData?.usersAgeGroup && hasNonZeroValues([
          pieData.usersAgeGroup.teen,
          pieData.usersAgeGroup.adult,
          pieData.usersAgeGroup.old
        ]) && (
          <section>
            <div>
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
            </div>
            <h2>Users Age Group</h2>
          </section>
        )}

        {/* Admin Customer Section */}
        {pieData?.adminCustomer && hasNonZeroValues([
          pieData.adminCustomer.admin,
          pieData.adminCustomer.customers
        ]) && (
          <section>
            <div>
              <DoughnutChart
                labels={["Admin", "Customers"]}
                data={[
                  pieData.adminCustomer.admin,
                  pieData.adminCustomer.customers
                ]}
                backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
                offset={[0, 50]}
              />
            </div>
            <h2>User Types</h2>
          </section>
        )}
      </main>
    </div>
  )
}

export default PieCharts
