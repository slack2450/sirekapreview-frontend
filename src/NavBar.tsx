import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DoneIcon from '@mui/icons-material/Done';
import { useTranslation } from 'react-i18next';
import { Drawer, FormControl, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, Toolbar, Box, AppBar, Typography, IconButton } from '@mui/material';
import { useState } from 'react';

function NavBarItem({ icon, text, onClick }: { icon: React.ReactNode, text: string, onClick: () => void }) {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  )
}

export default function NavBar({ setAction }: { setAction: (action: 'home' | 'contribute' | 'verified') => void }) {
  const { t, i18n } = useTranslation()

  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <List>
          <NavBarItem icon={<HomeIcon />} text={t('navbar.home')} onClick={() => {
            setOpen(false)
            setAction('home')
          }} />
          <NavBarItem icon={<ThumbUpIcon />} text={t('navbar.contribute')} onClick={() => {
            setOpen(false)
            setAction('contribute')
          }} />
          <NavBarItem icon={<DoneIcon />} text={t('navbar.verified')} onClick={() => {
            setOpen(false)
            setAction('verified')
          }} />
        </List>
      </Drawer>
      <AppBar position="relative">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('navbar.title')}
          </Typography>
          <FormControl>
            <Select
              value={i18n.language.split('-')[0]}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              sx={{
                height: '2.5rem',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent'
                },
                '& .MuiSvgIcon-root': {
                  color: 'white'
                }
              }}
            >
              <MenuItem value="en">{t('languages.english')}</MenuItem>
              <MenuItem value="id">{t('languages.indonesian')}</MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
    </Box>
  );
}