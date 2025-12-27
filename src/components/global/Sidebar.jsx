import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GavelIcon from '@mui/icons-material/Gavel';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Tables', icon: <TableChartIcon />, path: '/tables' },
  { text: 'Billing', icon: <ReceiptIcon />, path: '/billing' },
  { text: 'RTL', icon: <GavelIcon />, path: '/rtl' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  { text: 'Sign In', icon: <LoginIcon />, path: '/signin' },
  { text: 'Sign Up', icon: <PersonAddIcon />, path: '/signup' },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <Box sx={{
      width: 280,
      bgcolor: '#39393f',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: 3,
      p: 2,
      m: 2
    }}>
      <Box>
        <Box sx={{ mb: 2, fontWeight: 'bold', fontSize: 18 }}>
          <span role="img" aria-label="logo">🧑‍💻</span> Citizen Dashboard 
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: location.pathname === item.path ? '#3b94ee' : 'transparent',
                color: location.pathname === item.path ? 'white' : 'grey.300',
                '&:hover': {
                  bgcolor: location.pathname === item.path ? '#3b94ee' : 'primary.light',
                  color: 'white',
                },
                textDecoration: 'none',
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'grey.400' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Button variant="contained" color="primary" sx={{ borderRadius: 2 }}>
        UPGRADE TO PRO
      </Button>
    </Box>
  );
}
