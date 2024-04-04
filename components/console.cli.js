import inquirer from 'inquirer';
import connect from 'nuedb-client';
import { display } from './display.js';
import chalk from "chalk";

export async function processConsole(host, port, args) {
    console.log(chalk.blue.bold(`User Input Mode:\n`))
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
    let extCommand;

    if (!args) {
        extCommand = '';
    } else {
        try {
            extCommand = args.toString();
            const firstResult = await connect(host, port, extCommand);
            console.log(chalk.blue.bold.underline('\n- Results:\n'))
            display(firstResult);
        } catch (err) {
            if(err.code === 'ECONNREFUSED') {
                console.error(chalk.red("\nCouldn't connect to NueDB server. NUE Error Code: " + 100 + ".\nFor more information about error codes and possible solutions, please visit https://nuedb.org/docs/nue/error-codes\n"))
            }else {
                console.error(err);
            }
        }
    }

    do {
        extCommand = await getUserInput();
        if (extCommand.toUpperCase() !== 'EXIT') {
            try {
                const result = await connect(host, port, extCommand);
                console.log(chalk.blue.bold.underline('\n- Results:\n'))
                display(result);
            } catch (err) {
                if(err.code === 'ECONNREFUSED') {
                    console.error(chalk.red("\nCouldn't connect to NueDB server. NUE Error Code: " + 100 + ".\nFor more information about error codes and possible solutions, please visit https://nuedb.org/docs/nue/error-codes\n"))
                }else {
                    console.error(err);
                }
            }
        }
    } while (extCommand.toUpperCase() !== 'EXIT');


    console.log(chalk.blue.bold('\nBye! :)\n'));

}
