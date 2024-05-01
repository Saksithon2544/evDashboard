// ** React Imports
import { ReactNode } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

// ** Icons Imports
import ChevronUp from "mdi-material-ui/ChevronUp";
import ChevronDown from "mdi-material-ui/ChevronDown";
import DotsVertical from "mdi-material-ui/DotsVertical";

// ** Types
import { ThemeColor } from "src/@core/layouts/types";

import axios from "@/libs/Axios";
import {
  Charging as ChargingData,
} from "@/interfaces/Adminstation.interface";
import { useQuery } from "react-query";

interface DataType {
  title: string;
  sales: string;
  trend: ReactNode;
  trendDir: string;
  subtitle: string;
  avatarText: string;
  trendNumber: string;
  avatarColor: ThemeColor;
}

const SalesByCountries = () => {
  const { data: chargingData, isLoading: totalSalesIsLoading, refetch: totalSalesRefetch } = useQuery(
    "chargingData",
    async () => {
      const res1 = (await axios.get("/charging_booth/?limit=1000")).data as ChargingData[];
      const data = res1.map((charging) => {
        return {
          id: charging.booth_id,
          name: charging.booth_name,
          total_charging_rate: charging.charging_rate,
        };
      });
      return data;
    },
    {
      refetchInterval: 60000,
    }
  );

  const data: DataType[] = (chargingData || [])
  .sort((a, b) => b.total_charging_rate - a.total_charging_rate) // เรียงลำดับจากมากไปน้อย
  .slice(0, 5) // ดึงเอาเพียง 5 อันดับแรก
  .map((station: any) => {
    return {
      title: station.name,
      sales: station.total_charging_rate,
      trend: station.total_charging_rate > 0 ? <ChevronUp sx={{ color: "success.main", fontWeight: 600 }} /> : <ChevronDown sx={{ color: "error.main", fontWeight: 600 }} />,
      trendDir: station.total_charging_rate > 0 ? "up" : "down",
      subtitle: station.location,
      avatarText: calculateInitials(station.name),
      trendNumber: `${station.total_charging_rate}%`,
      avatarColor: station.total_charging_rate > 0 ? "success" : "error",
    };
  }) || [];

  function calculateInitials(name) {
    // ถ้าชื่อมีช่องว่าง
    if (name.includes(' ')) {
      const words = name.split(' '); // แยกคำจากชื่อเป็นอาร์เรย์ของคำ
      let initials = '';
    
      for (const word of words) {
        initials += word.charAt(0); // เพิ่มตัวอักษรตัวแรกของคำแต่ละคำเข้าไปใน initials
      }
    
      return initials.toUpperCase(); // แปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด
    } else {
      // ถ้าชื่อไม่มีช่องว่าง ให้เอาตัวอักษรตัวแรกและตัวสุดท้ายมาต่อกันแล้วแปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด
      return name.slice(0, 1).toUpperCase() + name.slice(-1).toUpperCase();
    }
  }
  
  return (
    <Card>
      <CardHeader
        title="Sales by Charging Booths"
        titleTypographyProps={{
          sx: {
            lineHeight: "1.2 !important",
            letterSpacing: "0.31px !important",
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
      <CardContent sx={{ pt: (theme) => `${theme.spacing(2)} !important` }}>
        {data.map((item: DataType, index: number) => {
          return (
            <Box
              key={item.title}
              sx={{
                display: "flex",
                alignItems: "center",
                ...(index !== data.length - 1 ? { mb: 5.875 } : {}),
              }}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  marginRight: 3,
                  fontSize: "1rem",
                  color: "common.white",
                  backgroundColor: `${item.avatarColor}.main`,
                }}
              >
                {item.avatarText}
              </Avatar>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    marginRight: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{ mr: 0.5, fontWeight: 600, letterSpacing: "0.25px" }}
                    >
                      {item.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {item.trend}
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          lineHeight: 1.5,
                          color:
                            item.trendDir === "down"
                              ? "error.main"
                              : "success.main",
                        }}
                      >
                        {item.trendNumber}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ lineHeight: 1.5 }}>
                    {item.subtitle}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    textAlign: "end",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      lineHeight: 1.72,
                      letterSpacing: "0.22px",
                    }}
                  >
                    {item.sales}
                  </Typography>
                  <Typography variant="caption" sx={{ lineHeight: 1.5 }}>
                    kWh
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SalesByCountries;
