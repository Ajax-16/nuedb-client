import {config} from "dotenv"

config({path: './.env'})
const CHUNK_SIZE = process.env.CHUNK_SIZE;

const createChunk = (data) => {

    if(data.length <= CHUNK_SIZE){
        console.log(data)
    }

}

const command = "init tienda; INSERT INTO products (pokemon, 20); INSERT INTO products (pokemon, 20); FIND * IN products"

createChunk(command)