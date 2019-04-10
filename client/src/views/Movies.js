import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { MovieList, PeopleList } from '../components/movies';

import Movie from '../Movie';
import Person from '../Person';

class Movies extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={match.url} component={MovieList} />
        <Route path={`${match.url}/details/:movieId`} component={Movie} />
        <Route path={`${match.url}/people`} component={PeopleList} />
        <Route path={`${match.url}/people/details/:personId`} component={Person} />
      </Switch>
    )
  }
}

export default Movies;