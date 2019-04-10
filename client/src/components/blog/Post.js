import React from 'react';
import axios from 'axios';
import Page from '../../Page';
import { Typography, Grid, Button, TextField } from '@material-ui/core';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        title: '',
        content: '',
        author: '',
        private: false
      },
      editing: false,
    }
    this.toggleEdit = this.toggleEdit.bind(this);
    this.changeField = this.changeField.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  toggleEdit() {
    this.setState({ editing: !this.state.editing });
  }

  changeField(field) {
    return (e) => {
      this.setState({
        post: {
          ...this.state.post,
          [field]: e.currentTarget.value,
        }
      })
    }
  }

  async onSave() {
    const { postId } = this.props.match.params;
    const res = await axios.patch(`/api/posts/${postId}`, this.state.post);
    const { post } = res.data;
    this.setState({ post });
    this.toggleEdit();
  }

  async onDelete() {
    const { postId } = this.props.match.params;
    const res = await axios.delete(`/api/posts/${postId}`);
    if (res.status === 204) {
      window.location.href = '/';
    }
  }

  async componentDidMount() {
    const { postId } = this.props.match.params;
    const res = await axios.get(`/api/posts/${postId}`);
    const { post } = res.data;
    this.setState({ post });
  }

  render() {
    const { post, editing } = this.state;
    const title = editing ? "Edit Post" : post.title;
    return (
      <Page title={title}>
        {editing ? (
          <TextField
            fullWidth
            value={post.title}
            onChange={this.changeField('title')}
          />
        ) : (
          <Typography variant='body2'>By: {post.author}</Typography>
        )}

        {editing ? (
          <TextField
            fullWidth
            multiline
            variant='outlined'
            value={post.content}
            onChange={this.changeField('content')}
          />
        ) : post.content.split('\n\n').map((paragraph) => (
          <React.Fragment>
            <Typography variant='body1'>{paragraph}</Typography>
            <br />
          </React.Fragment>
        ))}

        <Grid container justify='space-between'>
          <Grid item>
            {editing ? (
              <Button color='primary' variant='contained' onClick={this.onSave}>Save</Button>
            ) : (
              <Button color='primary' onClick={this.toggleEdit}>Edit</Button>
            )}
          </Grid>
          <Grid item>
            <Button color='secondary' onClick={this.onDelete}>Delete</Button>
          </Grid>
        </Grid>
      </Page>
    )
  }
}

export default Post;