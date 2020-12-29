import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItemAvatar, ListItem, Typography, Paper, Avatar, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { list } from './api-user';
import { ArrowForward, Person } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  }
}))

const Users = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const getUsers = async (signal) => {
      const response = await list(signal);
      if(response.error) {
        console.log(response.error);
      } else {
        setUsers(response);
      }
    }
    getUsers(signal);
    return () => abortController.abort();
  }, [])

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Usuarios
      </Typography>
      <List dense>
        {
          users?.map((user, index) => {
            return (
              <Link to={`/user/${user._id}`} key={index}>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <ArrowForward />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Link>
            )
          })
        }
      </List>
    </Paper>
  );
}
 
export default Users;