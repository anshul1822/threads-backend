import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import BodyParser  from 'body-parser';
import cors from 'cors';
import { prismaClient } from './lib/db';
import { createGraphqlApolloServer } from './graphql';
import UserService from './services/user';

async function startServer(){

    const app = express();
    const PORT = Number(process.env.PORT || 8000);

//     const server = new ApolloServer({
//         typeDefs: `
//             type Posts{
//                     id : ID!,
//                     name : String!
//             }
//             type Query{
//                 getPosts : [Posts]
//             }

//             type Mutation {
//                 createUser(firstName : String!, lastName : String!, email : String!, password : String!) : Boolean 
//             }
//         `,
//         resolvers : {
//             Mutation : {
//                 createUser : async( _ , 
//                     {firstName, lastName, email, password} : 
//                     {firstName : string, lastName : string, email : string, password : string}) => {
                        
//                         await prismaClient.user.create({
//                             data:{
//                                     firstName, lastName, email, password, salt : 'random_salt'
//                                 }
//                         });

//                         return true;
// }
//             },
//             Query : {
//                 getPosts : () => { 
//                     return [{
//                         id : 1,
//                         name : 'Post 1'
//                     }]
//                 }
//             }
//         }
//     });

//     await server.start();

    const apolloServer = await createGraphqlApolloServer();


    app.use(cors());
    app.use(BodyParser.json());



    app.use('/graphql', expressMiddleware(apolloServer, {
        //@ts-ignore
        context : async({req}) => {
            const token = req.headers['token'];
            
            try {
                const user = UserService.decodeToken(token as string);
                return {user}
            } catch (error) {
                return {};
            }
        }
    })); 
   
    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and running' })
    })

     
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

startServer();

