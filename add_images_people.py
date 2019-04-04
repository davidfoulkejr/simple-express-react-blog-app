from py2neo import Graph, Node, Relationship
from bs4 import BeautifulSoup
import requests, json, sys

graph = Graph(password="fhdiGEN82&sk@PLD")
trans = graph.begin()

# For each movie, get the image src property
for node in graph.nodes.match("Person"):
    if node['image'] == '' : continue
    elif node['image'] is not None : continue
    try:
        url = f"http://imdb.com{node['url']}"
        req = requests.get(url)
        if req.status_code == 404:
            node['image'] = ''
            graph.push(node)
            print(f"Could not find IMDB page for {node['name']}")
            continue
        else:
            html = req.content
            soup = BeautifulSoup(html, 'html.parser')
            img = soup.select('#name-poster')[0]['src']
            node['image'] = img
            graph.push(node)
            print(f"Updated {node['name']}")
    except (KeyboardInterrupt):
        print("Exiting manually")
        trans.commit()
        sys.exit()
    except Exception as e:
        print(e)
        node['image'] = ''
        graph.push(node)
        print(f"Skipping {node['name']}")

trans.commit()
