import chalk from "chalk";
import CliTable3 from "cli-table3";

export function display(result) {

    for (const element of result) {
        const {body, headers} = element;
        const {Status} = headers;
        if (typeof body === 'string' && Status === "OK") {
            console.log(chalk.green.bold(body + "\n")); 
        }else if(typeof body === 'string' && Status === "ERROR"){
            console.log(chalk.red.bold(body + "\n")); 
        }else if(typeof body === 'boolean') {

            body ? console.log(chalk.green.bold('command execution succeed!\n')) : console.log(chalk.yellow.bold('command execution didn\'t make any changes!\n'));

        }else if (Array.isArray(body)) {

            const cliTable = new CliTable3();

            if(!isBidemensional(body)){

                const titleRow = body.map(item => chalk.green.bold(item.toString().toUpperCase()));
                cliTable.push(titleRow);

            }else{

                const tableName = body[0]; // Obtener el nombre de la tabla
                const headers = body[1]; // Obtener los encabezados
    
                cliTable.push([{ colSpan: headers.length, content: tableName[0] !== 'EXCEPTION ENCOUNTER' ? chalk.green.bold(tableName.toString().toUpperCase()) : chalk.red.bold(tableName.toString().toUpperCase()) }]); // Añadir nombre de la tabla con colSpan
                
                cliTable.push(headers.map(header => chalk.bold(header)));
    
                for (let i = 2; i < body.length; i++) {
                    body[i] = body[i].map(value => value === null ? chalk.yellow('null') : value);
                    cliTable.push(body[i]);
                }

            }

            console.log(cliTable.toString());
            console.log(''); // salto de línea

        }

    }

}

function isBidemensional(array) {

    for (let i = 0; i < array.length; i++) {
        if (Array.isArray(array[i])) {
            return true;
        }
    }

    return false;
}