// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Styled Component Import
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";

// ** Components Superadmin Imports
import Table from "@/views/dashboard/superadmin/Table";
import Trophy from "@/views/dashboard/superadmin/Trophy";
import TotalEarning from "@/views/dashboard/superadmin/TotalEarning";
import StatisticsCard from "@/views/dashboard/superadmin/StatisticsCard";
import WeeklyOverview from '@/views/dashboard/superadmin/WeeklyOverview'
import ChargerStatus from "@/views/dashboard/superadmin/ChargerStatus";
import SalesByCountries from "@/views/dashboard/superadmin/SalesByChargingBooth";

// ** Components Stationadmin Imports
import StationadminTable from "@/views/dashboard/stationadmin/stationadminTable";
import StationadminTrophy from "@/views/dashboard/stationadmin/stationadminTrophy";
import StationadminTotalEarning from "@/views/dashboard/stationadmin/stationadminTotalEarning";
import StationadminStatisticsCard from "@/views/dashboard/stationadmin/stationadminStatisticsCard";
import StationadminWeeklyOverview from '@/views/dashboard/stationadmin/stationadminWeeklyOverview'
import StationadminChargerStatus from "@/views/dashboard/stationadmin/stationadminChargerStatus";
import StationadminSalesByCountries from "@/views/dashboard/stationadmin/stationadminSalesByChargingBooth";


import { useQuery } from "react-query";
import axios from "@/libs/Axios";

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
          <StationadminTrophy />
        </Grid>
        <Grid item xs={12} md={8}>
          <StationadminStatisticsCard />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <StationadminChargerStatus />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <StationadminTotalEarning />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <StationadminSalesByCountries />
        </Grid>
        <Grid item xs={12}>
          <StationadminTable />
        </Grid>
      </Grid>
      )}
    </ApexChartWrapper>
  );
};

export default Dashboard;
