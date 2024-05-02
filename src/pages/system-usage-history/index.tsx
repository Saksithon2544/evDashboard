// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Demo Components Imports
import TableLog, {
  type CallBack,
} from "src/views/tables/TableLog";

import { useQuery } from "react-query";
import { Log as LogData } from "@/interfaces/Log.interface";
import { User as UserData } from "@/interfaces/User.interface";
import { useState } from "react";
import axios from "@/libs/Axios";
import { Typography } from "@mui/material";

const LogTable = () => {
  const [selectedLog, setSelectedLog] =
    useState<LogData>();
  const [selectedUser, setSelectedUser] = useState<UserData>();

  const {
    data: LogsData,
    isLoading,
    refetch,
  } = useQuery<LogData[]>("Logs", async () => {
    
    const [LogsRes] = await Promise.all([
      axios.get("/log/?limit=1000")
    ]);

    const LogsData = await LogsRes.data;

    // Check if data is not an array and return empty array
    if (!Array.isArray(LogsData)) {
      return [];
    }

    // Sort Logs by created_at from newest to oldest
    const sortedLogs = LogsData.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Select the latest 100 Logs
    const latestLogs = sortedLogs.slice(0, 1000);

    return latestLogs;
  });

  function handleCloseMoadal() {
    setSelectedLog(undefined);
  }


  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={`System Usage History ${LogsData && LogsData.length > 0 ? `(${LogsData.length} tems in total)` : ""} `}
            titleTypographyProps={{ variant: "h6" }}
          />
          {/* <TableLog /> */}
          {!isLoading && LogsData && LogsData.length > 0 ? (
            <TableLog
              Log={LogsData}
              // callback={handleTable}
              refetch={() => refetch()}
            />
          ) : LogsData && LogsData.length === 0 ? (
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

export default LogTable;
