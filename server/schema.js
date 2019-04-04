import { makeExecutableSchema } from'graphql-tools';
import resolvers from'./resolvers';

const typeDefs = `
  type Query {
    movie(id: ID): Movie
    movies(limit: Int = 3, offset: Int = 0): [Movie]!
    person(id: ID): Person
    people(limit: Int = 3, offset: Int = 0): [Person]!
    genre(id: ID): Genre
    genres(limit: Int = 3, offset: Int = 0): [Genre]!
  }

  type Movie {
    id: ID!
    title: String
    year: Int
    summary: String
    rating: String
    duration: Int
    image: String
    url: String
    imdb_score: Float
    cast: [Person]
    director: [Person]
    writer: [Person]
    genres: [Genre]
    similar: [Movie]
  }

  type Person {
    id: ID!
    name: String
    url: String
    image: String
    movies(limit: Int, offset: Int = 0): [Movie]
  }

  type Genre {
    id: ID!
    title: String
    movies(limit: Int = 5, offset: Int = 0): [Movie]
  }
`

export default makeExecutableSchema({ typeDefs, resolvers });
