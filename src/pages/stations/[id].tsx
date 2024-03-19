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

      const res = await Promise.all([res1, res2, res3]);

      const [admins, stations, users] = res;

      const mergedData = stations.find((station) => station.id === id);

      const adminInStation = admins.map((admin) => {
        const adminId = admin.user_id;

        const adminInfo = users.find((user) => user.id === adminId);

        return adminInfo;
      }) as UserData[];

      return {
        ...mergedData,
        adminInStation: adminInStation,
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
        <AddadminStationDialog callback={refetch} />
      </Grid>
      <Grid item xs={12} paddingBottom={12}>
        <Card>
          <CardHeader
            title={`Admin Stations: ${mergedData?.name}`}
            titleTypographyProps={{ variant: "h6" }}
          />
          <TableadminStation
            mergedData={mergedData?.adminInStation}
            stationId={id as string }
            callback={() => {}}
            refetch={() => {
              refetch();
            }}
          />
        </Card>
      </Grid>

      <Grid item xs={12}>
        {/* <AddadminStationDialog callback={refetchAdmins} /> */}
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
