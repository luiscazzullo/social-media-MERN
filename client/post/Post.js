import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import auth from '../auth/auth-helper';
import { Link } from 'react-router-dom';
import { remove, like, unlike } from './api-post';
import { 
  CardHeader, 
  Avatar, 
  IconButton, 
  Card, 
  CardContent, 
  Typography, 
  CardActions,
  Divider } from '@material-ui/core';
import Comments from './Comments';
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import CommentIcon from '@material-ui/icons/Comment'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(0, 0, 0, 0.06)'
  },
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing(2)}px 0px`
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  text: {
    margin: theme.spacing(2)
  },
  photo: {
    textAlign: 'center',
    backgroundColor: '#f2f5f4',
    padding: theme.spacing(1)
  },
  media: {
    height: 200
  },
  button: {
    margin: theme.spacing(1),
  }
}))

const Post = ({ post, onRemove }) => {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const checkLike = (likes) => {
    const match = likes.indexOf(jwt.user._id) !== -1;
    return match
  }
  const [values, setValues] = useState({
    like: checkLike(post.likes),
    likes: post.likes.length,
    comments: post.comments,
  })

  const clickLike = async () => {
    const callApi = values.like ? unlike : like;
    const response = await callApi({ userId: jwt.user._id }, { t: jwt.token }, post._id);
    if(response.error) {
      console.log(response.error);
    } else {
      setValues({ ...values, like: !values.like, likes: response.likes.length });
    }
  }

  const deletePost = async () => {
    const response = await remove({ postId: post._id }, { t: jwt.token });
    if(response.error) {
      console.log(response.error);
    } else {
      onRemove(post);
    }
  }


  const updateComments = comments => {
    setValues({ ...values, comments })
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar src={`/api/users/photo/${post.postedBy._id}`} />}
        action={post.postedBy._id === auth.isAuthenticated().user._id &&
          <IconButton onClick={deletePost}>
            <DeleteIcon />
          </IconButton>
        }
        title={<Link to={`/user/${post.postedBy._id}`}>{post.postedBy.name}</Link>}
        subheader={(new Date(post.created)).toDateString()}
        className={classes.cardHeader}
      />
      <CardContent className={classes.cardContent}>
        <Typography component="p" className={classes.text}>
          {post.text}
        </Typography>
        {
          post.photo &&
          (<div className={classes.photo}>
            <img className={classes.media} src={`/api/posts/photo/${post._id}`} />
          </div>)
        }
      </CardContent>
      <CardActions>
        {values.like
          ? <IconButton onClick={clickLike} className={classes.button} aria-label="Like" color="secondary">
            <FavoriteIcon />
          </IconButton>
          : <IconButton onClick={clickLike} className={classes.button} aria-label="Unlike" color="secondary">
              <FavoriteBorderIcon />
            </IconButton>
        } 
        <span>{values.likes}</span>
        <IconButton className={classes.button} aria-label="Comment" color="secondary">
          <CommentIcon />
        </IconButton> 
        <span>{values.comments.length}</span>
      </CardActions>
      <Divider />
      <Comments postId={post._id} comments={values.comments} updateComments={updateComments} />
    </Card>
  );
}
 
export default Post;