import { prismaClient } from "../../lib/db";

export const query = {
    getPosts : () => { 
        return [{
            id : 1,
            name : 'Post 1'
        }]
    }
}

export const mutation = 
{
createUser : async( _ : any , 
    {firstName, lastName, email, password} : 
    {firstName : string, lastName : string, email : string, password : string}) => {
        
        await prismaClient.user.create({
            data:{
                    firstName, lastName, email, password, salt : 'random_salt'
                }
        });

        return true;
}
}


export const resolvers = {query, mutation};
