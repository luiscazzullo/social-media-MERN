import React from 'react';
import {
  Button,
} from '@material-ui/core';
import { follow, unfollow } from './api-user';

const FollowProfileButton = ({ following, onButtonClick }) => {
  const followClick = async () => {
    await onButtonClick(follow);
  }

  const unfollowClick = async () => {
    await onButtonClick(unfollow);
  }

  return (
    <div>
      {following
      ? (<Button 
          variant="contained" 
          color="secondary" 
          onClick={unfollowClick}>
          Unfollow
        </Button>)
      : (<Button
          variant="contained"
          color="primary"
          onClick={followClick}
          >
          Follow
        </Button>)
      }
    </div>
  );
}
 
export default FollowProfileButton;