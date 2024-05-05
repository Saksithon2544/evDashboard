// ** Icon imports
import Login from 'mdi-material-ui/Login'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import AccountGroupOutline from 'mdi-material-ui/AccountGroupOutline'
import { EvStationOutlined } from '@mui/icons-material'
import { HistoryEduOutlined } from '@mui/icons-material'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import Table from 'mdi-material-ui/Table'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useQuery } from 'react-query'
import axios from '@/libs/Axios'

const navigation = (): VerticalNavItemsType => {
  const { data: userRole } = useQuery("userRole", async () => {
    const res = await axios.get("/user/me");
    const data = res.data;
    return data.role;
  });

  const menuItems = [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dashboard',
      visible: userRole === "superadmin"
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings',
      visible: userRole === "superadmin"
    },
    {
      sectionTitle: 'User Management',
      visible: userRole === "superadmin"
    },
    {
      title: 'User',
      icon: AccountGroupOutline,
      path: '/users',
      visible: userRole === "superadmin"
    },
    {
      sectionTitle: 'Station Management',
      visible: userRole === "superadmin"
    },
    {
      title: 'Station',
      icon: EvStationOutlined,
      path: '/stations',
      visible: userRole === "superadmin"
    },
    {
      sectionTitle: 'Transactions Management',
      visible: userRole === "superadmin"
    },
    {
      title: 'Transactions',
      icon: HistoryEduOutlined,
      path: '/transactions',
      visible: userRole === "superadmin"
    },
    {
      sectionTitle: 'Top-up Management',
      visible: userRole === "superadmin"
    },
    {
      title: 'Top-up',
      icon: CreditCardOutline,
      path: '/top-up',
      visible: userRole === "superadmin"
    },
    {
      sectionTitle: 'System usage history',
      visible: userRole === "superadmin"
    },
    {
      title: 'System usage history',
      icon: Table,
      path: '/system-usage-history',
      visible: userRole === "superadmin"
    },

    //////////////////////////////////////////////////

    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dashboard',
      visible: userRole === "stationadmin"
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings',
      visible: userRole === "stationadmin"
    },
    {
      sectionTitle: 'User Management',
      visible: userRole === "stationadmin"
    },
    {
      title: 'User',
      icon: AccountGroupOutline,
      path: '/users/station-admin',
      visible: userRole === "stationadmin"
    },
    {
      sectionTitle: 'Station Management',
      visible: userRole === "stationadmin"
    },
    {
      title: 'Station',
      icon: EvStationOutlined,
      path: '/stations/station-admin',
      visible: userRole === "stationadmin"
    },
    {
      sectionTitle: 'System usage history',
      visible: userRole === "stationadmin"
    },
    {
      title: 'System usage history',
      icon: Table,
      path: '/system-usage-history',
      visible: userRole === "stationadmin"
    },

    //////////////////////////////////////////////////

    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dashboard',
      visible: userRole === "user"
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings',
      visible: userRole === "user"
    },
   
  ];
  

  return menuItems.filter(item => item.visible !== false);
}

export default navigation;
