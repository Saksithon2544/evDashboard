// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Demo Components Imports
import TableStation, { type CallBack } from "src/views/tables/TableStation";
import AddStationDialog from "@/views/dialogs/station-dialogs/AddStationDialog";
import EditStationDialog from "@/views/dialogs/station-dialogs/EditStationDialog";

import { useQuery } from "react-query";
import { Station as StationData } from "@/interfaces/Station.interface";
import { useState } from "react";
import axios from "@/libs/Axios";
import { Typography } from "@mui/material";

const StationsAllTable = () => {
  const [selectedStation, setSelectedStation] = useState<StationData>();

  const {
    data: Stations,
    isLoading,
    refetch,
  } = useQuery<StationData[]>("stations", async () => {
    const res = await axios.get(`/station`);
    const data = await res.data;
    const sortedStations = data.sort((a: StationData, b: StationData) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const latestStations = sortedStations.slice(0, 100); // เลือกข้อมูลเพียง 100 คนล่าสุด
    return latestStations;
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
          <CardHeader
            title="Station"
            titleTypographyProps={{ variant: "h6" }}
          />
          
          {!isLoading && Stations && Stations.length > 0 ? (
            <TableStation
              Stations={Stations}
              callback={handleTable}
              refetch={() => refetch()}
            />
          ) : Stations && Stations.length === 0 ? (
            <Typography variant="h6" align="center">
              No Data
            </Typography>
          ) : (
            <Typography variant="h6" align="center">
              Loading...
            </Typography>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default StationsAllTable;
