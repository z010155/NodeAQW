const os = require('os');
const gameloop = require('node-gameloop');
const CommandHandler = require('../library/CommandHandler');
const Instance = require('./constructs/Instance');

class MainServer
{
    /*
    Initializes a new instance of the MainServer class
    */

    constructor(sqlconn)
    {
        // MySQL
        this.mysql = sqlconn;

        // Server Variables
        this.id = 0;
        this.tick = 0;
        this.extraTick = 0;
        this.clients = [];

        // Other
        Logger.print(`NodeJS AQW Server <Build ${Config.Version}>`.green.bold);

        // Generate Handlers
        Logger.debug(`Creating handlers...`);
        this.generateHandlers();
    }

    generateInstances()
    {
      var max = Config.Instances.max;
      var maps = Config.Instances.maps;
      var count = 0;

      for (var i = 0; i < maps.length; i++)
      {
        var mapObject = maps[i];
        var mapName = mapObject.id;
        var mapType = mapObject.type;

        for (var j = 0; j < max; j++)
        {
          var id = `${count+i}`;
          count++;

          this[`${mapName}-${mapType}-${id}`] = new Instance(id, mapName, 'map', mapType, this.mysql)
          // TODO: Add dynamic instance types, currently hardset to maps
        }
      }
    }

    generateHandlers()
    {
      this.cmdHdnler = new CommandHandler(this);
      Logger.debug(`Command Handler created!`);

    }

    /*
    Starts the server
    */

    start()
    {
        var self = this;

        // Logger
        Logger.prompt(this.cmdHdnler.handleCommand.bind(this.cmdHdnler), Config.Logger.Prompt);

        // Good solution for minimal CPU usage
        this.loop = gameloop.setGameLoop(this.gameLoop.bind(this), Config.Server.Tick);

        // System info debug
        Logger.info(`OS: ${os.platform()}`);
        Logger.info(`CPU: ${os.cpus()[0]["model"]}`);

        Logger.info(`Gameloop running at ${Config.Server.Tick} ms/tick`);

        Logger.info(`Took ${process.uptime()} seconds to start`);
        Logger.info(`Type 'help' or '?' for commands \n`)

        this.mysql.on('error',
        function()
            {
                console.log('MySQL error!');
            }
        );

        this.mysql.connect(
            function(err)
            {
                if (err)
                {
                    Logger.error(`Error connecting to MySQL server, disconnected client ${self.id}!`);
                }
                else
                {
                    Logger.info(`Connection ${self.id} open with MySQL thread ID: ${self.mysql.threadId}`);
                    self.onConnect();
                }
            }
        );
    }

    onConnect()
    {
        var self = this;

        Logger.debug(`Main Server connected!`);

        /* TODO: prototype internal server event\io system
        this.on('event',
        () =>
            {
                // event handler
            }
        );
        */

        // Generate Instances
        Logger.debug(`Creating instances...`);
        this.generateInstances();
    }

    sendAnnouncement(message)
    {
      // TODO: broadcast {message} to all users
      Logger.debug(`Sent ${message} to all users in all instances!`);
    }

    gameLoop(delta)
    {
        if (this.tick >= 10)
        {
            this.tick = 0;
        }

        this.tick++;
    }

    /*
    Returns the next available connection ID.
    */
    getNextID()
    {
        if (this.id >= Number.MAX_SAFE_INTEGER - 1)
        {
            this.id = 0;
        }

        return this.id++;
    }
}

module.exports = MainServer;
