import { config } from "dotenv";

config({ path: '../.env' });
const CHUNK_SIZE = process.env.CHUNK_SIZE || 4096;
const BYTE_CHUNK_SIZE = process.env.BYTE_CHUNK_SIZE || 32768;

export const createCommandsChunks = (data) => {
    const splitCommands = data.split(';').map(command => command.trim()).filter(command => command !== '');
    let commandChunks = [];
    let currentChunkSize = 0;
    let currentCommandsCount = 0;
    let currentChunkCommands = [];

    for (let i = 0; i < splitCommands.length; i++) {
        const command = splitCommands[i];
        const commandSize = Buffer.byteLength(command, 'utf8');

        // Verificar si agregar este comando excederá el tamaño de bytes por chunk
        if (currentChunkSize + commandSize <= BYTE_CHUNK_SIZE && currentCommandsCount < CHUNK_SIZE) {
            currentChunkSize += commandSize;
            currentCommandsCount++;
            currentChunkCommands.push(command);
        } else {
            // Si agregar este comando excederá el límite, o ya tenemos suficientes comandos en el chunk,
            // agregamos el chunk actual a la lista y empezamos uno nuevo
            commandChunks.push(currentChunkCommands.join(';'));
            currentChunkCommands = [command];
            currentChunkSize = commandSize;
            currentCommandsCount = 1;
        }
    }

    // Agregar el último chunk si hay comandos restantes
    if (currentChunkCommands.length > 0) {
        commandChunks.push(currentChunkCommands.join(';'));
    }

    return commandChunks;
}