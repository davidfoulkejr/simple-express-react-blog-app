import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    TextField,
    Typography,
    Card,
    CardContent,
    Button
} from '@material-ui/core';

const styles = theme => ({
    card: {
        width: '800px',
        maxWidth: '80%',
        margin: '20px auto',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    button: {
        margin: theme.spacing.unit
    }
})

class CreatePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            author: 'David Foulke',
            content: ''
        }

        this.handleCreatePost = this.handleCreatePost.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.updateBody = this.updateBody.bind(this);
    }

    updateTitle(event) {
        this.setState({title: event.target.value});
    }

    updateBody(event) {
        this.setState({content: event.target.value});
    }

    handleCreatePost() {
        const { title, author, content } = this.state;
        this.props.onCreatePost(
            title,
            author,
            content
        );

        this.setState({
            title: '',
            content: ''
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant='h5'>
                        New Post
                    </Typography>
                    <form onSubmit={e => e.preventDefault()} className={classes.container} noValidate autoComplete='off'>
                        <TextField
                            id='input-title'
                            label='Title'
                            className={classes.textField}
                            value={this.state.title}
                            onChange={this.updateTitle}
                            margin='normal'
                            fullWidth
                        />
                        <TextField 
                            id='input-content'
                            label='Body'
                            multiline
                            rowsMax='6'
                            className={classes.textField}
                            value={this.state.content}
                            onChange={this.updateBody}
                            margin='normal'
                            fullWidth
                        />
                    </form>
                    <Button
                        variant='contained'
                        className={classes.button}
                        color='secondary'
                        onClick={this.handleCreatePost}
                    >
                        Post
                    </Button>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(CreatePost);