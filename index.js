import net from 'net';
import { parseResponse } from './io/response.js';
import { createCommandsChunks } from './io/reqChunk.js';

export function serverHandShake(hostname, port) {
  return new Promise((resolve, reject) => {
    const PORT = port;
    const HOST = hostname;

    const client = new net.Socket();

    let success = false;

    client.connect(PORT, HOST, async () => {
      client.write('NUE\r\nHandShake = true\r\n\r\n');
      client.on('data', (data) => {
        const result = data.toString().replace('END_OF_RESPONSE', '');
          const resHeaders = parseResponse(result).headers;
          if(resHeaders["Status"] === 'OK') {
            success = true;
          }
        client.end();
      })
    })

    client.on('end', () => {
      if (success) {
        resolve(
          {
            success: true,
            message: 'Server hand shake succesfully done!'
          }
        )
      } else {
        resolve(
          {
            success: false,
            message: 'Server hand shake failed!'
          }
        )
      }

    })

    client.on('error', (err) => {
      console.error('Error:', err.message);
      reject(err);
    });

  })
}

export function connect(hostname, port, commands) {
  return new Promise((resolve, reject) => {
    const PORT = port;
    const HOST = hostname;
    let responses = []; // Array para almacenar todas las respuestas

    const client = new net.Socket();
    client.setMaxListeners(Infinity)

    client.connect(PORT, HOST, async () => {
      await processCommands();
      client.end();
    });

    client.on('error', (err) => {
      console.error('Error:', err.message);
      reject(err);
      client.end();
    });

    async function processCommands() {
      const commandsQueue = createCommandsChunks(commands);

      for (const command of commandsQueue) {
        try {
          // Eliminar el listener 'data' antes de enviar el comando
          client.removeAllListeners('data');
          const result = await sendCommand(undefined, command);
    
          // Agregar la respuesta al array de respuestas
          responses.push(result);
        } catch (error) {
          console.error('Error processing command:', error.message);
          // Agregar una respuesta vacía al array en caso de error
          responses.push('');
        }
      }
    
      resolve(responses);
      await sendCommand("Save = true", undefined);
    }

    function sendCommand(headers, command) {
      return new Promise((resolve, reject) => {
        let partialResult = '';
        const onData = (data) => {
          const result = data.toString();
    
          if (result.endsWith('END_OF_RESPONSE')) {
            try {
              partialResult += result.replace('END_OF_RESPONSE', '');
              const finalResult = parseResponse(partialResult);
              resolve(finalResult);
              partialResult = '';
            } catch (err) {
              console.error(err);
              client.end();
            }
          } else {
            partialResult += result;
          }
        };
    
        // Añadir el listener 'data'
        client.on('data', onData);
    
        // Escribir el comando al cliente
        if (headers && command) {
          client.write("NUE\r\n" + headers + "\r\n\r\n" + command);
        } else if (headers) {
          client.write('NUE\r\n' + headers + "\r\n\r\n");
        } else if (command) {
          client.write('NUE\r\n\r\n' + command);
        }
    
        // Manejar errores
        client.on('error', (err) => {
          console.error('Error:', err.message);
          reject(err);
          client.end();
        });
    
        // Limpieza de listeners
        client.once('end', () => {
          client.removeListener('data', onData); // Eliminar el listener 'data' una vez que la conexión termine
        });
      });
    }

  });
}
