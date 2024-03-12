import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "@/libs/Axios";

// MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import TableadminStation from "src/views/tables/TableadminStation";
import AddadminStationDialog from "@/views/dialogs/adminstation-dialogs/AddadminStationDialog";
import EditadminStationDialog from "@/views/dialogs/adminstation-dialogs/EditadminStationDialog";

import { Admin as AdminData , Station as StationData, User as UserData} from "@/interfaces/Adminstation.interface";

export default function ViewStation() {
  const router = useRouter();
  const { id } = router.query;

  const [selectedStation, setSelectedStation] = useState(null);
  const handleCloseModal = () => setSelectedStation(null);
  const handleTable = (station: any) => setSelectedStation(station);

  const {
    data: adminsData,
    isLoading: adminsLoading,
    refetch: refetchAdmins,
  } = useQuery<AdminData[]>("admins", async () => {
    const res = await axios.get(`/stations/${id}/admins`);
    return res.data;
  });

  const {
    data: stationsData,
    isLoading: stationsLoading,
    refetch: refetchStations,
  } = useQuery<StationData[]>("stations", async () => {
    const res = await axios.get(`/stations`);
    return res.data;
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
    } = useQuery<UserData[]>("users", async () => {
    const res = await axios.get("/users");
    return res.data;
  });

  if (adminsLoading || stationsLoading || usersLoading) return <div>Loading...</div>;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <AddadminStationDialog callback={refetchAdmins} />
        <EditadminStationDialog
          station={selectedStation}
          onClose={handleCloseModal}
          onSave={() => {
            refetchAdmins();
            refetchStations();
            refetchUsers();
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Admin Stations"
            titleTypographyProps={{ variant: "h6" }}
          />
          <TableadminStation
            Stations={stationsData.filter(station => station.id === id)}
            Admins={adminsData.filter(admin => admin.userId === id)}
            Users={usersData}
            callback={handleTable}
            refetch={() => {
              refetchAdmins();
              refetchStations();
              refetchUsers();
            }}
          />
        </Card>
      </Grid>
    </Grid>
  );
}