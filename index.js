// Global Dependencies
global.Config   = require('./conf/config.json');
global.Logger   = require('./library/Logger');
global.Colors   = require('colors');
global.readline = require('readline');
global.mysql    = require('mysql');
global.MainServer   = require('./server/MainServer')
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
   var db  = 'aqw';
}
else
{
   var unm = Config.Database.U;
   var pwd = Config.Database.P;
   var db  = Config.Database.T;
}

var sqlconn = mysql.createConnection(
  {
    host: 'localhost',
    user: unm,
    password: pwd,
    database: 'aqw'
  }
);

var server = new MainServer(sqlconn);
server.start();

// Error handling
process.on('uncaughtException', (error) => Logger.error(error));
