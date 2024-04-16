import { serverHandShake } from "nuedb-client"
import chalk from "chalk";

export async function handShake(host, port) {

    console.log(chalk.blue(`Processing hand shake...\n`));
    const response = await serverHandShake(host, port);

    if (!response.success) {
        throw new Error(response.message);   
    }

    return response.message;

}