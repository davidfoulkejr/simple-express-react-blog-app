import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import {
  AppBar,
  Toolbar,
  Typography,
  Button
} from '@material-ui/core';

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  link: {
    color: 'inherit',
    textDecoration: 'none'
  }
}

const HeaderBar = props => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            David Foulke Jr.
          </Typography>
          <Link to='/blog' className={classes.link}>
            <Button color="inherit">Home</Button>
          </Link>
          <Link to='/movies' className={classes.link}>
            <Button color="inherit">Movies</Button>
          </Link>
          <Link to='/movies/people' className={classes.link}>
            <Button color="inherit">People</Button>
          </Link>
          <a href='/api/hello' className={classes.link}>
            <Button color='inherit'>Sign In</Button>
          </a>
        </Toolbar>
      </AppBar>
    </div>
  )
}

HeaderBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(HeaderBar);
