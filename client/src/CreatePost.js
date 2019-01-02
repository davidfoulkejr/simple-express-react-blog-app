import React from 'react';
import { Link } from 'react-router-dom';
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
        flex: '1 1 auto',
        maxWidth: '800px',
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
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    }
})

class CreatePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            author: 'David Foulke',
            content: '',
            error: {
                title: '',
                content: ''
            }
        }

        this.handleCreatePost = this.handleCreatePost.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.updateBody = this.updateBody.bind(this);
    }

    updateTitle(event) {
        this.setState({error: {
            ...this.state.error,
            title: ''
        }});
        this.props.onUpdateTitle(event);
    }

    updateBody(event) {
        this.setState({error: {
            ...this.state.error,
            content: ''
        }});
        this.props.onUpdateBody(event);
    }

    handleCreatePost() {
        const { title, author, content } = this.props;

        if (title === '' || content === '') {
            const message = 'This field cannot be empty';
            let error = {};
            if (title === '') error.title = message;
            if (content === '') error.content = message;
            this.setState({ error });
        }
        else {
            this.props.onCreatePost(
                title,
                author,
                content
            );
        }
    }

    componentDidMount() {
      if (this.props.onMount) this.props.onMount();
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
                            value={this.props.title}
                            onChange={this.updateTitle}
                            margin='normal'
                            helperText={this.state.error.title}
                            error={this.state.error.title !== '' ? true : false}
                            fullWidth
                        />
                        <TextField
                            id='input-content'
                            label='Body'
                            multiline
                            className={classes.textField}
                            value={this.props.content}
                            onChange={this.updateBody}
                            margin='normal'
                            helperText={this.state.error.content}
                            error={this.state.error.content !== '' ? true : false}
                            fullWidth
                        />
                    </form>
                    <Link to='/' className={classes.link}>
                        <Button
                            variant='contained'
                            className={classes.button}
                            color='secondary'
                            onClick={this.handleCreatePost}
                        >
                            Post
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(CreatePost);
