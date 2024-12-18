import 'neo4j-driver';
import { Neo4jGraph } from '@langchain/community/graphs/neo4j_graph';

// Neo4j connection details
const url = 'neo4j+s://34a2dfcd.databases.neo4j.io';
const username = 'neo4j';
const password = 'uLfdmvjZwe9l273lzAuWuQzK_Dw8hSnkO8jF2uNFyds';

// const password = 'neo4Jexample';
const cypher = `
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/tomasonjo/blog-datasets/main/movies/movies_small.csv' AS row
MERGE (m:Movie {movieId: toInteger(row.movieId)})
SET m.title = row.title,
    m.released = date(row.released),
    m.imdbRating = toFloat(row.imdbRating),
    m.genres = split(row.genres, '|')

FOREACH (director IN split(row.director, '|') |
    MERGE (p:Person {name: trim(director)})
    MERGE (p)-[:DIRECTED]->(m)
)

FOREACH (actor IN split(row.actors, '|') |
    MERGE (p:Person {name: trim(actor)})
    MERGE (p)-[:ACTED_IN]->(m)
)
`;

async function importMovies() {
    try {
        //driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
        var driver = neo4j.driver(url, neo4j.auth.basic(username, password));
        const serverInfo = await driver.getServerInfo();
        const result = await session.run(cypher);

        console.log('Connection established');
        console.log(serverInfo);
    } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`);
    } finally {
        // await session.close();
    }
    // await driver.close();
}

importMovies();
