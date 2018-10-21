import React from 'react';
import BlogPost from './BlogPost';

class BlogList extends React.Component {
    state = { active: -1 }

    handleChange = index => (event, expanded) => {
        this.setState({ active: expanded ? index : -1 })
    }

    handleDelete = postId => {
        this.setState({ active: -1 });
        this.props.onDelete(postId);
    }

    render() {
        const { active } = this.state;
        return (    
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {this.props.posts.map((post, idx) => (
                    <BlogPost
                        key={post._id}
                        expanded={active >= 0 && active === idx ? true : false}
                        id={post._id}
                        title={post.title}
                        author={post.author}
                        content={post.content}
                        onDelete={this.handleDelete}
                        onEditButtonClick={this.props.onEditButtonClick}
                        onToggle={this.handleChange(idx)}
                    />
                ))}
            </div>
        )
    }
}

export default BlogList