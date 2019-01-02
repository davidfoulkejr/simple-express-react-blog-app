import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: '100%',
    maxWidth: '800px'
  }
})

const NoMatch = props => {
  const { classes } = props;

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Paper className={classes.root} elevation={1}>
        <Typography variant='h3'>
          404 Not Found
        </Typography>
        <br />
        <Typography variant='body1'>
          The page you requested was not found. Please
          return to the homepage using the toolbar above.
        </Typography>
      </Paper>
    </div>
  )
}

export default withStyles(styles)(NoMatch)
