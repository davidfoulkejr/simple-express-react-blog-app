import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRouter from './postRouter';

import { ApolloServer, graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './schema';
import driver from './driver';

// Setup
const db = mongoose.connect('mongodb://127.0.0.1:27017/reactBlog', { useNewUrlParser: true });
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/posts', postRouter);

const server = new ApolloServer({
  schema,
  context: { driver },
  playground: {
    endpoint: `http://localhost:${port}/graphql`,
    settings: {
      'editor.theme': "light"
    }
  }
})

server.applyMiddleware({ app });
app.listen(port, () => console.log(`Listening on port ${port}`));
