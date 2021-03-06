import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CardHeader,
  Avatar,
  TextField,
  Icon
} from '@material-ui/core';
import auth from '../auth/auth-helper';
import { comment, uncomment } from './api-post';
import { Link } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  smallAvatar: {
    width: 25,
    height: 25
  },
  commentField: {
    width: '96%'
  },
  commentText: {
    backgroundColor: 'white',
    padding: theme.spacing(1),
    margin: `2px ${theme.spacing(2)}px 2px 2px`
  },
  commentDate: {
    display: 'block',
    color: 'gray',
    fontSize: '0.8em'
  },
  commentDelete: {
    fontSize: '1.6em',
    verticalAlign: 'middle',
    cursor: 'pointer'
  }
}))

const Comments = ({ updateComments, postId, comments }) => {
  const classes = useStyles();
  const [text, setText] = useState('');
  const jwt = auth.isAuthenticated();

  const handleChange = e => {
    setText(e.target.value);
  }
  
  const addComment = async e => {
    if(e.keyCode == 13 && e.target.value) {
      e.preventDefault();
      const response = await comment({ userId: jwt.user._id}, { t: jwt.token }, postId, { text });
      if(response.error) {
        console.log(response.error);
      } else {
        setText('')
        updateComments(response.comments);
      }
    }
  }

  const deleteComment = comment => event => {
    uncomment({ userId: jwt.user._id }, { t: jwt.token }, postId, comment)
      .then(data => {
        if(data.error) {
          console.log(data.error)
        } else {
          updateComments(data.comments)
        }
      })
  }

  const commentBody = item => {
    return (
      <p className={classes.commentText}>
        <Link to={`/user/${item.postedBy._id}`}>
          {item.postedBy.name}
        </Link><br />
        {item.text}
        <span className={classes.commentDate}>
          {(new Date(item.created)).toDateString()} |
          {auth.isAuthenticated().user._id === item.postedBy._id &&
            <Icon onClick={deleteComment(item)} className={classes.commentDelete}>
              Borrar
            </Icon>
          }
        </span>
      </p>
    )
  }

  return (
    <div>
      <CardHeader
        avatar={<Avatar className={classes.smallAvatar} src={`/api/users/photo/${auth.isAuthenticated().user._id}`} />}
        title={
          <TextField 
            onKeyDown={addComment}
            multiline
            value={text}
            onChange={handleChange}
            placeholder="Escriba su comentario..."
            className={classes.commentField}
            margin="normal"
          />
        }
        className={classes.cardHeader}
      />
      {
        comments.map((item, index) => {
          return (
            <CardHeader 
              avatar={<Avatar className={classes.smallAvatar} src={`/api/users/photo/${item.postedBy._id}`} />}
              key={index}
              className={classes.cardHeader}
              title={commentBody(item)}
            />
          )
        })
      }
    </div>
  );
}
 
export default Comments;