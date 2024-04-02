// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Styled Component Import
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";

// ** Demo Components Imports
import Table from "src/views/dashboard/Table";
import Trophy from "src/views/dashboard/Trophy";
import TotalEarning from "src/views/dashboard/TotalEarning";
import StatisticsCard from "src/views/dashboard/StatisticsCard";
// import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import ChargerStatus from "src/views/dashboard/ChargerStatus";
import SalesByCountries from "@/views/dashboard/SalesByChargingBooth";

import { useQuery } from "react-query";
import axios from "@/libs/Axios";
import WeeklyOverview from "@/views/dashboard/WeeklyOverview";

const Dashboard = () => {
  const { data: userRole } = useQuery("userRole", async () => {
    const res = await axios.get("/user/me");
    const data = res.data;
    return data.role;
  });

  console.log(userRole);

  return (
    <ApexChartWrapper>
      {userRole === "superadmin" && (
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Trophy />
          </Grid>
          <Grid item xs={12} md={8}>
            <StatisticsCard />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            {/* <WeeklyOverview /> */}
            <ChargerStatus />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <TotalEarning />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <SalesByCountries />
          </Grid>
          <Grid item xs={12}>
            <Table />
          </Grid>
        </Grid>
      )}
      {userRole === "stationadmin" && (
        <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Trophy />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          {/* <WeeklyOverview /> */}
          <ChargerStatus />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <TotalEarning />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <SalesByCountries />
        </Grid>
        <Grid item xs={12}>
          <Table />
        </Grid>
      </Grid>
      )}
    </ApexChartWrapper>
  );
};

export default Dashboard;
