import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import axios from 'axios';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
// import logo from './logo.svg';

import HeaderBar from './HeaderBar';
import CreatePost from './CreatePost';
import BlogList from './BlogList';
import MovieList from './MovieList';
import Movie from './Movie';
import PersonList from './PersonList';
import Person from './Person';
import NoMatch from './NoMatch';

const client = new ApolloClient();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postTitle: '',
      postContent: '',
      postAuthor: 'David Foulke'
    }

    this.getPosts = this.getPosts.bind(this);
    this.addPost = this.addPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.editPost = this.editPost.bind(this);
    this.updatePostTitle = this.updatePostTitle.bind(this);
    this.updatePostBody = this.updatePostBody.bind(this);
    this.handleCreatePostStateChange = this.handleCreatePostStateChange.bind(this);
    this.handleEditPostStateChange = this.handleEditPostStateChange.bind(this);
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts() {
    axios.get('/api/posts')
      .then((res) => this.setState({posts: res.data.posts}))
      .catch((err) => console.log(err));
  }

  addPost(title, author, content) {
    let post = {title, author, content};
    axios.post('/api/posts', post)
      .then((res) => {
        if (res.status === 201) {
          this.setState({
            posts: [...this.state.posts, res.data.post],
            postTitle: '',
            postContent: ''
          })
        }
      })
      .catch((err) => console.log(err));
  }

  deletePost(postId) {
    axios.delete(`/api/posts/${postId}`)
      .then((res) => {
        if (res.status === 204) {
          this.setState({
            posts: this.state.posts.filter(post => post._id !== postId)
          });
        }
        else alert("There was a problem deleting this post");
      })
      .catch((err) => console.log(err));
  }

  editPost(postId) {
    const updatedPost = {
      title: this.state.postTitle,
      content: this.state.postContent,
      author: this.state.postAuthor
    }
    axios.patch(`/api/posts/${postId}`, updatedPost)
      .then((res) => {
        if(res.status === 203) {
          let newPosts = this.state.posts.map(post => {
            return post._id === postId ? res.data.post : post;
          })
          this.setState({ posts: newPosts });
        }
      })
  }

  updatePostTitle(event) {
    this.setState({
        postTitle: event.target.value
    });
  }

  updatePostBody(event) {
    this.setState({
        postContent: event.target.value
    });
  }

  handleCreatePostStateChange() {
    this.setState({
      postTitle: '',
      postContent: '',
      postAuthor: 'David Foulke'
    })
  }

  handleEditPostStateChange(postId) {
    console.log("Getting post");
    axios.get(`/api/posts/${postId}`)
      .then((res) => {
        console.log("Post found. Updating state");
        this.setState({
          postTitle: res.data.post.title,
          postContent: res.data.post.content,
          postAuthor: res.data.post.author
        });
      });
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <CssBaseline />
          <ApolloProvider client={client}>
            <div className="App">
              <HeaderBar testGraph={this.testGraph}/>
              <div style={{height: '80px', backgroundColor: "rgba(0,0,0,0)"}} />
              <Switch>
                <Route
                  exact
                  path='/'
                  render={() => (
                    <Redirect to='/home' />
                  )}
                />
                <Route
                  path='/home'
                  render={() => (
                    <BlogList
                      posts={this.state.posts}
                      onDelete={this.deletePost}
                    />
                  )}
                />
                <Route
                  path='/createpost'
                  render={() => (
                    <CreatePost
                      onCreatePost={this.addPost}
                      onMount={() => this.handleCreatePostStateChange()}
                      onUpdateTitle={this.updatePostTitle}
                      onUpdateBody={this.updatePostBody}
                      title={this.state.postTitle}
                      content={this.state.postContent}
                      author={this.state.postAuthor}
                    />
                  )}
                />
                <Route
                  path='/editpost/:postId'
                  render={({ match }) => (
                    <CreatePost
                      onCreatePost={() => this.editPost(match.params.postId)}
                      onMount={() => this.handleEditPostStateChange(match.params.postId)}
                      onUpdateTitle={this.updatePostTitle}
                      onUpdateBody={this.updatePostBody}
                      title={this.state.postTitle}
                      content={this.state.postContent}
                      author={this.state.postAuthor}
                    />
                  )}
                />
                <Route path="/movies/:movieId" component={Movie} />
                <Route path="/movies" component={MovieList} />
                <Route path="/people/:personId" component={Person} />
                <Route path="/people" component={PersonList} />
                <Route component={NoMatch} />
              </Switch>
            </div>
          </ApolloProvider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
