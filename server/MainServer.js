const os = require('os');
const gameloop = require('node-gameloop');
const CommandHandler = require('../library/CommandHandler');

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

        // Generate Instances
        Logger.debug(`Creating instances...`);
        this.generateInstances();
    }

    generateInstances()
    {
      var max = Config.Instances.max;
      var count = 4000001;
      for (var i = 0; i < max; i++)
      {
        var main = `${Config.Instances.main}-${count+i}`;
        count++;
        Logger.debug(`MainWorld Instance doId: ${main}`);

        var newUser = `${Config.Instances.newuser}-${count+i}`;
        count++;
        Logger.debug(`NewUser Instance doId: ${newUser}`);

        var newHouse = `${Config.Instances.newhouse}-${count+i}`;
        count++;
        Logger.debug(`NewHouse Instance doId: ${newHouse}`);

        // actually create and set the distributed objects into their respective instances

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
