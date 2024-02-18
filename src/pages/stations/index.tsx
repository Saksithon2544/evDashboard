// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Demo Components Imports
import TableStation, { type CallBack } from "src/views/tables/TableStation";
import AddStationDialog from "@/views/dialogs/station-dialogs/AddStationDialog";
import EditStationDialog from "@/views/dialogs/station-dialogs/EditStationDialog";

import { useQuery } from "react-query";
import { Station as StationData } from "@/pages/api/stations";
import { useState } from "react";
import axios from "@/libs/Axios";

const StationsAllTable = () => {
  const [selectedStation, setSelectedStation] = useState<StationData>();

  const {
    data: Stations,
    isLoading,
    refetch,
  } = useQuery<StationData[]>("stations", async () => {
    const res = await fetch("/api/station/");
    const data = await res.json();
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

  async function handleSave(data: StationData) {
    // console.log("save", data);
    try {
      const res = await axios.put(`/station`, data);
      const resData = await res.data;

      // console.log("resData", resData);

      refetch();
    } catch (error) {}
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        {/* {JSON.stringify(selectedStation)} */}
        <AddStationDialog callback={refetch} />
        <EditStationDialog
          station={selectedStation}
          onClose={handleCloseMoadal}
          onSave={handleSave} 
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Station" titleTypographyProps={{ variant: "h6" }} />
          {/* <TableNutrition /> */}
          {!isLoading && <TableStation Stations={Stations} callback={handleTable} />}
        </Card>
      </Grid>
    </Grid>
  );
};

export default StationsAllTable;
