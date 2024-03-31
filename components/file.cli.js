import connect from 'ajaxdb-client';
import fs from 'fs';
import util from 'util';
import chalk from 'chalk';
import { display } from './display.js';

const readFileAsync = util.promisify(fs.readFile); 

export async function processFile(host, port, filePath) {
    console.log(chalk.blue(`File Input Mode:\n`))
    try {
        const jsdbFile = await readFileAsync(filePath, 'utf-8');
        const result = await connect(host, port, jsdbFile);
        console.log(chalk.blue.bold.underline('\n- Results:\n'))
        display(result);
    } catch (err) {
        if(err.code === 'ECONNREFUSED') {
            console.error(chalk.red("Couldn't connect to AjaxDB server. AJX Error Code: " + 100 + ".\nFor more information about error codes and possible solutions, please visit https://ajaxdb.org/docs/ajx/error-codes\n"))
        }else {
            console.error(err);
        }
    }
        
}