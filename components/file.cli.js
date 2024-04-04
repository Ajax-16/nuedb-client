import connect from 'nuedb-client';
import fs from 'fs';
import util from 'util';
import chalk from 'chalk';
import { display } from './display.js';

const readFileAsync = util.promisify(fs.readFile); 

export async function processFile(host, port, filePath) {

    // TO-DO -> ASEGURARSE DE QUE LA EXTENSIÓN DEL ARCHIVO ENTRATE ES .nue

    console.log(chalk.blue(`File Input Mode:\n`))
    try {
        const jsdbFile = await readFileAsync(filePath, 'utf-8');
        const result = await connect(host, port, jsdbFile);
        console.log(chalk.blue.bold.underline('\n- Results:\n'))
        display(result);
    } catch (err) {
        if(err.code === 'ECONNREFUSED') {
            console.error(chalk.red("Couldn't connect to NueDB server. NUE Error Code: " + 100 + ".\nFor more information about error codes and possible solutions, please visit https://nuedb.org/docs/nue/error-codes\n"))
        }else {
            console.error(err);
        }
    }
        
}