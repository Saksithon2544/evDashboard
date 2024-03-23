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
import AddadminChargingDialog from "@/views/dialogs/charging-dialogs/AddadminChargingDialog";

import {
  Admin as AdminData,
  Station as StationData,
  User as UserData,
  Charging as ChargingData,
} from "@/interfaces/Adminstation.interface";
import { Typography } from "@mui/material";

export default function ViewStation() {
  const router = useRouter();
  const { id } = router.query;

  const [setSelectedStation] = useState(null);
  const handleTable = (station: any) => setSelectedStation(station);

  // const {
  //   data: adminsData,
  //   isLoading: adminsLoading,
  //   refetch: refetchAdmins,
  // } = useQuery<AdminData[]>("admins", async () => {
  //   const res = await axios.get(`/station/${id}/admins`);
  //   console.log("admins", res.data);
  //   return res.data;
  // });

  // const {
  //   data: stationsData,
  //   isLoading: stationsLoading,
  //   refetch: refetchStations,
  // } = useQuery<StationData[]>("stations", async () => {
  //   const res = await axios.get(`/station`);
  //   console.log("stations", res.data);
  //   return res.data;
  // });

  // const {
  //   data: usersData,
  //   isLoading: usersLoading,
  //   refetch: refetchUsers,
  // } = useQuery<UserData[]>("users", async () => {
  //   const res = await axios.get("/super_admin/users");
  //   console.log("users", res.data);
  //   return res.data;
  // });

  const {
    data: mergedData,
    isFetching,
    refetch,
  } = useQuery(
    ["station", id],
    async () => {
      const res1 = (await axios.get(`/station/${id}/admins`))
        .data as AdminData[];
      const res2 = (await axios.get(`/station`)).data as StationData[];
      const res3 = (await axios.get("/super_admin/users")).data as UserData[];
      const res4 = (await axios.get(`/charging_booth/${id}`))
        .data as ChargingData[];

      const res = await Promise.all([res1, res2, res3, res4]);

      const [admins, stations, users, chargings] = res;

      const mergedData = stations.find((station) => station.id === id);

      const chargingBooth = chargings.map((charging) => {
        const chargingId = charging.booth_id;

        const chargingInfo = charging;

        return chargingInfo;
      }) as ChargingData[];

      const adminInStation = admins.map((admin) => {
        const adminId = admin.user_id;

        const adminInfo = users.find((user) => user.id === adminId);

        return adminInfo;
      }) as UserData[];

      console.log("mergedData", chargingBooth);

      return {
        ...mergedData,
        adminInStation: adminInStation,
        chargingBooth: chargingBooth,
      };
    },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  if (isFetching) return <div>Loading...</div>;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <AddadminStationDialog stationId={id as string} callback={refetch} />
      </Grid>
      <Grid item xs={12} paddingBottom={12}>
        <Card>
          <CardHeader
            title={`Admin Stations (⛽️ ${mergedData?.name})`}
            titleTypographyProps={{ variant: "h6" }}
          />
          <TableadminStation
            mergedData={mergedData?.adminInStation}
            stationId={id as string}
            callback={() => {}}
            refetch={() => {
              refetch();
            }}
          />
        </Card>
      </Grid>

      <Grid item xs={12}>
        <AddadminChargingDialog stationId={id as string} callback={refetch} />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Charging Cabinet"
            titleTypographyProps={{ variant: "h6" }}
          />
          {isFetching && (
            <Typography variant="h6" align="center">
              Loading...
            </Typography>
          )}
          {!isFetching && (
            <TableadCharging
              mergedData={mergedData?.chargingBooth}
              // stationId={id as string}
              callback={() => {}}
              refetch={() => {
                refetch();
              }}
            />
          )}
          {!isFetching ? (
            <Typography variant="h6" align="center">
              No Data
            </Typography>
          ) : null}
        </Card>
      </Grid>
    </Grid>
  );
}
