// Global Dependencies
global.Config   = require('./conf/config.json');
global.Logger   = require('./library/Logger');
global.Colors   = require('colors');
global.readline = require('readline');
global.self     = this;
global.rl       = readline.createInterface(
  {
    input:  process.stdin,
    output: process.stdout
  }
);

Logger.print("Loading Dependencies...".green.dim);

// Start Logger
Logger.start();

// Error handling
process.on('uncaughtException', (error) => Logger.error(error));
