import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import defaultImg from './assets/default-movie.png';

const styles = theme => ({
  title: {
    fontWeight: 'bold',
  },
  card: {
    height: '100%'
  },
  cardImage: {
    objectFit: 'cover'
  }
})

class ResizableList extends React.Component {
  render() {
    const { list, classes } = this.props;
    return (
      <Grid container spacing={16}>
        {list.map((item, i) => (
          <Grid item key={`item-${i}`} md={3} sm={4} xs={12}>
            <Card className={classes.card}>
              <CardActionArea className={classes.card} component={Link} to={item.url}>
                <CardMedia
                  component='img'
                  className={classes.cardImage}
                  src={item.image ? item.image : defaultImg}
                  alt={item.primaryText}
                  title={item.primaryText}
                />
                <CardContent>
                  <Typography className={classes.title} variant='body1'>{item.primaryText}</Typography>
                  <Typography variant='caption'>{item.secondaryText}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }
}

export default withStyles(styles)(ResizableList);
