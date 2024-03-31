// ** MUI Imports
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { styled, useTheme } from "@mui/material/styles";

import axios from "@/libs/Axios";
import { useQuery } from "react-query";

// Styled component for the triangle shaped background image
const TriangleImg = styled("img")({
  right: 0,
  bottom: 0,
  height: 170,
  position: "absolute",
});

// Styled component for the trophy image
const TrophyImg = styled("img")({
  right: 36,
  bottom: 20,
  height: 98,
  position: "absolute",
});

const Trophy = () => {
  // ** Hook
  const theme = useTheme();

  const imageSrc =
    theme.palette.mode === "light" ? "triangle-light.png" : "triangle-dark.png";

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery("me", async () => {
    const res = await axios.get("/user/me");
    const data = res.data;
    return data;
  });


  return (
    <Card sx={{ position: "relative" }}>
      <CardContent>
        <Typography variant="h6">Congratulations🥳</Typography>
        <Typography variant="body2" sx={{ letterSpacing: "0.25px" }}>
          Best seller of the month
        </Typography>
        <Typography variant="h5" sx={{ my: 4, color: "primary.main" }}>
          $42.8k
        </Typography>
        <Button size="small" variant="contained">
          View Sales
        </Button>
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
