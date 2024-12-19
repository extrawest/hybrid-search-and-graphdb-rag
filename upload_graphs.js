import 'neo4j-driver';
import { Neo4jGraph } from '@langchain/community/graphs/neo4j_graph';

import dotenv from 'dotenv';
dotenv.config();

const url = process.env.NEO4J_URI;
const username = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;
const openAiKey = process.env.OPENAI_API_KEY;

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
        var driver = neo4j.driver(url, neo4j.auth.basic(username, password));
        const serverInfo = await driver.getServerInfo();
        const result = await session.run(cypher);

        console.log('Connection established');
        console.log(serverInfo);
    } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`);
    }
}

importMovies();
