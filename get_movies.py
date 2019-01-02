from py2neo import Graph, Node, Relationship
import sys, json

graph = Graph(password="fhdiGEN82&sk@PLD")

def get_nodes():
    return list(graph.nodes)

def num_nodes():
    return len(graph.nodes)

def get_movies():
    return list(graph.nodes.match("Movie"))

def num_movies():
    return len(graph.nodes.match("Movie"))

def count_kevin_bacon(actor=None):
    if actor is None:
        actor = input("Enter the name of an actor: ")
    actor_node = graph.nodes.match("Person", name=actor).first()
    print(actor_node)
    print("Movies:")
    actor_movies = graph.run(f"MATCH(n:Person)-[r]-(m:Movie) WHERE n.name = '{actor}' RETURN m").data()
    for m in actor_movies:
        movie = m['m']
        print(f"{movie['title']} ({movie['year']})")
    res = graph.run("MATCH (n:Person)-[r]-(m:Movie) WHERE n.name = 'Kevin Bacon' RETURN m").data()
    return res


if __name__ == '__main__':
    func = sys.argv[1]

    func_map = {
        "nodes": get_nodes,
        "total_nodes": num_nodes,
        "movies": get_movies,
        "total_movies": num_movies,
        "kevin": count_kevin_bacon
    }

    myfunc = func_map[func]
    print(myfunc())
