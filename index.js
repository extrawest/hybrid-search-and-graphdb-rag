import 'neo4j-driver';
import { Neo4jGraph } from '@langchain/community/graphs/neo4j_graph';
import { GraphCypherQAChain } from '@langchain/community/chains/graph_qa/cypher';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import readline from 'readline';
import { promisify } from 'util';

import dotenv from 'dotenv';
dotenv.config();

const url = process.env.NEO4J_URI;
const username = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;
const openAiKey = process.env.OPENAI_API_KEY;
const graph = await Neo4jGraph.initialize({ url, username, password });

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Promisify the question method
const question = (query) =>
    new Promise((resolve) => rl.question(query, resolve));

// Define examples for the prompt
const examples = [
    {
        question: 'Find actors who have acted in multiple movies',
        query: 'MATCH (p:Person)-[:ACTED_IN]->(m:Movie) WITH p, COUNT(DISTINCT m) AS movie_count WHERE movie_count > 1 RETURN p.name, movie_count ORDER BY movie_count DESC',
    },
    {
        question: 'What are the top 5 highest-rated movies?',
        query: 'MATCH (m:Movie) RETURN m.title, m.imdbRating ORDER BY m.imdbRating DESC LIMIT 5',
    },
];

// Format examples for the prompt template
const formattedExamples = examples
    .map((ex) => `Question: ${ex.question}\nCypher Query: ${ex.query}`)
    .join('\n\n');

// Create the prompt template
const cypherPrompt = new PromptTemplate({
    inputVariables: ['schema', 'question'],
    template: `You are a Neo4j expert. Given an input question, create a syntactically very accurate Cypher query based on the following examples:

${formattedExamples}

Schema:
{schema}

Question: {question}
Cypher Query:`,
});

// Initialize the LLM
const llm = new ChatOpenAI({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    apiKey: openAiKey,
});
const schema = await graph.getSchema();

// Create the GraphCypher QA Chain with the new prompt template
const chain = GraphCypherQAChain.fromLLM({
    llm,
    graph,
    cypherPrompt,
    returnIntermediateSteps: true,
});

async function chat() {
    console.log('Welcome to the Neo4j Query Chat!');
    console.log("Type your questions or 'exit' to quit.");

    while (true) {
        const userInput = await question('\nYour question: ');

        if (userInput.toLowerCase() === 'exit') {
            console.log('Thank you for using Neo4j Query Chat. Goodbye!');
            rl.close();
            break;
        }

        try {
            const response = await chain.invoke({
                query: userInput,
                schema: schema,
                cypherPrompt: cypherPrompt,
            });
            console.log('\nSchema:');
            console.log(schema);
            console.log('\nResponse:');
            console.log('\nQuestion');
            console.log(userInput);

            console.log('\nOutput:');
            if (
                response.intermediateSteps &&
                response.intermediateSteps.length > 0
            ) {
                const queryStep = response.intermediateSteps.find(
                    (step) => step.query
                );
                if (queryStep) {
                    console.log('Generated Cypher:');
                    console.log(queryStep.query);
                }

                const contextStep = response.intermediateSteps.find(
                    (step) => step.context
                );
                if (contextStep) {
                    console.log('\nContext:');
                    console.log(JSON.stringify(contextStep.context, null, 2));
                }
            }

            console.log('\nAnswer:');
            console.log(response.result);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
}

async function main() {
    const schema = await graph.getSchema();
    await chat();
}

main();
