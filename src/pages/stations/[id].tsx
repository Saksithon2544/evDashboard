import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "@/libs/Axios";

// MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import TableadminStation from "src/views/tables/TableadminStation";
import TableadCharging from "src/views/tables/TableCharging";
import AddadminStationDialog from "@/views/dialogs/adminstation-dialogs/AddadminStationDialog";

import {
  Admin as AdminData,
  Station as StationData,
  User as UserData,
} from "@/interfaces/Adminstation.interface";

export default function ViewStation() {
  const router = useRouter();
  const { id } = router.query;

  const [setSelectedStation] = useState(null);
  const handleTable = (station: any) => setSelectedStation(station);

  const {
    data: adminsData,
    isLoading: adminsLoading,
    refetch: refetchAdmins,
  } = useQuery<AdminData[]>("admins", async () => {
    const res = await axios.get(`/station/${id}/admins`);
    console.log("admins", res.data);
    return res.data;
  });

  const {
    data: stationsData,
    isLoading: stationsLoading,
    refetch: refetchStations,
  } = useQuery<StationData[]>("stations", async () => {
    const res = await axios.get(`/station`);
    console.log("stations", res.data);
    return res.data;
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery<UserData[]>("users", async () => {
    const res = await axios.get("/super_admin/users");
    console.log("users", res.data);
    return res.data;
  });

  if (adminsLoading || stationsLoading || usersLoading)
    return <div>Loading...</div>;

  // Merge data from adminsData, stationsData, and usersData
  const mergedData = adminsData.map((admin) => {
    const station = stationsData.find((station) => station.id === admin.stationId);
    const user = usersData.find((user) => user.id === admin.userId);
    return {
      ...admin,
      stationName: station?.name,
      userName: user?`${user.firstName} ${user.lastName}`: "",
      email: user? user.email: "",
    };
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <AddadminStationDialog callback={refetchAdmins} />
      </Grid>
      <Grid item xs={12} paddingBottom={12}>
        <Card>
          <CardHeader
            title="Admin Stations"
            titleTypographyProps={{ variant: "h6" }}
          />
          {JSON.stringify(mergedData)}
          <TableadminStation
            data={mergedData}
            callback={handleTable}
            refetch={() => {
              refetchAdmins();
              refetchStations();
              refetchUsers();
            }}
          />
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <AddadminStationDialog callback={refetchAdmins} />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Station Charging Cabinet"
            titleTypographyProps={{ variant: "h6" }}
          />
          {/* <TableadCharging
            data={mergedData}
            callback={handleTable}
            refetch={() => {
              refetchAdmins();
              refetchStations();
              refetchUsers();
            }}
          /> */}
        </Card>
      </Grid>
    </Grid>
  );
}
