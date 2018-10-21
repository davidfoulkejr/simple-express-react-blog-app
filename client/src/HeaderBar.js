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
                        Hello World!
                    </Typography>
                    <Link to='/' className={classes.link}>
                        <Button color="inherit">Home</Button>
                    </Link>
                    <Link to='/createpost' className={classes.link}>
                        <Button color="inherit" onClick={props.onCreateButtonClick}>Create Post</Button>
                    </Link>
                </Toolbar>
            </AppBar>
        </div>
    )
}

HeaderBar.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(HeaderBar);