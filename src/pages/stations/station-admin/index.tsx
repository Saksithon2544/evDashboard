import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import TableStation, { CallBack, StationData } from "src/views/tables/TableStation";  // ปรับ path ให้ตรง
import AddStationDialog from "@/views/dialogs/station-dialogs/AddStationDialog";  // ปรับ path ให้ตรง
import EditStationDialog from "@/views/dialogs/station-dialogs/EditStationDialog";  // ปรับ path ให้ตรง
import { useQuery } from "react-query";
import axios from "@/libs/Axios";  // ปรับ path ให้ตรง
import { Typography } from "@mui/material";
import router from "next/router";
import Swal from "sweetalert2";

const StationsAllTable = () => {
  const [selectedStation, setSelectedStation] = useState<StationData | undefined>();
  
  // Check for access token on component mount
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/');
    }
  }, []);

  // Fetch data using React Query
  const { data: Stations, isLoading, refetch } = useQuery("stations", async () => {
    try {
      const res = await axios.get("/station/provider/");
      const data: StationData[] = res.data.map(station => ({
        id: station.id,
        name: station.name,
        location: [station.latitude, station.longitude],
        created_at: station.created_at,
        total_charging_booth: station.total_charging_booth,
        total_charging_rate: station.total_charging_rate
      }));

      return { latestStations: data, data };  // ปรับเปลี่ยนตรงนี้
    } catch (error) {
      console.error("Error fetching stations:", error);
      throw new Error("Failed to fetch stations");
    }
  });

  // Dialog handlers
  const handleCloseModal = () => {
    setSelectedStation(undefined);
  };

  const handleTable = (data: CallBack) => {
    switch (data.action) {
      case "edit":
        setSelectedStation(data.station);
        break;
      case "delete":
        handleDeleteStation(data.station);  // เรียกใช้ฟังก์ชัน handleDeleteStation ที่คุณสร้าง
        break;
      default:
        break;
    }
  };

  const handleEditClick = (station: StationData) => {
    setSelectedStation(station);
  };

  const handleDeleteClick = (station: StationData) => {
    handleDeleteStation(station);  // เรียกใช้ฟังก์ชัน handleDeleteStation ที่คุณสร้าง
  };

  const handleDeleteStation = async (station: StationData) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Are you sure?",
        html:
          `Do you want to remove <span style='color:red;'>${station.name}</span> from the system?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        cancelButtonColor: "red",
      });

      if (confirmationResult.isConfirmed) {
        await axios.delete(`/station/${station.id}`);
        refetch && refetch();

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Station has been deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting station:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting station.",
      });
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <AddStationDialog callback={refetch} />
        <EditStationDialog
          station={selectedStation}
          onClose={handleCloseModal}
          onSave={() => refetch()}
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={`Station Total ${Stations?.data.length ?? 0} Station`}
            titleTypographyProps={{ variant: "h6" }}
          />
          {!isLoading && Stations && Stations.data.length > 0 ? (
            <TableStation
              Stations={Stations}
              callback={handleTable}
              refetch={() => refetch()}
            />
          ) : (
            <Typography variant="body1" align="center">
              No data available
            </Typography>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default StationsAllTable;
