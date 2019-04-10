import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Grid, Button, TextField } from '@material-ui/core';
import ResizableList from '../../ResizableList';
import Page from '../../Page';

class PeopleList extends React.Component {
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
    this.setState({ searchText: e.currentTarget.value })
  }

  componentDidMount() {
    console.log(this.props.match);
  }

  render() {
    const { match } = this.props;
    const { page, show, searchText } = this.state;
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
      <Page title="People">
        <TextField
          placeholder='Search'
          value={searchText}
        />
        <Query query={query}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>
            if (error) return <div style={{ color: 'red' }}>{`Error! ${error.message}`}</div>

            const getPersonInfo = person => ({
              id: person.id,
              url: `${match.url}/details/${person.id}`,
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

        <Grid container justify='center'>
          <Grid item>
            <Button onClick={() => this.setState(this.prevPage)}>&lt; Prev</Button>
          </Grid>
          <Grid item>
            <Button onClick={() => this.setState(this.nextPage)}>Next &gt;</Button>
          </Grid>
        </Grid>
      </Page >
    )
  }
}

export default PeopleList;
