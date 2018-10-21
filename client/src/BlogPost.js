import React from 'react';
import { Link } from 'react-router-dom';
import {
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    ExpansionPanelActions,
    Button
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        width: '100%',
        maxWidth: '800px',
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    }
})

const BlogPost = props => {
    const { classes } = props;
    return (
        <ExpansionPanel className={classes.root} expanded={props.expanded} onChange={props.onToggle}>
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
                <Typography variant='body1'>
                    {props.content.split('\n').map((paragraph, idx) => (
                        <React.Fragment key={idx.toString()}>
                            {paragraph}
                            <br />
                        </React.Fragment>
                    ))}
                </Typography>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
                <Link to={"/editpost/" + props.id} className={classes.link}>
                    <Button onClick={e => props.onEditButtonClick(props.id)} color='primary'>Edit</Button>
                </Link>
                <Button onClick={e => props.onDelete(props.id)} color='secondary'>Delete</Button>
            </ExpansionPanelActions>
        </ExpansionPanel>
    );
}

export default withStyles(styles)(BlogPost);