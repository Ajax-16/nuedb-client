#!/usr/bin/env node
import { program } from 'commander';
import { processFile } from './components/file.cli.js';
import { processConsole } from './components/console.cli.js';
import chalk from 'chalk';

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

console.log(chalk.blue.bold(`
////////////////////////////////////////////////////////////////////////
//                                                                    //
//   ___     ___  ___  __   _____________        _____  _     _____   //
//  / _ \\   |_  |/ _ \\ \\ \\ / /  _  \\ ___ \\      /  __ \\| |   |_   _|  //
// / /_\\ \\    | / /_\\ \\ \\ V /| | | | |_/ /______| /  \\/| |     | |    //
// |  _  |    | |  _  | /   \\| | | | ___ \\______| |    | |     | |    //
// | | | |/\\__/ / | | |/ /^\\ \\ |/ /| |_/ /      | \\__/\\| |_____| |_   //
// \\_| |_/\\____/\\_| |_/\\/   \\/___/ \\____/        \\____/\\_____/\\___/   //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                Copyright © 2024. All rights reserved.`));

console.log(`
# Welcome to AjaxDB-cli. Please enter the documentation here if you want to
# know about AjaxDB command syntax and functionalities -> https://ajaxdb.org/docs
`)

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