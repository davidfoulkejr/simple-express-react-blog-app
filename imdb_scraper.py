#!/usr/bin/env python
# coding: utf-8
import requests, ssl, re, sys, string
from bs4 import BeautifulSoup
from py2neo import Graph, Node, Relationship, NodeMatcher

# root_url = "https://www.imdb.com/title/tt5013056/?ref_=nv_sr_1"
# root_url = "https://www.imdb.com/title/tt3659388/?ref_=tt_rec_tt" # The Martian

class Movie:
    def __init__(self, url):
        self.url = url
        self.image = ''
        self.title = ''
        self.year = ''
        self.genres = []
        self.rating = ''
        self.duration = ''
        self.summary = ''
        self.director = ''
        self.writer = ''
        self.cast = []
        self.imdb_score = 0.0
        self.rt_critic_score = 0
        self.rt_audience_score = 0
        self.more_like_this = []

    def __repr__(self):
        return "{} ({})".format(self.title, self.year)
    def __str__(self):
        return "{} ({})".format(self.title, self.year)

def collect_movie_info(root_url):
    def get_soup(movie_url):
        try:
            html = requests.get(movie_url).content
            soup = BeautifulSoup(html, 'html.parser')
            return soup
        except:
            return None

    # Get HTML parser object
    soup = get_soup(root_url)
    if not soup:
        print("Exiting at {}".format(root_url))
        sys.exit()

    # If successful, create Movie object
    movie = Movie(root_url)
    try:
        title, year = re.match("(?P<title>.+) \((?P<year>\d+)\) - IMDb", soup.title.text).group('title', 'year')
        movie.title = title
        movie.year = year
    except:
        print("Failed to parse title: {}".format(soup.title.text))

    print("Getting {movie}".format(movie=movie))

    # Get image for movie poster
    try:
        img = soup.select('.poster')[0].select('img')[0]['src']
        movie.image = img
    except:
        print("Failed to get image for {}".format(movie))

    # Get HTML element referring to movie headline
    movie_header = soup.select('.title_wrapper')[0]

    # Get rating
    info = movie_header.select('div.subtext')[0]
    movie.rating = info.contents[0].strip()

    # Get duration
    time_tag = info.find('time')

    try:
        duration = re.match("PT(?P<duration>\d+)M", time_tag['datetime']).group('duration')
        movie.duration = duration
    except:
        print("Failed getting duration")

    # Get genres
    for tag in movie_header.find_all('a'):
        if '?genres=' in tag['href']:
            movie.genres.append(tag.text.strip())

    # Get HTML element referring to movie details
    movie_details = soup.select('.plot_summary')[0]

    # Get summary
    movie.summary = movie_details.select('div.summary_text')[0].text.strip()

    # Get other details
    details = movie_details.find_all('div')[1:]
    for item in details:
        if 'Director' in item.h4.text:
            director_links = [link for link in item.find_all('a')]
            directors = [{"name": director.text.strip(), "url": director['href']} for director in director_links]
            movie.director = directors
        elif 'Writer' in item.h4.text:
            writer_links = [link for link in item.find_all('a')]
            writers = [{"name": writer.text.strip(), "url": writer['href']} for writer in writer_links]
            movie.writer = writers
        elif 'Stars' in item.h4.text:
            cast_links = [link for link in item.find_all('a')[:-1]]
            cast = [{"name": actor.text.strip(), "url": actor['href']} for actor in cast_links]
            movie.cast = cast

    # Get IMDB score
    score_text = soup.select('div.imdbRating')[0].select('div.ratingValue')[0].text.strip()
    movie.imdb_score = score_text.split('/')[0]

    # Get Rotten Tomatoes page corresponding to movie
    def get_rt_page(movie):
        def verify_rt_page(soup, movie):
            try:
                rt_title, rt_year = re.match("(?P<title>.+) \((?P<year>\d+)\) - Rotten Tomatoes", soup.title.text).group('title', 'year')
                if rt_title != movie.title or rt_year != movie.year:
                    # print("RT page does not match for {}. RT says {} ({})".format(movie, rt_title, rt_year))
                    return False
                return True
            except:
                # print("RT page threw an error for {}".format(movie))
                return False

        no_punctuation = ''.join([ch for ch in movie.title if ch not in set(string.punctuation)])
        movie_slug = '_'.join(no_punctuation.split(' ')).lower()
        url = 'https://www.rottentomatoes.com/m/{}'.format(movie_slug)

        rt_soup = get_soup(url)
        if rt_soup:
            if not verify_rt_page(soup, movie):
                url_with_year = '{}_{}'.format(url, movie.year)
                rt_soup = get_soup(url)
                if not verify_rt_page(soup, movie):
                    # print("Couldn't find Rotten Tomatoes Score for {}".format(movie))
                    # print("Tried {} and {}".format(url.split('/')[-1], url_with_year.split('/')[-1]))
                    return None

            return rt_soup
        else:
            print("Error getting soup for {}".format(movie))
            print("Slug: {}".format(movie_slug))
            return None

    rt_soup = get_rt_page(movie)
    if rt_soup:
        movie.rt_critic_score = rt_soup.select('.critic-score')[0].text.strip()[:-1]
        movie.rt_audience_score = rt_soup.select('.audience-score')[0].text.strip().split('\n')[0][:-1]

    try:
        more_like_this = soup.select('#titleRecs')[0].select('.rec_item')
        movie.more_like_this = ['https://www.imdb.com{}'.format(item.find('a')['href']) for item in more_like_this]
    except:
        movie.more_like_this = []

    return movie


def get_related_movies(movie):
    return [collect_movie_info(url) for url in movie.more_like_this]


def add_movie(graph, movie):
    transaction = graph.begin()
    matcher = NodeMatcher(graph)

    movie_obj = {}
    for k,v in vars(movie).items():
        if type(v) == str:
            movie_obj[k] = v

    movie_node = matcher.match("Movie", title=movie_obj['title'], year=movie_obj['year']).first()
    if movie_node is not None : return movie_node

    print("Adding {movie}".format(movie=str(movie)))
    movie_node = Node("Movie", **movie_obj)
    movie_node['id'] = str(uuid.uuid4())
    transaction.create(movie_node)
    transaction.commit()
    transaction = graph.begin()

    if movie.genres and type(movie.genres) == list:
        for g in movie.genres:
            genre = matcher.match("Genre", title=g).first()
            if genre is None:
                genre = Node("Genre", title=g, id=uuid.uuid4())
                transaction.create(genre)

            rel = Relationship(movie_node, "IN_GENRE", genre)
            transaction.create(rel)
            transaction.commit()
            transaction = graph.begin()

    if movie.director and type(movie.director) == list:
        for d in movie.director:
            if 'more credit' in d['name'] : continue

            director = matcher.match("Person", name=d['name']).first()
            if director is None:
                director = Node("Person", **d, id=uuid.uuid4())
                transaction.create(director)

            rel = Relationship(director, "DIRECTED", movie_node)
            transaction.create(rel)
            transaction.commit()
            transaction = graph.begin()

    if movie.writer and type(movie.writer) == list:
        for w in movie.writer:
            if 'more credit' in w['name'] : continue

            writer = matcher.match("Person", name=w['name']).first()
            if writer is None:
                writer = Node("Person", **w, id=uuid.uuid4())
                transaction.create(writer)

            rel = Relationship(writer, "WROTE", movie_node)
            transaction.create(rel)
            transaction.commit()
            transaction = graph.begin()

    if movie.cast and type(movie.cast) == list:
        for a in movie.cast:
            if 'more credit' in a['name'] : continue

            actor = matcher.match("Person", name=a['name']).first()
            if actor is None:
                actor = Node("Person", **a, id=uuid.uuid4())
                transaction.create(actor)

            rel = Relationship(actor, "STARRED_IN", movie_node)
            transaction.create(rel)
            transaction.commit()
            transaction = graph.begin()

    return movie_node
