import driver from './driver';

const resolvers = {
  Query: {
    movie(_, params) {
      if (params.id === undefined || params.id === '') return null;
      let session = driver.session();
      let query = "MATCH (m:Movie) WHERE m.id = $id RETURN m"
      return session.run(query, params)
        .then(res => res.records[0].get('m').properties);
    },
    movies(parent, params) {
      let session = driver.session();
      let query = "MATCH (m:Movie) RETURN m SKIP $offset LIMIT $limit";
      return session.run(query, params)
        .then(res => {
          try {
            return res.records.map(rec => rec.get('m').properties);
          }
          catch (e) {
            return [];
          }
        })
    },
    person(_, params) {
      if (params.id === undefined || params.id === '') return null;
      let session = driver.session();
      let query = "MATCH (p:Person) WHERE p.id = $id RETURN p"
      return session.run(query, params)
        .then(res => res.records[0].get('p').properties);
    },
    people(parent, params) {
      let session = driver.session();
      let query = "MATCH (p:Person) RETURN p SKIP $offset LIMIT $limit";
      return session.run(query, params)
        .then(res => res.records.map(rec => rec.get('p').properties));
    },
    genre(_, params) {
      if (params.id === undefined || params.id === '') return null;
      let session = driver.session();
      let query = "MATCH (g:Genre) WHERE g.id = $id RETURN g";
      return session.run(query, params)
        .then(res => res.records[0].get('g').properties);
    },
    genres(parent, params) {
      let session = driver.session();
      let query = "MATCH (g:Genre) RETURN g SKIP $offset LIMIT $limit";
      return session.run(query, params)
        .then(res => {
          try {
            return res.records.map(rec => rec.get('g').properties);
          }
          catch (e) {
            return [];
          }
        })
    }
  },

  Movie: {
    cast(parent, params) {
      let session = driver.session();
      params['id'] = parent.id;
      let query = "MATCH (m:Movie)-[:STARRED_IN]-(p:Person) WHERE m.id = $id RETURN p"
      return session.run(query, params)
        .then(res => res.records.map(rec => rec.get('p').properties));
    },
    director(parent, params) {
      let session = driver.session();
      params['id'] = parent.id;
      let query = "MATCH (m:Movie)-[:DIRECTED]-(p:Person) WHERE m.id = $id RETURN p"
      return session.run(query, params)
        .then(res => res.records.map(rec => rec.get('p').properties));
    },
    writer(parent, params) {
      let session = driver.session();
      params['id'] = parent.id;
      let query = "MATCH (m:Movie)-[:WROTE]-(p:Person) WHERE m.id = $id RETURN p"
      return session.run(query, params)
        .then(res => res.records.map(rec => rec.get('p').properties));
    },
    genres(parent, params) {
      let session = driver.session();
      params['id'] = parent.id;
      let query = "MATCH (m:Movie)-[:IN_GENRE]-(g:Genre) WHERE m.id = $id RETURN g"
      return session.run(query, params)
        .then(res => res.records.map(rec => rec.get('g').properties));
    },
    similar(parent, params) {
      let session = driver.session();
      params['id'] = parent.id;
      let query = "MATCH (m1:Movie)-[:SIMILAR_TO]-(m2:Movie) WHERE m1.id = $id RETURN m2"
      return session.run(query, params)
        .then(res => res.records.map(rec => rec.get('m2').properties));
    },
  },

  Person: {
    movies(_, params) {
      let session = driver.session();
      params['id'] = _.id;
      let offsetlimit = `SKIP $offset ${Boolean(params.limit) ? "LIMIT $limit" : ""}`
      let query = `
        MATCH (p:Person)-[:STARRED_IN]-(m:Movie) WHERE p.id = $id RETURN m ${offsetlimit}
        UNION
        MATCH (p:Person)-[:DIRECTED]-(m:Movie) WHERE p.id = $id RETURN m ${offsetlimit}
        UNION
        MATCH (p:Person)-[:WROTE]-(m:Movie) WHERE p.id = $id RETURN m ${offsetlimit}
      `;
      return session.run(query, params)
        .then(result => {
          if (!Boolean(params.limit)) params.limit = result.records.length;
          return result.records.slice(0, params.limit)
            .map(record => record.get("m").properties)
        });
    }
  },

  Genre: {
    movies(parent, params) {
      let session = driver.session();
      params['id'] = parent.id;
      let query = `
        MATCH (g:Genre)-[:IN_GENRE]-(m:Movie)
        WHERE g.id = $id
        RETURN m SKIP $offset LIMIT $limit
      `
      return session.run(query, params)
        .then(res => res.records.map(rec => rec.get('m').properties));
    }
  }
}

export default resolvers;
