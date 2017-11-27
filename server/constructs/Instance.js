const Map = require('./Map');

class Instance
{
    /*
    Initializes a new Instance
    */

    constructor(id, name, type, subtype, sqlconn)
    {
        // MySQL
        this.mysql = sqlconn;

        // Instance Variables
        this.id = 4000001 + id;
        this.name = name;
        this.type = type;
        this.subtype = subtype;
        this.players = [];

        this.generate();
    }

    generate()
    {
      var self = this;

      switch (this.type)
      {
        case 'map':
          this[`${this.name}-${this.id}`] = new Map(this.id, this.name, this.subtype);
          break;
        default:
          break;
      }
    }
}

module.exports = Instance;
