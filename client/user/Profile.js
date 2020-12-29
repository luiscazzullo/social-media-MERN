import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import auth from '../auth/auth-helper';
import { read } from './api-user';
import { listByUser } from '../post/api-post';
import { Redirect, Link } from 'react-router-dom';
import { 
  Avatar, 
  ListItem, 
  ListItemAvatar, 
  ListItemSecondaryAction, 
  ListItemText, 
  Paper, 
  Typography, 
  List, 
  Divider, 
  IconButton } from '@material-ui/core';
import { Edit, Person } from '@material-ui/icons';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  }
}))


const Profile = ({ match }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    user: { following: [], followers: [] },
    redirectToSignin: false,
    following: false
  });
  const [posts, setPosts] = useState([]);
  const jwt = auth.isAuthenticated();
  const { user, following } = values;

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const getUserProfile = async () => {
      try {
        const response = await read({ userId: match.params.userId }, { t: jwt.token }, signal);
        if (response.error) {
          setValues({ ...values, redirectToSignin: true })
        } else {
          const following = checkFollow(response);
          setValues({ ...values, user: response, following })
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUserProfile();
    loadPosts(user);
    return () => {
      abortController.abort();
    }
  }, [match.params.userId]);

  const checkFollow = user => {
    const match = user.followers.some(follower => follower._id == jwt.user._id);
    return match;
  }

  const clickFollowButton = async (callApi) => {
    console.log('El callback de la api', callApi);
    const response = await callApi({ userId: jwt.user._id }, { t: jwt.token }, values.user._id);
    console.log(response);
    if (response.error) {
      setValues({ ...values, error: response.error });
    } else {
      setValues({ ...values, user: response, following: !values.following })
    }
  }

  const loadPosts = async user => {
    console.log('Llega el usuario?', user);
    const response = await listByUser({ userId: user._id }, { t: jwt.token });
    if(response.error) {
      console.log(response.error)
    } else {
      setPosts(response);
    }
  }

  const removePost = post => {
    const updatedPosts = posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  }

  const photoUrl = user?._id ? `/api/users/photo/${user._id}?${new Date().getTime()}` : `/api/users/defaultphoto`;

  if(values.redirectToSignin) {
    return <Redirect to="/signin" />
  }

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Perfil
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={photoUrl} className={classes.bigAvatar} />
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
          {
            auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id
            ? (
            <ListItemSecondaryAction>
              <Link to={`/edit/${user._id}`}>
                <IconButton aria-label="Edit" color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={user._id} />
            </ListItemSecondaryAction>
            )
            : (<FollowProfileButton following={following} onButtonClick={clickFollowButton} />)
          }
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary={user.about} secondary={`Se unió el ${new Date(user.created).toDateString()}`} />
        </ListItem>
      </List>
      <ProfileTabs user={user} posts={posts} removePostUpdate={removePost} />
    </Paper>
  );
}
 
export default Profile;