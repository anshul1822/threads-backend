import UserService, { createUserPayload, loginUserPayload } from '../../services/user';

export const query = {

    loginUser : async(_ : any, payload : loginUserPayload) => {
        const res = await UserService.loginUser(payload);
        return res;
    },

    getLoggedInUser : async(_ : any, payload : any, context : any) => {

        if(context && context.user){
            const res = await UserService.getUserById(context.user.id);
            return res; 
        }
        throw new Error("User not logged in");
    }
}

export const mutation = 
{
    createUser : async( _ : any , payload : createUserPayload) => {
        const res = await UserService.createUser(payload);
        return res.id;
    }
}


export const resolvers = {query, mutation};
