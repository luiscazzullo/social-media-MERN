import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardActions, CardContent, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, Icon, TextField, Typography } from '@material-ui/core';
import { create } from './api-user';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  }
}))


const Signup = () => {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    open: false,
    error: ''
  })

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined
    }
    try {
      const response = await create(user);
      if(response.error) {
        setValues({ ...values, error: response.error })
      } else {
        setValues({ ...values, error: '', open: true })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Dialog open={values.open} disableBackdropClick={true}>
        <DialogTitle>Nueva cuenta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Nueva cuenta creada
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color="primary" autoFocus="autoFocus" variant="contained">
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Registro
          </Typography>
          <TextField 
            id="name" 
            label="name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
          /><br />
          <TextField 
            id="email"
            type="email"
            label="Email"
            className={classes.textField}
            value={values.email}
            onChange={handleChange('email')}
            margin="normal"
          /><br />
          <TextField 
            id="password"
            type="password"
            label="Password"
            className={classes.textField}
            value={values.password}
            onChange={handleChange('password')}
            margin="normal"
          /><br />
          {
            values.error && (
              <Typography component="p" color="error">
                <Icon color="error" className={classes.error}>
                  error
                </Icon>
                {values.error}
              </Typography>
            )
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={handleSubmit} className={classes.submit}>
            Registrar
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
 
export default Signup;