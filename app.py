from flask import Flask, render_template, request, jsonify
import psycopg2
from neo4j import GraphDatabase
from .config import POSTGRES, NEO4J

app = Flask(__name__)

# Set up PostgreSQL connection
def get_pg_connection():
    conn = psycopg2.connect(
        host=POSTGRES['host'],
        port=POSTGRES['port'],
        database=POSTGRES['database'],
        user=POSTGRES['user'],
        password=POSTGRES['password']
    )
    return conn

# Set up Neo4j connection
neo4j_driver = GraphDatabase.driver(
    NEO4J['uri'],
    auth=(NEO4J['user'], NEO4J['password'])
)

@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
