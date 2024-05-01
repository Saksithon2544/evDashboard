// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Demo Components Imports
import TableLog, {
  type CallBack,
} from "src/views/tables/TableLog";
import AddTransactionDialog from "@/views/dialogs/transaction-dialogs/AddTransactionDialog";

import { useQuery } from "react-query";
import { Transaction as TransactionData } from "@/interfaces/Transaction.interface";
import { User as UserData } from "@/interfaces/User.interface";
import { useState } from "react";
import axios from "@/libs/Axios";
import { Typography } from "@mui/material";

const LogTable = () => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionData>();
  const [selectedUser, setSelectedUser] = useState<UserData>();

  const {
    data: TransactionsData,
    isLoading,
    refetch,
  } = useQuery<TransactionData[]>("transactions", async () => {
    
    const [transactionsRes] = await Promise.all([
      axios.get("/log/")
    ]);

    const transactionsData = await transactionsRes.data;

    // Check if data is not an array and return empty array
    if (!Array.isArray(transactionsData)) {
      return [];
    }

    // Sort transactions by created_at from newest to oldest
    const sortedTransactions = transactionsData.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Select the latest 100 transactions
    const latestTransactions = sortedTransactions.slice(0, 100);

    return latestTransactions;
  });

  function handleCloseMoadal() {
    setSelectedTransaction(undefined);
  }


  return (
    <Grid container>
      <Grid item xs={12}>
        {/* {JSON.stringify(selectedTransaction)} */}
        <AddTransactionDialog callback={refetch} />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Top-up"
            titleTypographyProps={{ variant: "h6" }}
          />
          {/* <TableLog /> */}
          {!isLoading && TransactionsData && TransactionsData.length > 0 ? (
            <TableLog
              Topups={TransactionsData}
              // callback={handleTable}
              refetch={() => refetch()}
            />
          ) : TransactionsData && TransactionsData.length === 0 ? (
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
