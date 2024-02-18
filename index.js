#!/usr/bin/env node
import { program } from 'commander';
import { processFile } from './components/file.cli.js';
import { processConsole } from './components/console.cli.js';

program.version('0.0.1');

program
  .option('-f, --file <filepath>', 'Specify the file to process');

program.action(() => {
  if (program.rawArgs[2] === '-f' || program.rawArgs[2] === '--file') {
    processFile(program.rawArgs[3]);
  } else {
    processConsole();
  }
});

program.parse(process.argv);