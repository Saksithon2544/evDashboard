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
          <CardHeader
            title="Station"
            titleTypographyProps={{ variant: "h6" }}
          />
          {isLoading && (
            <Typography variant="h6" align="center">
              Loading...
            </Typography>
          )}
          {!isLoading && (
            <TableStation
              Stations={Stations}
              callback={handleTable}
              refetch={() => refetch()}
            />
          )}
          {!isLoading ? (
            <Typography variant="h6" align="center">
              No Data
            </Typography>
          ) : null}
        </Card>
      </Grid>
    </Grid>
  );
};

export default StationsAllTable;
