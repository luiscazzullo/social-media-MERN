import React , { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import unicornBike from '../assets/images/unicornbike.jpg';
import NewsFeed from '../post/NewsFeed';
import auth from '../auth/auth-helper';
import { Grid } from '@material-ui/core';
import FindPeople from '../user/FindPeople';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5)
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 400
  },
  credit: {
    padding: 10,
    textAlign: 'right',
    backgroundColor: '#ededed',
    borderBottom: '1px solid #d0d0d0',
    '& a': {
      color: '#3f4771'
    }
  }
}))

const Home = ({ history }) => {
  const classes = useStyles();
  const [defaultPage, setDefaultPage] = useState(false);

  useEffect(() => {
    setDefaultPage(auth.isAuthenticated());
    const unlisten = history.listen(() => {
      setDefaultPage(auth.isAuthenticated())
    })
    return () => {
      unlisten();
    }
  }, [])

  return (
    <div className={classes.root}>
      {
        !defaultPage &&
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <Typography variant="h6" className={classes.title}>
                Home Page
              </Typography>
              <CardMedia className={classes.media} image={unicornBike} title="Unicorn bike" />
              <Typography variant="body2" component="p" className={classes.credit} color="textSecondary">
                Algún texto
              </Typography>
              <CardContent>
                <Typography type="body1" component="p">
                  Welcome to the MERN Social home page.
                  </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      }
      {
        defaultPage &&
        <Grid container spacing={8}>
          <Grid item xs={8} sm={7}>
            <NewsFeed />
          </Grid>
          <Grid item xs={6} sm={5}>
            <FindPeople />
          </Grid>
        </Grid>
      }
    </div>
  );
}
 
export default Home;