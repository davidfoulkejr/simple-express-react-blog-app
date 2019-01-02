import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  vertList: {
    display: 'flex',
    flexDirection: 'column',
    '& span': {
      padding: '5px 0'
    }
  }
});

const Person = props => {
  const { classes, match } = props;
  const query = gql`
    {
      person(id: "${match.params.personId}") {
        id
        name
        movies {
          id
          title
          year
        }
      }
    }
  `;

  return (
    <Query query={query}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>
        if (error) return <div style={{color: 'red'}}>{`Error! ${error}`}</div>

        const person = data.person;
        return (
          <div className={classes.root}>
            <h1>{person.name}</h1>
            <h4>Movies:</h4>
            <div className={classes.vertList}>
              {person.movies.sort((a, b) => {
                if (a.year > b.year) return -1;
                if (a.year < b.year) return 1;
                return 0;
              }).map(({ id, title, year }) => (
                <span key={id}><Link to={`/movies/${id}`}>{`${title} (${year})`}</Link></span>
              ))}
            </div>
          </div>
        )
      }}
    </Query>
  )
}

export default withStyles(styles)(Person);
