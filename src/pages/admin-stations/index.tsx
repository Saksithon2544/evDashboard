// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Demo Components Imports
import TableadminStation, { type CallBack } from "src/views/tables/TableadminStation";
import AddStationDialog from "@/views/dialogs/station-dialogs/AddStationDialog";
import EditStationDialog from "@/views/dialogs/station-dialogs/EditStationDialog";

import { useQuery } from "react-query";
import { Station as StationData } from "@/interfaces/Station.interface";
import { useEffect, useState } from "react";
import axios from "@/libs/Axios";
import router from "next/router";

const StationsAllTable = () => {
  const [selectedStation, setSelectedStation] = useState<StationData>();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/');
    }
  }, []);

  const {
    data: Stations,
    isLoading,
    refetch,
  } = useQuery<StationData[]>("stations", async () => {
    const res = await axios.get(`/station`);
    const data = await res.data;
    return data;
  });

  function handleCloseMoadal() {
    setSelectedStation(undefined);
  }

  function handleTable(data: CallBack) {
    switch (data.action) {
      case "edit":
        // console.log("edit", data.station);
        setSelectedStation(data.station);
        break;
      case "delete":
        // console.log("delete", data.station);
        break;
      default:
        break;
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        {/* {JSON.stringify(selectedStation)} */}
        <AddStationDialog callback={refetch} />
        <EditStationDialog
          station={selectedStation}
          onClose={handleCloseMoadal}
          onSave={() => refetch()} 
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Admin Stations" titleTypographyProps={{ variant: "h6" }} />
          {/* <TableNutrition /> */}
          {/* {!isLoading && <TableadminStation Stations={Stations} callback={handleTable} />} */}
        </Card>
      </Grid>
    </Grid>
  );
};

export default StationsAllTable;
