import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import HeaderBar from './HeaderBar';
import Blog from './views/Blog';
import Movies from './views/Movies';
import NoMatch from './NoMatch';

const client = new ApolloClient();

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <CssBaseline />
          <ApolloProvider client={client}>
            <div className="App">
              <HeaderBar />
              <div style={{height: '80px', backgroundColor: "rgba(0,0,0,0)"}} />
              <Switch>
                <Route
                  exact
                  path='/'
                  render={() => (
                    <Redirect to='/blog' />
                  )}
                />
                <Route path='/blog' component={Blog} />
                <Route path='/movies' component={Movies} />
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
