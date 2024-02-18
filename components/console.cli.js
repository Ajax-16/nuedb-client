import inquirer from 'inquirer';
import connect from 'ajaxdb-client';
import { display } from './display.js';
import chalk from "chalk";

export async function processConsole() {
    async function getUserInput() {
        const response = await inquirer.prompt([
            {
                type: 'input',
                name: 'command',
                message: 'Enter your query or type "EXIT" to exit:',
            },
        ]);
        return response.command.trim();
    }

    let extCommand = '';

    do {
        extCommand = await getUserInput();
        if (extCommand.toUpperCase() !== 'EXIT') {
                const result = await connect('localhost', 3000, extCommand);
                console.log(chalk.blue.bold('\nResults:\n'))
                display(result);
        }
    } while (extCommand.toUpperCase() !== 'EXIT');

    console.log(chalk.blue.bold('\nBye! :)\n'));

}
