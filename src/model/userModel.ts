import { Request, Response } from 'express';

import { execute } from '../data/database';


export const getUserData = async (id: String): Promise<Number> => {

    try{
        return Number(await execute(`SELECT * FROM user WHERE id=${id}`))
        
    }catch(err){
        console.error(err);
        return -1;
    }

}
