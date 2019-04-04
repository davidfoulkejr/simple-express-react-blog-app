import { v1 as neo4j } from 'neo4j-driver';

const GRAPH_HOST = process.env.GRAPH_HOST || 'localhost'

module.exports = neo4j.driver(
  `bolt://${GRAPH_HOST}:7687`,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
)
