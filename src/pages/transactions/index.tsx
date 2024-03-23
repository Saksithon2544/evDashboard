// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Demo Components Imports
import TableTransactions, {
  type CallBack,
} from "src/views/tables/TableTransactions";
import AddTransactionDialog from "@/views/dialogs/transaction-dialogs/AddTransactionDialog";

import { useQuery } from "react-query";
import { Transaction as TransactionData } from "@/interfaces/Transaction.interface";
import { User as UserData } from "@/interfaces/User.interface";
import { useState } from "react";
import axios from "@/libs/Axios";
import { Typography } from "@mui/material";

const TransactionsAllTable = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData>();
  const [selectedUser, setSelectedUser] = useState<UserData>();

  const {
    data: TransactionsData,
    isLoading,
    refetch,
  } = useQuery<TransactionData[]>("transactions", async () => {
    const [transactionsRes] = await Promise.all([
      axios.get("/transaction"),
      // axios.get("/super_admin/users"),
    ]);

    const transactionsData = await transactionsRes.data;
    // const userData = await usersRes.data;

    // Check if data is not an array and return empty array
    if (!Array.isArray(transactionsData)) {
      return [];
    }

    return transactionsData;
  });

  function handleCloseMoadal() {
    setSelectedTransaction(undefined);
  }

  function handleTable(data: CallBack) {
    switch (data.action) {
      case "edit":
        // console.log("edit", data.transaction);
        setSelectedTransaction(data.Transaction);
        break;
      case "delete":
        // console.log("delete", data.transaction);
        break;
      default:
        break;
    }
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
            title="Transaction"
            titleTypographyProps={{ variant: "h6" }}
          />
          {/* <TableTransactions /> */}
          {!isLoading && TransactionsData && TransactionsData.length > 0 ? (
            <TableTransactions
              Transactions={TransactionsData}
              callback={handleTable}
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

export default TransactionsAllTable;
