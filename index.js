// Global Dependencies
global.Config   = require('./conf/config.json');
global.Logger   = require('./library/Logger');
global.Colors   = require('colors');
global.readline = require('readline');
global.mysql    = require('mysql');
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

// MySQL stuff
if (Config.Server.isDev === true)
{
   var unm = 'root';
   var pwd = '';
}
else
{
   var unm = Config.Database.U;
   var pwd = Config.Database.P;
}

var connect = mysql.createConnection(
  {
    host: 'localhost',
    user: unm,
    password: pwd,
    database: 'aqw'
  }
);

// Error handling
process.on('uncaughtException', (error) => Logger.error(error));
