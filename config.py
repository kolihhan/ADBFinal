
import psycopg2
from neo4j import GraphDatabase

# Postgres DB
POSTGRES = {
    'host': 'localhost',
    'port': 5432,
    'database': 'finaladb',
    'user': 'postgres',
    'password': 'testXD12345' #Make Sure change to ur user/password
}

# Neo4J DB
NEO4J = {
    'uri': 'bolt://localhost:7687',
    'user': 'neo4j',
    'password': 'finaladb'
}


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


def execute_pg_query(query, params=None):
    conn =  get_pg_connection()
    cursor = conn.cursor()
    cursor.execute(query, params or ())
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results

def execute_neo4j_query(query, params=None):
    try:
        with neo4j_driver.session() as session:
            result = session.run(query, params or {})

            data = [record.data() for record in result]  
            return data
    except Exception as e:
        print(f"Neo4j Query Error: {e}")
        return []




def drop_all_constraints():

    with neo4j_driver.session() as session:
        # Get all constraints
        constraints = session.run("SHOW CONSTRAINTS").data()
        
        # Generate and execute DROP commands
        for constraint in constraints:
            constraint_name = constraint['name']
            session.run(f"DROP CONSTRAINT {constraint_name}")
        print("All constraints have been dropped.")
