import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { Grid, Button, TextField, Typography } from '@material-ui/core';
import ResizableList from './ResizableList';

class PersonList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      show: 20
    }

    this.changeListCount = this.changeListCount.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
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

  render() {
    const { match } = this.props;
    const { page, show } = this.state;
    const query = gql`
      {
        people(limit: ${show}, offset: ${page * show}) {
          id
          name
          image
          movies(limit: 2, offset: 0) {
            title
            year
          }
        }
      }
    `

    return (
      <Grid container justify='center'>
        <Grid item lg={8} md={10}>
          <Grid container direction='column' spacing={32}>
            <Grid item>
              <Typography variant='h4'>People</Typography>
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

                  const getPersonInfo = person => ({
                    id: person.id,
                    url: `${match.url}/${person.id}`,
                    image: person.image,
                    primaryText: person.name,
                    secondaryText: person.movies.map(movie => `${movie.title} (${movie.year})`).join(', ')
                  });

                  return (
                    <ResizableList
                      list={data.people.map(getPersonInfo)}
                      show={show}
                      prevPage={() => this.setState(this.prevPage)}
                      nextPage={() => this.setState(this.nextPage)}
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

export default PersonList;
