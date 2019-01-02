import json, sys
from py2neo import Graph, Relationship, Node
from imdb_scraper import Movie, add_movie, collect_movie_info, get_related_movies

try:
    try:
        url = sys.argv[1]
    except IndexError:
        url = input("Enter an IMDb URL to get started: ")

    g = Graph(password="fhdiGEN82&sk@PLD")
    delete = input("Delete all {num_nodes} nodes and their relationships? (y/n): ".format(num_nodes=len(g.nodes)))
    if delete == 'y':
        deleted = g.delete_all()
        print("Successfully deleted all nodes")

    print('')
    print("Getting movies:")

    root = collect_movie_info(url)
    related = get_related_movies(root)

    print(root)
    root_node = add_movie(g, root)

    txn = g.begin()

    all_movies = {}
    for movie in related:
        for url in movie.more_like_this:
            placeholder_node = Node("Placeholder", url=url, similar_to=movie.url)
            txn.create(placeholder_node)
        movie_node = add_movie(g, movie)

        rel = Relationship(movie_node, "SIMILAR_TO", root_node)
        txn.create(rel)

        key = str(movie)
        all_movies[key] = vars(movie)

    txn.commit()
    print(json.dumps({"movies": all_movies}))

except KeyboardInterrupt:
    print("Exiting manually")
    sys.exit()
