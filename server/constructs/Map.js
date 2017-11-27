class Map
{
    /*
    Initializes a new Map Zone
    */

    constructor(id, name, type)
    {

        // Zone Variables
        this.id = id;
        this.name = name;
        this.type = type;
        this.players = [];

        this.generate();
    }

    generate()
    {
      var self = this;

      Logger.warn(`${this.type} Zone: |${this.id}|${this.name}| created!`);

      // TODO

    }
}

module.exports = Map;
