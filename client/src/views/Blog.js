import React from 'react';
import { Route, Switch } from 'react-router-dom';
import BlogList from '../components/blog/BlogList';
import Post from '../components/blog/Post';
import CreatePost from '../CreatePost';

class Blog extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={match.url} component={BlogList} />
        <Route path={`${match.url}/create`} component={CreatePost} />
        <Route path={`${match.url}/:postId`} component={Post} />
      </Switch>
    )
  }
}

export default Blog;