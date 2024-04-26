import chalk from "chalk";
import CliTable3 from "cli-table3";

export function display(responses) {

    for (const response of responses) {
        
        for (const element of response.body) {
            
            const {headers} = response;
            const {Status} = headers;

            if (typeof element === 'string' && Status === "OK") {
                console.log(chalk.green.bold(element + "\n")); 
            }else if(typeof element === 'string' && Status === "ERROR"){
                console.log(chalk.red.bold(element + "\n")); 
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
        
                    cliTable.push([{ colSpan: headers.length, content: tableName[0] !== 'EXCEPTION ENCOUNTER' ? chalk.green.bold(tableName.toString().toUpperCase()) : chalk.red.bold(tableName.toString().toUpperCase()) }]); // Añadir nombre de la tabla con colSpan
                    
                    cliTable.push(headers.map(header => chalk.bold(header)));
        
                    for (let i = 2; i < element.length; i++) {
                        element[i] = element[i].map(value => value === null ? chalk.yellow('null') : value);
                        cliTable.push(element[i]);
                    }
    
                }
    
                console.log(cliTable.toString());
                console.log(''); // salto de línea
    
            }
    
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