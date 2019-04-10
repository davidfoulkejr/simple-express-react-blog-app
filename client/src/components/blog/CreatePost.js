import React from 'react';
import axios from 'axios';
import {
  TextField,
  Button
} from '@material-ui/core';
import Page from '../../Page';


class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      author: 'David Foulke',
      content: '',
      error: {
        title: '',
        content: ''
      }
    }

    this.changeField = this.changeField.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
  }

  changeField(field) {
    return (e) => {
      this.setState({ [field]: e.currentTarget.value });
    }
  }

  async handleCreatePost() {
    const { title, content } = this.state;

    if (title === '' || content === '') {
      const message = 'This field cannot be empty';
      let error = {};
      if (title === '') error.title = message;
      if (content === '') error.content = message;
      this.setState({ error });
    }
    else {
      const post = { ...this.state };
      delete post.error;

      const res = await axios.post('/api/posts', post);
      if (res.status === 201) {
        window.location.href = '/';
      }
    }
  }

  render() {
    return (
      <Page title="New Post">
        <TextField
          id='input-title'
          label='Title'
          value={this.state.title}
          onChange={this.changeField('title')}
          margin='normal'
          helperText={this.state.error.title}
          error={this.state.error.title !== '' ? true : false}
          fullWidth
        />
        <TextField
          id='input-content'
          label='Body'
          multiline
          fullWidth
          variant='outlined'
          value={this.state.content}
          onChange={this.changeField('content')}
          helperText={this.state.error.content}
          error={this.state.error.content !== '' ? true : false}
        />

        <Button
          variant='contained'
          color='primary'
          onClick={this.handleCreatePost}
        >
          Post
        </Button>
      </Page>
    );
  }
}

export default CreatePost;
