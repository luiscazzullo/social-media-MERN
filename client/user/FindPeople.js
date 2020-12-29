import React, { useState, useEffect} from 'react';
import { Avatar, Snackbar, Paper, Button, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { findPeople, follow } from './api-user';
import auth from '../auth/auth-helper';
import ViewIcon from '@material-ui/icons/Visibility';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: 0
  }),
  title: {
    margin: `${theme.spacing(3)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  avatar: {
    marginRight: theme.spacing(1)
  },
  follow: {
    right: theme.spacing(2)
  },
  snack: {
    color: theme.palette.protectedTitle
  },
  viewButton: {
    verticalAlign: 'middle'
  }
}))

const FindPeople = () => {
  const classes = useStyles();
  const [values, setValues] = useState({ 
    users: [], 
    open: false, 
    followMessage: '' 
  });
  const jwt = auth.isAuthenticated();
  
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const getPeople = async () => {
      const response = await findPeople({ userId: jwt.user._id}, { t: jwt.token}, signal);
      if(response && response.error) {
        console.log(response.error);
      } else {
        setValues({ ...values, users: response});
      }
    }
    getPeople();
    return function cleanup() {
      abortController.abort();
    }
  }, []);

  const clickFollow = async (user, index) => {
    const response = await({ userId: jwt.user._id}, { t: jwt.token },user._id);
    if(response.error) {
      console.log(response.error);
    } else {
      let toFollow = values.users;
      toFollow.splice(index, 1);
      setValues({
        ...values,
        users: toFollow,
        open: true,
        followMessage: `Siguiendo a ${user.name}`
      })
    }
  }

  const handleRequestClose = (e, reason) => {
    setValues({ ...values, open: false })
  }

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          A quién seguir
        </Typography>
        <List>
          {values.users.map((item, index) => {
            <span key={index}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={`/api/users/photo/${item._id}`} />
                </ListItemAvatar>
                <ListItemText primary={item.name} />
                <ListItemSecondaryAction className={classes.follow}>
                  <Link to={`/user/${item._id}`}>
                    <IconButton variant="contained" color="secondary" className={classes.viewButton}>
                      <ViewIcon />
                    </IconButton>
                  </Link>
                  <Button variant="contained" color="primary" onClick={() => clickFollow(item, index)}>
                    Follow
              </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </span>
          })}
        </List>
      </Paper>
      <Snackbar 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        open={values.open}
        onClose={handleRequestClose}
        autoHideDuration={6000}
        message={<span className={classes.snack}>{values.followMessage}</span>}
      />
    </div>
  );
}
 
export default FindPeople;