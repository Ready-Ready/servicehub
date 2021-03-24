import React, {useState} from 'react';
import { useHistory, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../Auth"
import { AppBar,
         Toolbar,
         Typography,
         Button,
         IconButton,
         makeStyles,
         Menu,
         MenuItem,
         Chip
         }
         from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import HomeIcon from '@material-ui/icons/Home';
import CloseIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));
  
export default function NavBar(){
  const location = useLocation();
  const classes = useStyles();

  const history = useHistory();
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/")
    } catch {
      setError("Failed to log out")
    }
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (action) => {
    if(action === 'profile'){
      handleClose();
      history.push('/profile');
    } else if (action === 'logout') {
      handleClose();
      handleLogout();
    } else if (action === 'home') {
      handleClose();
      history.push('/');      
    } else {
      handleClose();
    }
  }
  
  return (

    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon onClick={handleMenuOpen} />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem><HomeIcon onClick={() => handleMenuClick('home')}/></MenuItem>
          <MenuItem onClick={() => handleMenuClick('profile')}>Profile</MenuItem>
          <MenuItem onClick={() => handleMenuClick('logout')}>Logout</MenuItem>
          <MenuItem ><CloseIcon onClick={handleClose}/></MenuItem>
        </Menu>           
        <Typography variant="h6" className={classes.title}>
          Service Provider Hub
        </Typography>

        {currentUser?
          <>
            <Chip label={currentUser.email} variant="outlined" size="small" />
          </>
          :null
        }

        {location.pathname !== '/login' && !currentUser?
          <NavLink to={{pathname: `/signin`}}>Sign in</NavLink>
          :null
        }

      </Toolbar>
    </AppBar>
  )
}