import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@material-ui/core';
import axios from 'axios';
import Page from '../../Page';

class BlogList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    }
  }

  async componentDidMount() {
    const res = await axios.get('/api/posts');
    const { posts } = res.data;
    this.setState({ posts });
  }

  render() {
    const { posts } = this.state;
    return (
      <Page title='Posts'>
        <List>
          {posts.map((post, i) => (
            <ListItem key={`post${i}`} button component={Link} to={`/blog/${post._id}`}>
              <ListItemText primary={post.title} secondary={post.author} />
            </ListItem>
          ))}
        </List>
      </Page>
    )
  }
}

export default BlogList;