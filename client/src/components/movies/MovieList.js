import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Grid, Button, TextField } from '@material-ui/core';
import ResizableList from '../../ResizableList';
import Page from '../../Page';

class MovieList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      show: 20,
      searchText: ''
    }

    this.changeListCount = this.changeListCount.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  changeListCount(e) {
    this.setState({ show: parseInt(e.currentTarget.textContent) });
  }

  nextPage(state, props) {
    return {
      page: state.page + 1
    }
  }

  prevPage(state, props) {
    return {
      page: state.page - 1
    }
  }

  changeText(e) {
    this.setState({ searchText: e.currentTarget.value });
  }

  render() {
    const { match } = this.props;
    const { page, show, searchText } = this.state;
    const query = gql`
      {
        movies(limit: ${show}, offset: ${page * show}) {
          id
          title
          year
          image
          genres {
            id
            title
          }
        }
      }
    `
    return (
      <Page title="Movies">
        <TextField value={searchText} placeholder="Search Movies..." onChange={this.changeText} />
        <Query query={query}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>
            if (error) return <div style={{ color: 'red' }}>{`Error! ${error.message}`}</div>
            const getMovieInfo = movie => ({
              id: movie.id,
              url: `${match.url}/details/${movie.id}`,
              image: movie.image,
              primaryText: `${movie.title} (${movie.year})`,
              secondaryText: movie.genres.map(genre => genre.title).join(', '),
            });

            return (
              <ResizableList
                list={data.movies.map(getMovieInfo)}
                show={show}
                onSelectItem={this.changeListCount}
              />
            )
          }}
        </Query>

        <Grid container justify='center'>
          <Grid item>
            <Button onClick={() => this.setState(this.prevPage)}>&lt; Prev</Button>
          </Grid>
          <Grid item>
            <Button onClick={() => this.setState(this.nextPage)}>Next &gt;</Button>
          </Grid>
        </Grid>
      </Page>
    )
  }
}

export default MovieList;
