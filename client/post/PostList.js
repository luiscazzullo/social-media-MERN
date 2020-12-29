import React from 'react';
import Post from './Post';

const PostList = ({ removeUpdate, posts }) => {
  return (
    <div style={{ marginTop: '24px' }}>
      {posts.map((post, index) => {
        return (
          <Post post={post} key={index} onRemove={removeUpdate} />
        )
      })}
    </div>
  );
}
 
export default PostList;