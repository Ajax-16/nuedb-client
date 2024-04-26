import { config } from "dotenv";

config({ path: '../.env' });
const CHUNK_SIZE = process.env.CHUNK_SIZE || 4096; // Asegúrate de convertir el valor a entero

export const createCommandsChunks = (data) => {

    const splitCommands = data.split(';').map(command => command.trim()).filter(command => command !== '');
    let commandChunks = [];

    if (splitCommands.length <= CHUNK_SIZE) {
        commandChunks.push(splitCommands.join(';'));
        
    } else {
        for (let i = 0; i < splitCommands.length; i += CHUNK_SIZE) {
            const chunk = splitCommands.slice(i, i + CHUNK_SIZE).join(';'); // Unir los chunks antes de agregarlos
            commandChunks.push(chunk);
        }
    }

    return commandChunks
}
