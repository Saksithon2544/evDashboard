// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Demo Components Imports
import TableMember from "src/views/tables/TableMember";
import UserDialog from "@/views/dialogs/UserDialog";

import { useQuery } from "react-query";
import { User as UserData } from "@/pages/api/user";

const MUITable = () => {
  const {
    data: Users,
    isLoading,
    refetch,
  } = useQuery<UserData[]>("users", () => {
    return fetch("/api/user/")
      .then((res) => res.json())
      .then((data: UserData[]) => data);
  });

  return (
    <Grid container>
      <Grid item xs={12}>
        <UserDialog callback={refetch} />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Member" titleTypographyProps={{ variant: "h6" }} />
          {/* <TableNutrition /> */}
          {!isLoading && <TableMember Users={Users} />}
        </Card>
      </Grid>
    </Grid>
  );
};

export default MUITable;
