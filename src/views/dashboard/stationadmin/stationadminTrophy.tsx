import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { styled, useTheme } from "@mui/material/styles";
import axios from "@/libs/Axios"; // Assume this is your axios setup
import { useQuery } from "react-query";
import { Charging as ChargingData } from "@/interfaces/Adminstation.interface";
import { User as UserData } from "@/interfaces/User.interface";

const TriangleImg = styled("img")({
  right: 0,
  bottom: 0,
  height: 170,
  position: "absolute",
});

const TrophyImg = styled("img")({
  right: 36,
  bottom: 20,
  height: 98,
  position: "absolute",
});

// Function to format number to Thai Baht format
function formatToBaht(number) {
  // Check if the number is greater than or equal to 1,000,000
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  }
  // Check if the number is greater than or equal to 1,000
  else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  // Otherwise, return the number as is
  else {
    return number.toString();
  }
}

const Trophy = () => {
  const theme = useTheme();
  const imageSrc =
    theme.palette.mode === "light" ? "triangle-light.png" : "triangle-dark.png";

  const {
    data: totalSales,
    isLoading: totalSalesIsLoading,
    refetch: totalSalesRefetch,
  } = useQuery("totalSales", async () => {
    const res1 = (await axios.get("/charging_booth")).data as ChargingData[];

    const totalSales = res1.reduce(
      (acc, curr) => acc + curr.charging_rate * 10,
      0
    );

    return totalSales;
  }, {
    refetchInterval: 60000, // Refetch every 60 seconds
    });

  const {
    data: user,
    isLoading: userIsLoading,
    refetch: userRefetch,
  } = useQuery<UserData>("userme", async () => {
    const res = await axios.get("/user/me");
    const data = await res.data;

    return data;
  });

  return (
    <Card sx={{ position: "relative" }}>
      <CardContent>
        <Typography variant="h6">
          Congratulation 👏 <br />
          <span style={{ color: "red" }}>
            {user && user.firstName ? user.firstName : "Unknown"}{" "}
            {user && user.lastName ? user.lastName : "Unknown"}
          </span>{" "}
          🥳
        </Typography>
        <Typography variant="body2" sx={{ letterSpacing: "0.25px" }}>
          Total Sales charging booth ⛽️
        </Typography>
        {/* Format total sales to Baht */}
        <Typography variant="h5" sx={{ my: 4, color: "primary.main" }}>
          ฿{totalSales && formatToBaht(totalSales)}
        </Typography>
        <TriangleImg
          alt="triangle background"
          src={`/images/misc/${imageSrc}`}
        />
        <TrophyImg alt="trophy" src="/images/misc/trophy.png" />
      </CardContent>
    </Card>
  );
};

export default Trophy;
