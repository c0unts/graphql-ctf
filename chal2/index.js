const PORT = process.env.PORT || 4001
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(express.urlencoded({ extended: true })); // Handle form submissions

const schema = buildSchema(`
  type Query {
    checkStatus: String
  },
  type Mutation {
    revealFlag: String
  }
`);

const root = {
  checkStatus: (args, req) => {
    return req.cookies.auth ? "Access Granted" : "Unauthorized";
  },
  revealFlag: (args, req) => {
    if (req.cookies.auth === "admin") {
      return "RS{F0RGE_THIS_C00KIE_ALI3NS!}";
    }
    throw new Error("Unauthorized");
  }
};

// Fake login (sets a cookie)
app.post("/login", (req, res) => {
  res.cookie("auth", "admin", { httpOnly: true });
  res.send("Logged in as Admin. Now try making a request!");
});

// Vulnerable GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema: schema,
    rootValue: root,
    graphiql: false,
    context: req
  }))
);

app.listen(PORT, () => {
});
