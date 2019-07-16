import { v1 as neo4j } from "neo4j-driver";

const GRAPH_HOST = process.env.GRAPH_HOST || "localhost";

const { NEO4J_USER, NEO4J_PASS } = process.env;

export default neo4j.driver(
  `bolt://${GRAPH_HOST}:7687`,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASS)
);
