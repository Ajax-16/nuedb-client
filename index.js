import connect from './client.js';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    async function getUserInput() {
        const command = await new Promise(resolve => {
            rl.question('Enter your command or type "EXIT" to exit: ', resolve);
        });
        return command.trim();
    }

    let extCommand = '';

    do {
        extCommand = await getUserInput();
        if (extCommand.toUpperCase() !== 'EXIT') {
            const result = await connect('localhost', 3000, extCommand);
            console.log(result);
        }
    } while (extCommand.toUpperCase() !== 'EXIT');

    rl.close();
}

main();