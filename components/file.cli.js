import connect from 'ajaxdb-client';
import fs from 'fs';
import util from 'util';
import chalk from 'chalk';
import { display } from './display.js';

const readFileAsync = util.promisify(fs.readFile); 

export async function processFile(host, port, filePath) {
    try {
        const jsdbFile = await readFileAsync(filePath, 'utf-8');
        const result = await connect(host, port, jsdbFile);
        console.log(chalk.blue.bold.underline('\n- Results:\n'))
        display(result);
    } catch (err) {
        console.error('Error reading or connecting:', err.message);
    }
        
}