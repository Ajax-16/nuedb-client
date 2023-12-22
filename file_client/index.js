import connect from '../client.js';
import readline from 'readline';
import fs from 'fs';
import util from 'util';  // Importa el módulo 'util' para utilizar promisify

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const readFileAsync = util.promisify(fs.readFile);  // Convierte fs.readFile en una función que retorna una promesa

async function main() {
    async function getUserInput() {
        const jsdbFilePath = await new Promise(resolve => {
            rl.question('Enter the route to the file that you want to load: ', resolve);
        });
        return jsdbFilePath.trim();
    }

    let jsdbFilePath = '';

    do {
        jsdbFilePath = await getUserInput();
        if (jsdbFilePath.toUpperCase() !== 'EXIT') {
            try {
                const jsdbFile = await readFileAsync(jsdbFilePath, 'utf-8');
                const result = await connect('localhost', 3000, jsdbFile);
                console.log(result);
            } catch (err) {
                console.error('Error reading or connecting:', err.message);
            }
        }
    } while (jsdbFilePath.toUpperCase() !== 'EXIT');

    rl.close();
}

main();