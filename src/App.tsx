

import { Typography } from '@mui/material';
import NavBar from './NavBar'
import { Trans } from 'react-i18next'
import './index.css'
import { useState } from 'react';
import Home from './Home';
import Contribute from './Contribute';
import Verified from './Verified';
import { Box } from '@mui/system';

function App() {
  const [action, setAction] = useState<'home' | 'contribute' | 'verified'>('home')

  return (
    <>
      <NavBar setAction={setAction} />
      {
        action === 'home' && <Home setAction={setAction} />
      }
      {
        action === 'contribute' && <Contribute/>
      }
      {
        action === 'verified' && <Verified/>
      }
      <Box sx={{mb: 5}}>
      <Typography variant="h2" component="h2" sx={{ textAlign: 'center', mt: 2 }} fontSize={18}>
        <Trans
          i18nKey="footer"
          components={{
            joss: <a href="https://github.com/slack2450"></a>,
            raka: <a href="https://github.com/raka-gunarto"></a>,
          }}
        />
      </Typography>
      </Box>
    </>
  )
}

export default App
