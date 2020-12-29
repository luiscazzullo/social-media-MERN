import React from 'react';
import { withRouter } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';
import auth from '../auth/auth-helper';

const isActive = (history, path) => {
  if(history.location.pathname === path) {
    return {
      color: '#ff4081'
    }
  } else {
    return {
      color: '#ffffff'
    }
  }
}

const Menu = withRouter(({ history}) => (
  <AppBar>
    <Toolbar>
      <Typography variant="h6" color="inherit" >
        MERN Skeleton
      </Typography>
      <Link to="/">
        <IconButton aria-label="Home" style={isActive(history, '/')}>
          <HomeIcon />
        </IconButton>
      </Link>
      <Link to="/users">
        <Button style={isActive(history, '/users')}>
          Usuarios
        </Button>
      </Link>
      {
        !auth.isAuthenticated() && (
          <span>
            <Link to="/signup">
              <Button style={isActive(history, '/signup')}>
                Registrarse
              </Button>
            </Link>
            <Link to="/signin">
              <Button style={isActive(history, '/signin')}>
                Login
              </Button>
            </Link>
          </span>
        )
      }
      {
        auth.isAuthenticated() && (
          <span>
            <Link to={`/user/${auth.isAuthenticated().user?._id}`}>
              <Button style={isActive(history, `/user/${auth.isAuthenticated().user?._id}`)}>
                Mi perfil
              </Button>
            </Link>
            <Button color="inherit" onClick={() => auth.clearJWT(() => history.push('/'))}>
              Cerrar sesión
            </Button>
          </span>
        )
      }
    </Toolbar>
  </AppBar>
));
 
export default Menu;