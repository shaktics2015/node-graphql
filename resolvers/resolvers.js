const { User } = require("../models");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const beersData = require("../beers");

const logger = require("../config/logger").getLogger("resolvers");
const {JWT_SECRET} = require("../config/constants");

const resolvers = {
    Query: {
        async current(_, args, { user }) {
            if (user) {
                return await User.findOne({ where: { id: user.id } });
            }
            throw new Error("Sorry, you're not an authenticated user!");
        },

        async beer(_, { id }, { user }) {
            logger.log("beer user: ", user);
            if (user) {
                return beersData.filter((beer) => beer.id == id)[0];
            }
            throw new Error("Sorry, you're not an authenticated user!");
        },
        
        async beers(_, { brand }, { user }) {
            logger.log("beers user: ", user);
            if (user) {
                return beersData.filter((beer) => beer.brand == brand);
            }
            throw new Error("Sorry, you're not an authenticated user!");
        },
    },

    Mutation: {
        async register(_, { login, password }) {
            const user = await User.create({
                login,
                password: await bcrypt.hash(password, 10),
            });

            return jsonwebtoken.sign({ id: user.id, login: user.login }, JWT_SECRET, {
                expiresIn: 60 * 1 // expires in 1 hours
            });
        },

        async login(_, { login, password }) {
            const user = await User.findOne({ where: { login } });

            if (!user) {
                throw new Error(
                    "This user doesn't exist. Please, make sure to type the right login."
                );
            }

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                throw new Error("You password is incorrect!");
            }

            return jsonwebtoken.sign({ id: user.id, login: user.login }, JWT_SECRET, {
                expiresIn: 60 * 24 // expires in 24 hours
            });
        },
    },
};

module.exports = resolvers;