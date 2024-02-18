import {ApolloServer} from '@apollo/server';
import { User } from './user';

export async function createGraphqlApolloServer(){

    const server = new ApolloServer({
        typeDefs: `
            type Posts{
                    id : ID!,
                    name : String!
            }
            type Query{
                getPosts : [Posts]
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