import React, {useState} from 'react';
import { useHistory, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"
import { AppBar,
         Toolbar,
         Typography,
         Button,
         IconButton,
         makeStyles
         }
         from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

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

  return (

    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Resource Hub
        </Typography>

        {currentUser?
          <>
            <span>Welcome {currentUser.email}</span>
            <NavLink to={{pathname: `/profile`}}>Profile</NavLink>
            <Button variant="link" onClick={handleLogout}>Logout</Button>
          </>
          :null
        }
        {/* location.pathname !== '/login' && !currentUser?
          <NavLink to={{pathname: `/login`}}>Login</NavLink>
          :null */
        }

        {location.pathname !== '/login' && !currentUser?
          <NavLink to={{pathname: `/signin`}}>Sign in</NavLink>
          :null
        }

        

      </Toolbar>
    </AppBar>
  )
}