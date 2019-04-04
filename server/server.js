import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRouter from './postRouter';

import { ApolloServer, graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './schema';
import driver from './driver';

const MONGO_HOST = process.env.MONGO_HOST || 'localhost'

// Setup
const db = mongoose.connect(`mongodb://${MONGO_HOST}:27017/reactBlog`, { useNewUrlParser: true })
  .catch(e => {
    console.log("Error connecting to MongoDB")
    console.log(e)
  });

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
    endpoint: `http://${process.env.API_HOST}:${port}/graphql`,
    theme: 'dark'
  }
})

server.applyMiddleware({ app });
app.listen(port, () => console.log(`Listening on port ${port}`));
