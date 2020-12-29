import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FollowGrid from './../user/FollowGrid';
import PostList from '../post/PostList';

const TabContainer = ({ children }) => {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {children}
    </Typography>
  )
}

export default function ProfileTabs({ user, removePostUpdate, posts }) {
  const [tab, setTab] = useState(0)

  const handleTabChange = (event, value) => {
    setTab(value)
  }

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Posts" />
          <Tab label="Following" />
          <Tab label="Followers" />
        </Tabs>
      </AppBar>
      {tab === 0 && <TabContainer><PostList removeUpdate={removePostUpdate} posts={posts} /></TabContainer>}
      {tab === 1 && <TabContainer><FollowGrid people={user.following} /></TabContainer>}
      {tab === 2 && <TabContainer><FollowGrid people={user.followers} /></TabContainer>}
    </div>)

}