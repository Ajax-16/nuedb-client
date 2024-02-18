#!/usr/bin/env node
import { program } from 'commander';
import { processFile } from './components/file.cli.js';
import { processConsole } from './components/console.cli.js';

program.version('0.0.1');

program
  .option('-f, --file <filepath>', 'Specify the file to process')
  .option('-i, --input <command>', 'Specify the initial command to process');

program.parse(process.argv);

const options = program.opts();

if (options.file) {
  processFile(options.file)
    .then(() => {
      if (options.input) {
        return processConsole(options.input);
      } else {
        return processConsole();
      }
    })
    .catch(error => console.error(error));
} else if (options.input) {
  processConsole(options.input)
    .catch(error => console.error(error));
} else {
  processConsole()
    .catch(error => console.error(error));
}
