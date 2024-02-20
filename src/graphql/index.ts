import {ApolloServer} from '@apollo/server';
import { User } from './user';

export async function createGraphqlApolloServer(){

    const server = new ApolloServer({
        typeDefs: `
            ${User.typeDefs}
            
            type Query{
                ${User.query}
            }

            type Mutation {
                ${User.mutation}
            }
        `,
        resolvers : {
            Mutation : {
                ...User.resolvers.mutation
            },
            Query : {
                ...User.resolvers.query
            }
        }
    });

    await server.start();

    return server;
}