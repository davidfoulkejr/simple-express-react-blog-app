import React from 'react';
import {
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    },
    column: {
        flexBasis: '50%',
    }
})

const BlogPost = props => {
    const { classes } = props;
    return (
        <ExpansionPanel className={classes.root} elevation={1}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <div>
                    <Typography variant='h5'>
                        {props.title}
                    </Typography>
                    <Typography color="textSecondary">
                        By: {props.author}
                    </Typography>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <br />
                <Typography variant='body2'>
                    {props.content}
                </Typography>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

export default withStyles(styles)(BlogPost);