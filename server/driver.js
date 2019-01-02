import { v1 as neo4j } from 'neo4j-driver';

export default neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', "fhdiGEN82&sk@PLD")
)
