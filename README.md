# Langchain Neo4j Graph RAG movie search

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)]()
[![Maintaner](https://img.shields.io/static/v1?label=Oleksandr%20Samoilenko&message=Maintainer&color=red)](mailto:oleksandr.samoilenko@extrawest.com)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)]()
![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)
![GitHub release](https://img.shields.io/badge/release-v1.0.0-blue)

## PROJECT INFO


**A cutting-edge movie database application powered by AI, developed using Node.js, and Neo4j. The application leverages LangChain4j to support natural language queries, enabling users to receive personalized recommendations, explore interactive graph visualizations, and dynamically navigate data. With an intuitive interface, users can easily discover movies, actors, genres, and directors. Designed with scalable architecture and strong security, the platform offers a seamless, engaging, and highly personalized movie discovery experience.**

## Features

- Neo4j database
- OpenAI gpt-3.5-turbo
- LangChain

## Preview
1. Query example:
```bash
MATCH p=()-[:IN_GENRE]->() RETURN p LIMIT 25;
```

![visualisation](https://github.com/user-attachments/assets/ff43f358-f520-47aa-b67a-dff2032e7948)

2. Demo
   



https://github.com/user-attachments/assets/9a5deb13-f4cf-4f25-a8d0-aac8419d4752





## Installing:

**1. Clone this repo to your folder:**

```
git clone https://gitlab.extrawest.com/i-training/flutter/hybrid-search-and-graphdb-rag
```

**2. Change current directory to the cloned folder:**

```
cd hybrid-search-and-graphdb-rag
```

**3. Install dependencies:**

```
npm install
```

**4. add .env file:**


In the root of the project file create .env file and add the following variables:**

```
NEO4J_URI = "YOUR_NEO4J_DATABASE_URI"
NEO4J_USER = 'YOUR_NEO4J_DATABASE_NAME' //usaualy neo4j
NEO4J_PASSWORD = "YOUR_NEO4J_DATABASE_PASSWORD" 
OPENAI_API_KEY = "YOUR_OPENAI_API_KEY" 
```

**3. Upload Dataset to Neo4j:**
run `upload_graphs.js` file in the root of the project. The data will be uploaded to Neo4j

**4. Search movies:**
To start server, just run `node index.js`.

Now you can use the app

Created by Oleksandr Samoilenko

[Extrawest.com](https://www.extrawest.com), 2024

