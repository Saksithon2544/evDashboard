// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Demo Components Imports
import TableMember, { type CallBack } from "src/views/tables/TableMember";
import UserDialog from "@/views/dialogs/user-dialogs/UserDialog";
import EditUserDialog from "@/views/dialogs/user-dialogs/EditUserDialog";

import { useQuery } from "react-query";
import { User as UserData } from "@/pages/api/user";
import { useState } from "react";
import axios from "@/libs/Axios";

const UsersAllTable = () => {
  const [selectedUser, setSelectedUser] = useState<UserData>();

  const {
    data: Users,
    isLoading,
    refetch,
  } = useQuery<UserData[]>("users", async () => {
    const res = await axios.get("/users");
    const data = await res.data;

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

  async function handleUpdate(data: UserData) {
    // console.log("save", data);
    try {
      await axios.put(`/users`, {
        ...data,
        confirmPassword: data.password, // TODO: remove this line
      });

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
          onSave={handleUpdate}
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

export default UsersAllTable;
