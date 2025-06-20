import React, { useEffect } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { useSelector, useDispatch } from "react-redux";
import { fetchLineData } from "../../../redux/charts";
import { getLastMonths } from "../../../utils/features";

const LineCharts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchLineData());
  }, [dispatch]);

  const data = useSelector((state) => state.chart.lineData);
  console.log(data);

  const { last12Months: months } = getLastMonths();

  return (
    <div>
      <div className="admin-container">
        <AdminSidebar />
        <main className="chart-container">
          <h1>Line Charts</h1>
          <section>
            <LineChart
              data={data?.users}
              label="Users"
              borderColor="rgb(53, 162, 255)"
              labels={months}
              backgroundColor="rgba(53, 162, 255, 0.5)"
            />
            <h2>Active Users</h2>
          </section>

          <section>
            <LineChart
              data={data?.products}
              backgroundColor={"hsla(269,80%,40%,0.4)"}
              borderColor={"hsl(269,80%,40%)"}
              labels={months}
              label="Products"
            />
            <h2>Total Products (SKU)</h2>
          </section>

          <section>
            <LineChart
              data={data?.revenue}
              backgroundColor={"hsla(129,80%,40%,0.4)"}
              borderColor={"hsl(129,80%,40%)"}
              label="Revenue"
              labels={months}
            />
            <h2>Total Revenue </h2>
          </section>

          <section>
            <LineChart
              data={data?.discount}
              backgroundColor={"hsla(29,80%,40%,0.4)"}
              borderColor={"hsl(29,80%,40%)"}
              label="Discount"
              labels={months}
            />
            <h2>Discount Allotted </h2>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LineCharts;
