#!/usr/bin/env node

/**
 * Module dependencies.
 */
var version = require(__dirname + '/../package.json').version;
var program = require("commander");
var PageMaker = require('../src')


program
  .option('-t, --template <path|name>', 'the template to use')
  .option('-d, --datafile <path>', 'use a json file (e.g. package.json) as the base data')
  .option('-i, --infile <path>', 'the input markdown file - stdin is default')
  .option('-o, --outfile <path>', 'the output HTML file - stdout is default')
  .version(version)

program
  .command('convert [infile] [outfile]')
  .description('create a HTML page from a markdown input')
  .action(function(infile, outfile){

    var maker = new PageMaker({
      infile:infile || program.infile,
      outfile:outfile || program.outfile,
      template:program.template,
      datafile:program.datafile
    });

    maker.convert();
  })

// run help if the command is not known or they just type 'digger'
program
  .command('*')
  .action(function(command){
    console.log('makepages version ' + version + ' - \'makepages --help\' for more info');
  });

if(process.argv.length<=2){
  process.argv.push(['--help']);
}

program.parse(process.argv);