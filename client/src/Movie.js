import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
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
  flexList: {
    display: 'flex',
    '& span': {
      padding: '5px',
      paddingLeft: '0'
    },
  },
  vertList: {
    display: 'flex',
    flexDirection: 'column',
    '& span': {
      padding: '5px 0'
    }
  }
})

const Movie = props => {
  const { match, classes } = props;
  const query = gql`
    {
      movie(id: "${match.params.movieId}") {
        id
        title
        year
        rating
        duration
        summary
        image
        genres {
          id
          title
        }
        cast {
          ... personInfo
        }
        director {
          ... personInfo
        }
        writer {
          ... personInfo
        }
        similar {
          id
          title
          year
        }
      }
    }

    fragment personInfo on Person {
      id
      name
    }
  `

  return (
    <Query query={query}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>
        if (error) return <div style={{color: 'red'}}>{`Error! ${error}`}</div>

        const movie = data.movie;
        return (
          <div>
            <div className={classes.root}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{paddingRight: '10px'}}>
                  <h1>{`${movie.title} (${movie.year})`}</h1>
                  <div className={classes.flexList}>
                    <span>{movie.rating}</span>
                    <span>|</span>
                    <span>{`${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`}</span>
                    <span>|</span>
                    <span>{movie.genres.map(g => g.title).join(', ')}</span>
                  </div>
                  <p>{movie.summary}</p>
                  <div className={classes.flexList}>
                    <span>Cast:</span>
                    {movie.cast.reverse().map(person => (
                      <span key={person.id}><Link to={`/people/${person.id}`}>{person.name}</Link></span>
                    ))}
                  </div>
                  <div className={classes.flexList}>
                    <span>Director(s):</span>
                    {movie.director.reverse().map(person => (
                      <span key={person.id}><Link to={`/people/${person.id}`}>{person.name}</Link></span>
                    ))}
                  </div>
                  <div className={classes.flexList}>
                    <span>Writer(s):</span>
                    {movie.writer.reverse().map(person => (
                      <span key={person.id}><Link to={`/people/${person.id}`}>{person.name}</Link></span>
                    ))}
                  </div>
                  <div>
                    <h4>Similar To:</h4>
                    <div className={classes.vertList}>
                      {movie.similar.map(({ id, title, year }) => (
                        <span key={id}><Link to={`/movies/${id}`}>{`${title} (${year})`}</Link></span>
                      ))}
                    </div>
                  </div>
                </div>
                <img src={movie.image} alt='poster' style={{maxHeight: '300px'}}/>
              </div>
            </div>
          </div>
        )
      }}
    </Query>
  )
}

export default withStyles(styles)(Movie)
