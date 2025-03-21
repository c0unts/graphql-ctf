from ariadne.asgi import GraphQL
import uuid
import mysql.connector
from ariadne import graphql_sync, make_executable_schema, load_schema_from_path, ObjectType, QueryType, MutationType
from os import getenv

# MySQL database connection settings
username = getenv("DATABASE_USER")
password = getenv("DATABASE_PASSWORD")
host = getenv("DATABASE_HOST")
database = getenv("DATABASE_NAME")

# Create a connection to the MySQL database
cnx = mysql.connector.connect(
    user=username,
    password=password,
    host=host,
    database=database
)

# Create a cursor object to execute SQL queries
cursor = cnx.cursor()

# Define the GraphQL schema
type_defs = load_schema_from_path('schema.graphql')

# Define the resolvers for the GraphQL schema
query = QueryType()
mutation = MutationType()

@query.field("adminQuery")
def resolve_admin_query(*_, api_key):
    # Check if the API key exists and is an admin
    cursor.execute("SELECT api_key, is_admin FROM api_keys WHERE api_key = %s", (api_key,))
    result = cursor.fetchone()
    print(result)
    if result and result[1]:
        # Return a secret value if the API key is an admin
        return "Secret value for admins"
    else:
        # Return an error message if the API key is not an admin
        return "Error: API key is not an admin"

@mutation.field("makeAPIKey")
def resolve_make_api_key(*_):
    # Generate a new UUID for the API key
    new_api_key = str(uuid.uuid4())
    # Insert the new API key into the database
    cursor.execute("INSERT INTO api_keys (api_key) VALUES (%s)", (new_api_key,))
    cnx.commit()
    # Return the new API key
    return new_api_key

@mutation.field("makeUserAdmin")
def resolve_make_user_admin(*_, source_api_key, target_api_key):
    # Check if the source API key exists and is an admin
    cursor.execute("SELECT is_admin FROM api_keys WHERE api_key = %s", (source_api_key,))
    result = cursor.fetchone()
    if result and result[0]:
        # Update the target API key to be an admin
        cursor.execute("UPDATE api_keys SET is_admin = TRUE WHERE api_key = %s", (target_api_key,))
        cnx.commit()
        # Return a success message
        return "Target API key is now an admin"
    else:
        # Return an error message if the source API key is not an admin
        return "Error: Source API key is not an admin"

# Create the executable GraphQL schema
schema = make_executable_schema(type_defs, [query, mutation])

app = GraphQL(schema, debug=True)
