'use strict';

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("express-jwt");
const typeDefs = require("./schemas");
const resolvers = require("./resolvers/resolvers");
const { JWT_SECRET, PORT } = require("./config/constants");
const logger = require("./config/logger");
logger.level = "info";
const log = logger.getLogger("startup");
const chalk = require('chalk');

const app = express();
const auth = jwt({
    secret: JWT_SECRET,
    credentialsRequired: false,
    algorithms: ['sha1', 'RS256', 'HS256'],
});
app.use(auth);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
        endpoint: "/graphql",
        settings: {
            'editor.theme': 'light'
        },
    },
    context: ({ req }) => {
        const user = req.headers.user
            ? JSON.parse(req.headers.user)
            : req.user
                ? req.user
                : null;
        return { user };
    },
    // formatError: (err) => { 
    // //   if (err.message.startsWith('UnauthorizedError: ')) {
    //     return new Error('Internal server error');
    // //   } 
    // //   return err;
    // },
});
app.get('/public/hc', (req, res) => {
    res.send('OK');
});

server.applyMiddleware({ app });

const port = Number(process.env.PORT || PORT);
app.listen(port, () => {
    log.info(chalk.white.bgBlue.bold("The server started on port " + port));
});