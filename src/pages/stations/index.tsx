import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import TableStation, { CallBack, StationData,ChargingData  } from "src/views/tables/TableStation";
import AddStationDialog from "@/views/dialogs/station-dialogs/AddStationDialog";
import EditStationDialog from "@/views/dialogs/station-dialogs/EditStationDialog";
import { useQuery } from "react-query";
import axios from "@/libs/Axios";
import { Typography } from "@mui/material";
import router from "next/router";

interface StationProps {
  latestStations: StationData[];
  data: StationData[] & ChargingData[]; // Use the ChargingData type
}

const StationsAllTable = () => {
  React.useEffect(() => {
    const role = localStorage.getItem('role');
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken || role !== "superadmin") {
      router.push('/');
    }
  }, []);

  const [selectedStation, setSelectedStation] = useState<StationData>();

  const { data: Stations, isLoading, refetch } = useQuery("stations", async () => {
    const res1 = await (await axios.get(`/station/?limit=1000`)).data as StationData[];
    const res2 = await (await axios.get(`/charging_booth/?limit=1000`)).data as ChargingData[];
    const data = res1.map((station) => {
      return {
        id: station.id,
        name: station.name,
        location: station.location,
        created_at: station.created_at,
        total_charging_booth: res2.filter((charging) => charging.station_id === station.id).length,
        total_charging_rate: res2.filter((charging) => charging.station_id === station.id).reduce((acc, curr) => acc + (curr.charging_rate * 10), 0),
      };
    });
    const sortedStations = data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const latestStations = sortedStations.slice(0, 100);
    return { latestStations, data };
  });

  function handleCloseMoadal() {
    setSelectedStation(undefined);
  }

  function handleTable(data: CallBack) {
    switch (data.action) {
      case "edit":
        setSelectedStation(data.station);
        break;
      case "delete":
        break;
      default:
        break;
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
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
            title={`Station Total ${Stations?.data.length} Station`}
            titleTypographyProps={{ variant: "h6" }}
          />
          {!isLoading && Stations && Stations.data.length > 0 ? (
            <TableStation
              Stations={Stations}
              callback={handleTable}
              refetch={() => refetch()}
            />
          ) : Stations && Stations.data.length === 0 ? (
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
