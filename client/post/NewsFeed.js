import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Divider
} from '@material-ui/core';
import { listNewsFeed } from './api-post';
import NewPost from './NewPost';
import PostList from './PostList';
import auth from '../auth/auth-helper';

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const jwt = auth.isAuthenticated();
  const addPost = post => {
    const updatedPosts = [...posts];
    updatedPosts.unshift(post);
    setPosts(updatedPosts);
  }

  const removePost = post => {
    const updatedPosts = [...posts];
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const getMyFeedNews = async () => {
      const response = await listNewsFeed({ userId: jwt.user._id}, { t: jwt.token }, signal);
      if(response.error) {
        console.log(response.error);
      } else {
        setPosts(response);
      }
    }
    getMyFeedNews();
    return function cleanup() {
      abortController.abort();
    }
  }, [])

  return (
    <Card>
      <Typography type="title">Newsfeed</Typography>
      <Divider />
      <NewPost addUpdate={addPost} />
      <Divider />
      <PostList removeUpdate={removePost} posts={posts} />
    </Card>
  );
}
 
export default NewsFeed;