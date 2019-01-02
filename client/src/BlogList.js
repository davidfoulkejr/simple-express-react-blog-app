import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';

import BlogPost from './BlogPost';

const styles = theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4
  }
})

class BlogList extends React.Component {
    state = { active: -1 }

    handleChange = index => (event, expanded) => {
        this.setState({ active: expanded ? index : -1 })
    }

    handleDelete = postId => {
        this.setState({ active: -1 });
        this.props.onDelete(postId);
    }

    render() {
        const { active } = this.state;
        const { classes } = this.props;
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              {this.props.posts.map((post, idx) => (
                <BlogPost
                  key={post._id}
                  expanded={active >= 0 && active === idx ? true : false}
                  id={post._id}
                  title={post.title}
                  author={post.author}
                  content={post.content}
                  onDelete={this.handleDelete}
                  onEditButtonClick={this.props.onEditButtonClick}
                  onToggle={this.handleChange(idx)}
                />
              ))}
              <Link to='/createpost' className={classes.fab}>
                <Button
                  variant='fab'
                  color='secondary'
                  title="New Post"
                  onClick={this.props.onCreateButtonClick}
                >
                  <AddIcon />
                </Button>
              </Link>
            </div>
        )
    }
}

export default withStyles(styles)(BlogList)
