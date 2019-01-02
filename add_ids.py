from py2neo import Graph, NodeMatcher
import uuid

graph = Graph(password="fhdiGEN82&sk@PLD")
matcher = NodeMatcher(graph)
txn = graph.begin()

nodes = graph.run("MATCH (n) WHERE NOT n:Placeholder WITH COUNT(n) AS nodes RETURN nodes").data()[0]['nodes']
for i in range(nodes):
    node = matcher.get(i)
    if node is not None and node['id'] is None:
        node['id'] = str(uuid.uuid4())
        graph.push(node)

txn.commit()
