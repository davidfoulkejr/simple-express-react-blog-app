import sys
from py2neo import Graph, Relationship, Node
from imdb_scraper import collect_movie_info, add_movie, get_related_movies

graph = Graph(password="fhdiGEN82&sk@PLD")

try:
    movies = graph.nodes.match("Movie")
    movie_urls = [movie['url'] for movie in movies]

    placeholders = graph.nodes.match("Placeholder")
    placeholder_urls = set([ph['url'] for ph in placeholders])

    print("There are {urls} unique movies to be added".format(urls=len(placeholder_urls)))

    for url in placeholder_urls:
        if url in movie_urls : continue

        try:
            movie = collect_movie_info(url)
            if movie.title == '' and movie.year == '' : continue
            node = add_movie(graph, movie)
            movie_urls.append(url)
        except:
            print(f"Could not find movie at {url}")
            continue
            
        transaction = graph.begin()

        similar_to_url = placeholders.where(url=url).first()['similar_to']
        similar_to = movies.where(url=similar_to_url).first()
        rel = Relationship(node, "SIMILAR_TO", similar_to)
        transaction.create(rel)

        deleted = 0
        for n in placeholders.where(url=url):
            transaction.delete(n)
            deleted += 1

        print(f"Deleted {deleted} nodes")

        for related in movie.more_like_this:
            if related not in movie_urls and related not in placeholder_urls:
                ph_node = Node("Placeholder", url=related, similar_to=url)
                transaction.create(ph_node)

        transaction.commit()
    # for movie in movies:
    #     root = collect_movie_info(movie['url'])
    #     related = get_related_movies(root)
    #
    #     root_node = add_movie(graph, root)
    #     transaction = graph.begin()
    #     for m in related:
    #         for url in m.more_like_this:
    #             placeholder_node = Node("Placeholder", url=url, similar_to=m.url)
    #             transaction.create(placeholder_node)
    #
    #         if m.url in movie_urls : continue
    #         movie_node = add_movie(graph, m)
    #
    #         rel = Relationship(movie_node, "SIMILAR_TO", root_node)
    #         transaction.create(rel)

        # transaction.commit()

except KeyboardInterrupt:
    print("Exiting manually")
    sys.exit()
