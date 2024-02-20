import { createHmac, randomBytes } from "crypto";
import { prismaClient } from "../lib/db";
import jwt from "jsonwebtoken";

export interface createUserPayload{
    firstName : string;
    lastName : string;
    email : string;
    password : string;
}

export interface loginUserPayload{
    email : string;
    password : string;
}

const JWT_SECRET = 'b@tm@n_never_give_up';

export default class UserService {

    private static generateHashedPassword(password : string, salt : string){
        return createHmac("sha256", salt).update(password).digest("hex");
    }

    public static decodeToken(token : string){
        return jwt.verify(token, JWT_SECRET); 
    }

    public static getUserById(id : string){
        return prismaClient.user.findUnique({where : {id}});
    }

    public static createUser(payload : createUserPayload){

        const {firstName, lastName, email, password} = payload;
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = UserService.generateHashedPassword(password, salt);
    
        return prismaClient.user.create({
            data:{
                    firstName, lastName, email, password : hashedPassword, salt : salt
                }
        });
    }

    public static async loginUser(payload : loginUserPayload){
        const {email, password} = payload;

        const user = await prismaClient.user.findUnique({where : {email}});

        if(!user) 
            throw new Error("User not found");

        const hashedPassword = UserService.generateHashedPassword(password, user.salt);

        if(hashedPassword !== user.password)
            throw new Error("Invalid password");
      
        //Gen JWT Token
        const token = jwt.sign({id: user.id, email : user.email}, JWT_SECRET, {expiresIn : "1h"});
        return token;
    }
}

