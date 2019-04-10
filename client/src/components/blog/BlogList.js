import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, withStyles, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import Page from '../../Page';

const styles = theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4
  }
})

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
    const { classes } = this.props;
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
        <Fab
          className={classes.fab}
          color='secondary'
          title="New Post"
          component={Link}
          to="/blog/create"
        >
          <AddIcon />
        </Fab>
      </Page>
    )
  }
}

export default withStyles(styles)(BlogList);