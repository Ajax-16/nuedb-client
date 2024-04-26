import net from 'net';
import { parseResponseHeaders } from './response.js';

export function serverHandShake(hostname, port) {
  return new Promise((resolve, reject) => {
    const PORT = port;
    const HOST = hostname;

    const client = new net.Socket();

    let response = false;

    client.connect(PORT, HOST, async () => {
      client.write('NUE\r\n\r\nClient Hello');
      client.on('data', (data) => {
        if (data.toString() === 'Server Hello') {
          response = true
        }
        client.end();
      })
    })

    client.on('end', () => {
      if (response) {
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
      const commandsQueue = commands.split(';').map(command => command.trim()).filter(command => command); // Filtrar comandos vacíos

      for (const command of commandsQueue) {
        try {
          const result = await sendCommand(undefined, command);
          // Agregar la respuesta al array de respuestas
          responses.push(result);
        } catch (error) {
          console.error('Error processing command:', error.message);
          // Agregar una respuesta vacía al array en caso de error
          responses.push('');
        }
      }
      await sendCommand("Save = true", undefined);
    }

    function sendCommand(headers, command) {
      return new Promise((resolve, reject) => {
        let partialResult = ''; // Variable para almacenar el fragmento de la respuesta
        if(headers && command) {
          client.write("NUE\r\n" + headers + "\r\n\r\n" + command)
        }else if(headers){
          client.write('NUE\r\n' + headers +  "\r\n\r\n");
        }else if (command) {
          client.write('NUE\r\n\r\n' + command);
        }
        
        client.on('data', (data) => {
          const result = data.toString();

          // Comprueba si se ha recibido la marca de fin de respuesta
          if (result.includes('END_OF_RESPONSE')) {

            try {
              // Concatena todos los chunks de respuesta sin la marca de fin de respuesta
              partialResult += result.replace('END_OF_RESPONSE', '');
              let [headers, body] = partialResult.split("\r\n\r\n");
              [,...headers] = headers.split("\r\n");

              headers = parseResponseHeaders(headers);
              if(body) {
                body = JSON.parse(body);
              }
              // Resuelve la promesa con la respuesta completa
              
              resolve({headers, body})
              // Limpia partialResult para la próxima respuesta ya que al mandarse varios paquetes, este evento se va a reproducir varias veces
              partialResult = '';
            } catch (err) {
              console.error(err)
              client.end();
            }

          } else {
            // Concatena el chunk de respuesta al partialResult
            partialResult += result;
          }
        });

        client.on('end', ()=>{

        })

      });
    }

  });
}
