import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { Grid, Button, Typography, TextField } from '@material-ui/core';
import ResizableList from './ResizableList';

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
    const { page, show } = this.state;
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
      <Grid container justify='center'>
        <Grid item lg={8} md={10}>
          <Grid container direction='column' spacing={32}>
            <Grid item>
              <Typography variant='h4'>Movies</Typography>
            </Grid>
            <Grid item>
              <TextField
                placeholder='Search'
                value={this.state.searchText}
              />
            </Grid>
            <Grid item>
              <Query query={query}>
                {({ loading, error, data }) => {
                  if (loading) return <div>Loading...</div>
                  if (error) return <div style={{color: 'red'}}>{`Error! ${error.message}`}</div>
                  const getMovieInfo = movie => ({
                    id: movie.id,
                    url: `${match.url}/${movie.id}`,
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
            </Grid>
          
            <Grid item>
              <Grid container justify='center'>
                <Grid item>
                  <Button onClick={() => this.setState(this.prevPage)}>&lt; Prev</Button>
                </Grid>
                <Grid item>
                  <Button onClick={() => this.setState(this.nextPage)}>Next &gt;</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Grid>
    )
  }
}

export default MovieList;
