const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const path = require("path");
const { buildSchema, GraphQLSchema, specifiedRules } = require("graphql");
const axios = require("axios");
const { NoSchemaIntrospectionCustomRule } = require("graphql");


const schema = buildSchema(`
  type Query {
    secretQuery: String
  }
`);

const root = {
  secretQuery: () => "RS{PR0B3_WA$_$UCC3$$FUL}"
};

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: false, // Enable GraphiQL for testing
    validationRules: [...specifiedRules, NoSchemaIntrospectionCustomRule]
  })
);

// Serve index.html as default page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/healthcheck", async (req, res) => {
  const GRAPHQL_URL = "http://localhost:4000/graphql";
  const QUERY = `{ secretQuery }`;

  try {
    const response = await axios.post(GRAPHQL_URL, {
      query: QUERY
    });

    // Check if the response contains the expected flag
    const expectedFlag = "CTF{GraphQL_Introspection_Win}";
    if (response.data.data.secretQuery === expectedFlag) {
      return res.status(200).send("successful");
    } else {
      return res.status(500).send("unsuccessful");
    }
  } catch (error) {
    return res.status(500).send("unsuccessful");
  }
});

app.listen(4000, () => {
  console.log("GraphQL CTF Challenge running at http://localhost:4000/graphql");
});
