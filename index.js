#!/usr/bin/env node
import { program } from 'commander';
import { processFile } from './components/file.cli.js';
import { processConsole } from './components/console.cli.js';

program.version('0.0.1');

let defaultPort = 3000;
let defaultHost = 'localhost';

let port = defaultPort
let host = defaultHost

program
  .option('-f, --file <filepath>', 'Specify the file to process')
  .option('-i, --input <command>', 'Specify the initial command to process')
  .option('-p, --port <port>', 'Specify the port')
  .option('-H, --host <hostname>', 'Specify the hostname');

program.parse(process.argv);

const options = program.opts();

port = options.port ? options.port : port;
host = options.host ? options.host : host;

if (options.file) {
  processFile(host, port, options.file)
    .then(() => {
      if (options.input) {
        return processConsole(host, port, options.input);
      } else {
        return processConsole(host, port);
      }
    })
    .catch(error => console.error(error));
} else if (options.input) {
  processConsole(host, port, options.input)
    .catch(error => console.error(error));
} else {
  processConsole(host, port)
    .catch(error => console.error(error));
}