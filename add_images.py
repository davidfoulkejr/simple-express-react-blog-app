from py2neo import Graph, Node, Relationship
from bs4 import BeautifulSoup
import requests, json, sys

graph = Graph(password="fhdiGEN82&sk@PLD")
trans = graph.begin()

# For each movie, get the image src property
for node in graph.nodes.match("Movie"):
    if node['image'] is not None : continue
    try:
        html = requests.get(node['url']).content
        soup = BeautifulSoup(html, 'html.parser')
        img = soup.select('.poster')[0].select('img')[0]['src']
        node['image'] = img
        graph.push(node)
        print(f"Updated {node['title']}")
    except (KeyboardInterrupt):
        print("Exiting manually")
        trans.commit()
        sys.exit()
    except:
        print(f"Skipping {node['title']}")

trans.commit()
