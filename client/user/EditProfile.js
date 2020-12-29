import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  TextField, 
  Typography,
  Icon,
  Avatar } from '@material-ui/core';
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import { update, read } from './api-user';
import auth from '../auth/auth-helper';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  input: {
    display: 'none'
  },
  filename: {
    marginLeft: '10px'
  }
}))

const EditProfile = ({ match }) => {

  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    email: '',
    about: '',
    password: '',
    error: '',
    photo: '',
    open: false,
    redirectToProfile: false,
    id: ''
  })
  const { name, email, password, error, redirectToProfile, about, photo, id } = values;
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const getUserProfile = async () => {
      try {
        const response = await read({ userId: match.params.userId }, { t: jwt.token }, signal);
        if (response.error) {
          setValues({...values, error: response.error });
          setToRedirectSignin(true)
        } else {
          setValues({ ...values, name: response.name, email: response.email, about: response.about });
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUserProfile();
    return () => {
      abortController.abort();
    }
  }, [match.params.userId]);

  const handleChange = name => event => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value
    setValues({ ...values, [name]: value });
  }

  const clickSubmit = async () => {
    try {
      let userData = new FormData();
      values.name && userData.append('name', values.name);
      values.email && userData.append('email', values.email);
      values.password && userData.append('password', values.password);
      values.about && userData.append('about', values.about);
      values.photo && userData.append('photo', values.photo);
      const response = await update({ userId: match.params.userId }, { t: jwt.token }, userData);
      if (response.error) {
        setValues({ ...values, error: response.error })
      } else {
        setValues({ ...values, id: response._id, redirectToProfile: true })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const photoUrl = id
    ? `/api/users/photo/${id}?${new Date().getTime()}`
    : '/api/users/defaultphoto'

  if(redirectToProfile) {
    return <Redirect to={`/user/${id}`} />
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Editar perfil
        </Typography>
        <Avatar src={photoUrl} className={classes.bigAvatar} />
        <input 
          accept="image/*"
          type="file"
          onChange={handleChange('photo')}
          style={{ display: 'none' }}
          id="icon-button-file"
          className={classes.input}
        />
        <label htmlFor="icon-button-file">
          <Button variant="contained" color="default" component="span">
            Subir foto
            <FileUpload />
          </Button>
        </label>
        <span className={classes.filename}>
          {photo ? photo.name : ''}
        </span><br />
        <TextField
          id="name"
          label="name"
          className={classes.textField}
          value={name}
          onChange={handleChange('name')}
          margin="normal"
        /><br />
        <TextField
          id="email"
          type="email"
          label="Email"
          className={classes.textField}
          value={email}
          onChange={handleChange('email')}
          margin="normal"
        /><br />
        <TextField 
          id="multiline-flexible"
          label="About"
          multiline
          rows="2"
          values={about}
          onChange={handleChange('about')}
          className={classes.textField}
        /><br />
        <TextField
          id="password"
          type="password"
          label="Password"
          className={classes.textField}
          value={password}
          onChange={handleChange('password')}
          margin="normal"
        /><br />
        {
          values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {error}
            </Typography>
          )
        }
      </CardContent>
      <CardActions>
        <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>
          Editar
        </Button>
      </CardActions>
    </Card>
  );
}
 
export default EditProfile;