import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

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
          movies(limit: 2, offset: 0) {
            title
            year
          }
        }
      }
    `

    return (
      <Query query={query}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>
          if (error) return <div style={{color: 'red'}}>{`Error! ${error.message}`}</div>

          const getPersonInfo = person => ({
            id: person.id,
            url: `${match.url}/${person.id}`,
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
    )
  }
}

export default PersonList;
