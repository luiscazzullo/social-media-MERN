import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, GridList, GridListTile, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  gridList: {
    width: 500,
    height: 220,
  },
  tileText: {
    textAlign: 'center',
    marginTop: 10
  }
}));

const FollowGrid = ({ people }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={4}>
        {
          people.map((person, index) => (
            <GridListTile style={{ height: 120 }} key={index}>
              <Link to={`/user/${person._id}`}>
                <Avatar src={`/api/users/photo/${person._id}`} className={classes.bigAvatar} />
                <Typography className={classes.tileText}>
                  {person.name}
                </Typography>
              </Link>
            </GridListTile>
          ))
        }
      </GridList>
    </div>
  );
}
 
export default FollowGrid;