import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardActions, CardContent, Icon, TextField, Typography } from '@material-ui/core';
import auth from './auth-helper';
import { signin } from './api-auth';
import { Redirect } from 'react-router-dom';

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

const Signin = ({ location }) => {

  const classes = useStyles();
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false
  });

  const { email, password, error, redirectToReferrer } = values;

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  }

  const handleSubmit = async () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    }
    try {
      const response = await signin(user);
      if(response.error) {
        setValues({ ...values, error: response.error })
      } else {
        auth.authenticate(response, () => {
          setValues({ ...values, error: '', redirectToReferrer: true })
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const { from } = location.state || {
    from: {
      pathname: '/'
    }
  }

  if(redirectToReferrer) {
    return <Redirect to={from} />
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
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
            id="password"
            type="password"
            label="Password"
            className={classes.textField}
            value={password}
            onChange={handleChange('password')}
            margin="normal"
          /><br />
          {
            error && (
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
          <Button color="primary" variant="contained" onClick={handleSubmit} className={classes.submit}>
            Ingresar
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
 
export default Signin;