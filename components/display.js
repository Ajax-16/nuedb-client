import chalk from "chalk";
import CliTable3 from "cli-table3";

export function display(result) {

    for (const element of result) {

        if (typeof element === 'string') {
            console.log(chalk.green.bold(element + "\n")); 

        }else if(typeof element === 'boolean') {

            element ? console.log(chalk.green.bold('command execution succeed!\n')) : console.log(chalk.yellow.bold('command execution didn\'t make any changes!\n'));

        }else if (Array.isArray(element)) {

            const cliTable = new CliTable3();

            if(!isBidemensional(element)){

                const titleRow = element.map(item => chalk.green.bold(item.toString().toUpperCase()));
                cliTable.push(titleRow);

            }else{

                const tableName = element[0]; // Obtener el nombre de la tabla
                const headers = element[1]; // Obtener los encabezados
    
                cliTable.push([{ colSpan: headers.length, content: chalk.green.bold(tableName.toString().toUpperCase()) }]); // Añadir nombre de la tabla con colSpan
                
                cliTable.push(headers.map(header => chalk.bold(header)));
    
                for (let i = 2; i < element.length; i++) {
                    cliTable.push(element[i]);
                }

            }

            console.log(cliTable.toString());
            console.log(''); // salto de línea

        } else if (typeof element === 'object') {
            console.log(chalk.red.bold("Error: " + element.error + "\n"));
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