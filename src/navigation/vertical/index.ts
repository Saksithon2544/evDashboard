// ** Icon imports
import Login from 'mdi-material-ui/Login'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import AccountGroupOutline from 'mdi-material-ui/AccountGroupOutline'
import AccountChildOutline from 'mdi-material-ui/AccountChildOutline'
import { EvStationOutlined } from '@mui/icons-material'
import { HistoryEduOutlined } from '@mui/icons-material'

import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'


// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { Logout } from 'mdi-material-ui'

import Swal from 'sweetalert2'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dashboard'
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
    {
      sectionTitle: 'User Management'
    },
    {
      title: 'User',
      icon: AccountGroupOutline,
      path: '/users',
    },
    {
      sectionTitle: 'Station Management'
    },
    {
      title: 'Station',
      icon: EvStationOutlined,
      path: '/stations',
    },
    {
      sectionTitle: 'Transactions Management'
    },
    {
      title: 'Transactions',
      icon: HistoryEduOutlined,
      path: '/transactions',
    },
    {
      sectionTitle: 'Top-up Management'
    },
    {
      title: 'Top-up',
      icon: CreditCardOutline,
      path: '/top-up',
    },
    {
      sectionTitle: 'System usage history'
    },
    {
      title: 'System usage history',
      icon: Table,
      path: '/system-usage-history',
    },
  ]
}

export default navigation
