import React, { Component } from 'react';
import { CssBaseline } from '@material-ui/core';
// import logo from './logo.svg';

import HeaderBar from './HeaderBar';
import CreatePost from './CreatePost';
import BlogPost from './BlogPost';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      response: ''
    }

    this.addPost = this.addPost.bind(this);
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({response: res.express}))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  addPost(title, author, content) {
    let post = {title, author, content};
    this.setState({posts: this.state.posts.concat([post])})
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <div className="App">
          <HeaderBar />
          <CreatePost onCreatePost={this.addPost} />
          <p>{this.state.response ? this.state.response : 'Error'}</p>
          <BlogPost
            title="Hello Again"
            author="David Foulke"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Maecenas consequat libero enim, ac mollis nibh scelerisque at.
            Etiam consequat elit eget ex iaculis, quis consequat nunc ullamcorper.
            Praesent id augue est.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Maecenas consequat libero enim, ac mollis nibh scelerisque at.
            Etiam consequat elit eget ex iaculis, quis consequat nunc ullamcorper.
            Praesent id augue est.
            Cras eget massa a dolor pellentesque elementum et in magna.
            Phasellus ultrices dignissim vulputate.
            Cras molestie, enim at molestie auctor, ipsum sapien tincidunt mauris,
            ac vehicula tortor ipsum condimentum sapien.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
            Sed a ipsum ullamcorper, vulputate leo semper, commodo mi.
            Donec nibh lacus, efficitur eu accumsan sit amet,
            porta vel turpis. Nulla vitae condimentum lectus."
          />
          {this.state.posts.map(post => (
            <BlogPost
              title={post.title}
              author={post.author}
              content={post.content}
            />
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
