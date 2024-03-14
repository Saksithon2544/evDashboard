import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

// Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";

// Third Party Imports
import { ApexOptions } from "apexcharts";

// Custom Components Imports
import ReactApexcharts from "src/@core/components/react-apexcharts";

const ChargerStatus = () => {
  // Hook
  const theme = useTheme();

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: undefined,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              color: undefined,
              offsetY: 16,
              formatter: (val: any) => {
                return val;
              },
            },
            total: {
              show: true,
              label: "Total",
              color: theme.palette.text.primary,
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              formatter: (w: any) => {
                return w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },
    colors: [
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.primary.main,
    ],
    labels: [
      "Online",
      "Offline",
      "Charging",
    ],
  };

  return (
    <Card>
      <CardHeader
        title="Charger Status"
        titleTypographyProps={{
          sx: {
            lineHeight: "5rem !important",
            letterSpacing: "0.15px !important",
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="settings"
            className="card-more-options"
            sx={{ color: "text.secondary" }}
          >
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent>
        <ReactApexcharts
          type="donut"
          height={205}
          options={options}
          series={[30, 5, 15,]}
        />
        <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
          <Typography variant="h5" sx={{ mr: 4 }}>
            30%
          </Typography>
          <Typography variant="body2">
            Chargers are currently available
          </Typography>
        </Box>
        <Button fullWidth variant="contained" color="primary">
          View Chargers
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChargerStatus;
