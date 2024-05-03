// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Demo Components Imports
import TableMember, { type CallBack } from "src/views/tables/TableMember";
import UserDialog from "@/views/dialogs/user-dialogs/UserDialog";
import EditUserDialog from "@/views/dialogs/user-dialogs/EditUserDialog";

import { useQuery } from "react-query";
import { User as UserData } from "@/interfaces/User.interface";
import { useEffect, useState } from "react";
import axios from "@/libs/Axios";
import { Typography } from "@mui/material";
import router from "next/router";

const UsersAllTable = () => {
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/');
    }
  }, []);
  
  const [selectedUser, setSelectedUser] = useState<UserData>();

  const {
    data: Users,
    isLoading,
    refetch,
  } = useQuery<UserData[]>("users", async () => {
    const res = await axios.get("/super_admin/users?limit=1000");
    const data = await res.data;
    const sortedUsers = data.sort((a: UserData, b: UserData) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const latestUsers = sortedUsers.slice(0, 1000); // เลือกข้อมูลเพียง 100 คนล่าสุด 

    return latestUsers;
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
  return (
    <Grid container>
      <Grid item xs={12}>
        {/* {JSON.stringify(selectedUser)} */}
        <UserDialog callback={refetch} />
        <EditUserDialog
          user={selectedUser}
          onClose={handleCloseMoadal}
          onSave={() => refetch()}
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`Member Total ${Users?.length} Person`} titleTypographyProps={{ variant: "h6" }} />
          {isLoading && (
            <Typography variant="h6" align="center">
              Loading...
            </Typography>
          )}
          {!isLoading && <TableMember Users={Users} callback={handleTable} />}
        </Card>
      </Grid>
    </Grid>
  );
};

export default UsersAllTable;
