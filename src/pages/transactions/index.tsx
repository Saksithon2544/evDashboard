// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Demo Components Imports
import TableTransactions, {
  type CallBack,
} from "src/views/tables/TableTransactions";
import AddTransactionDialog from "@/views/dialogs/transaction-dialogs/AddTransactionDialog";
import EditTransactionDialog from "@/views/dialogs/transaction-dialogs/EditTransactionDialog";

import { useQuery } from "react-query";
import {
  Transactions as TransactionData,
  transactions,
} from "@/pages/api/transactions";
import { useState } from "react";
import axios from "@/libs/Axios";
import { Typography } from "@mui/material";

const TransactionsAllTable = () => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionData>();

  const {
    data: TransactionsData,
    isLoading,
    refetch,
  } = useQuery<TransactionData[]>("transactions", async () => {
    const res = await fetch("/api/transactions/");
    const data = await res.json();

    // check data not array
    if (!Array.isArray(data)) {
      return [];
    }

    return transactions;
  });

  function handleCloseMoadal() {
    setSelectedTransaction(undefined);
  }

  function handleTable(data: CallBack) {
    switch (data.action) {
      case "edit":
        // console.log("edit", data.transaction);
        setSelectedTransaction(data.transaction);
        break;
      case "delete":
        // console.log("delete", data.transaction);
        break;
      default:
        break;
    }
  }

  async function handleSave(data: TransactionData) {
    // console.log("save", data);
    try {
      const res = await axios.put(`/transaction`, data);
      const resData = await res.data;

      // console.log("resData", resData);

      refetch();
    } catch (error) {}
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        {/* {JSON.stringify(selectedTransaction)} */}
        <AddTransactionDialog callback={refetch} />
        <EditTransactionDialog
          transaction={selectedTransaction}
          onClose={handleCloseMoadal}
          onSave={handleSave}
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Transaction"
            titleTypographyProps={{ variant: "h6" }}
          />
          {/* <TableTransactions /> */}
          {!isLoading && !(typeof TransactionsData === "object") ? (
            <TableTransactions
              Transactions={TransactionsData}
              callback={handleTable}
            />
          ) : (
            <div>Loading...</div>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default TransactionsAllTable;
