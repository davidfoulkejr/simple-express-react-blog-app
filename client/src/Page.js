import React from 'react';
import { Grid, Typography } from '@material-ui/core';

const Page = (props) => {
  return (
    <Grid container justify='center'>
      <Grid item lg={8} md={10}>
        <Grid container direction='column' spacing={16}>
          <Grid item>
            <Typography variant='h4'>{ props.title }</Typography>
          </Grid>
          {props.children.map((child, i) => (
            <Grid item key={`page-child-${i}`}>
              {child}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Page;