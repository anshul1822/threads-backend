import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import BodyParser  from 'body-parser';
import cors from 'cors';


async function startServer(){

    const app = express();
    const PORT = Number(process.env.PORT || 8000);

    const server = new ApolloServer({
        typeDefs: `
            type Posts{
                    id : ID!,
                    name : String!
            }
            type Query{
                getPosts : [Posts]
            }
        `,
        resolvers : {
            Query : {
                getPosts : () => { 
                    return [{
                        id : 1,
                        name : 'Post 1'
                    }]
                }
            }
        }
    });

    await server.start();

    app.use(cors());
    app.use(BodyParser.json());
    app.use('/graphql', expressMiddleware(server)); 
   
    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and running' })
    })

     
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

startServer();

