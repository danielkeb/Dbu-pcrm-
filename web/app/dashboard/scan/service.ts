import { error } from "console";

const ROOTURL="http://localhost:3333/pcuser"

export const fetchUser=async (scannedId: string)=>{


    try{
        const response= await fetch(`${ROOTURL}/scanner?userId=${scannedId}`);
        if(!response.ok){

            const error= response.text();
            throw new Error(`user not found ${error}`);
        }
        const data = await response.json();
        return data;

    }catch{
        throw new Error('unable to access the api');
    }
};