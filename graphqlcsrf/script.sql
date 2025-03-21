USE graphql_api;
CREATE TABLE api_keys (
    api_key VARCHAR(255) PRIMARY KEY,
    is_admin BOOLEAN DEFAULT FALSE
);
