// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Demo Components Imports
import TableMember, { type CallBack } from "src/views/tables/TableMember";
import UserDialog from "@/views/dialogs/UserDialog";
import EditUserDialog from "@/views/dialogs/EditUserDialog";

import { useQuery } from "react-query";
import { User as UserData } from "@/pages/api/user";
import { useState } from "react";
import axios from "@/libs/Axios";

const StationsAllTable = () => {
  const [selectedUser, setSelectedUser] = useState<UserData>();

  const {
    data: Users,
    isLoading,
    refetch,
  } = useQuery<UserData[]>("users", async () => {
    const res = await fetch("/api/user/");
    const data = await res.json();
    return data;
  });

  function handleCloseMoadal() {
    setSelectedUser(undefined);
  }

  function handleTable(data: CallBack) {
    switch (data.action) {
      case "edit":
        // console.log("edit", data.user);
        setSelectedUser(data.user);
        break;
      case "delete":
        // console.log("delete", data.user);
        break;
      default:
        break;
    }
  }

  async function handleSave(data: UserData) {
    // console.log("save", data);
    try {
      const res = await axios.put(`/user`, data);
      const resData = await res.data;

      // console.log("resData", resData);

      refetch();
    } catch (error) {}
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        {/* {JSON.stringify(selectedUser)} */}
        <UserDialog callback={refetch} />
        <EditUserDialog
          user={selectedUser}
          onClose={handleCloseMoadal}
          onSave={handleSave}
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Member" titleTypographyProps={{ variant: "h6" }} />
          {/* <TableNutrition /> */}
          {!isLoading && <TableMember Users={Users} callback={handleTable} />}
        </Card>
      </Grid>
    </Grid>
  );
};

export default StationsAllTable;
