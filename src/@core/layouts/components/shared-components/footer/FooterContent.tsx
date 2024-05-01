// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`Copyright © ${new Date().getFullYear()}, `}
        <Box component='span' sx={{ color: 'error.main' }}>
          {`King Mongkut's University of Technology North Bangkok`}
        </Box>
        {/* {` by `}
        <Link target='_blank' href='https://github.com/Saksithon2544/'>
          Saksithon
        </Link> */}
      </Typography>
    </Box>
  )
}

export default FooterContent
