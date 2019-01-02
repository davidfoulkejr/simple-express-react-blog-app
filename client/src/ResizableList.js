import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, MenuItem, List, ListItem, ListItemText, Grid } from '@material-ui/core';

class ResizableList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchor: null
    }

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
  }

  handleSelectItem(e) {
    this.props.onSelectItem(e);
    this.setState({ anchor: null });
  }

  openMenu(e) {
    this.setState({ anchor: e.currentTarget });
  }

  closeMenu() {
    this.setState({ anchor: null });
  }

  render() {
    const { anchor } = this.state;
    const { list, show, prevPage, nextPage } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid item md={6}>
          <List>
            {list.slice(0, show/2).map(item => (
              <ListItem key={item.id} button component={Link} to={item.url}>
                <ListItemText
                  primary={item.primaryText}
                  secondary={item.secondaryText}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item md={6}>
          <List>
            {list.slice(show/2).map(item => (
              <ListItem key={item.id} button component={Link} to={item.url}>
                <ListItemText
                  primary={item.primaryText}
                  secondary={item.secondaryText}
                />
              </ListItem>)
            )}
          </List>
        </Grid>
        <Grid item md={12}>
          <div style={{display: 'flex', flexFlow: 'row nowrap'}}>
            <Button color="primary" onClick={prevPage}>{"< Prev"}</Button>
            <span style={{padding: '0 10vw'}}>
              <Button
                aria-owns={anchor ? 'movie-count' : undefined}
                aria-haspopup='true'
                onClick={this.openMenu}
              >
                Show: {show}
              </Button>
              <Menu
                id='movie-count'
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={this.closeMenu}
              >
                <MenuItem onClick={this.handleSelectItem}>20</MenuItem>
                <MenuItem onClick={this.handleSelectItem}>50</MenuItem>
                <MenuItem onClick={this.handleSelectItem}>100</MenuItem>
              </Menu>
            </span>
            <Button color="primary" onClick={nextPage}>{"Next >"}</Button>
          </div>
        </Grid>
      </Grid>
    )
  }
}

export default ResizableList;
