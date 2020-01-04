/**
 * # nodeGame-db: Database
 * Copyright(c) 2014 Stefano Balietti
 * MIT Licensed
 *
 * Abstract DB interface for nodeGame
 * 
 * http://www.nodegame.org
 * 
 * --- 
 */

module.exports = Database;

function Database(node, config) {
    config = config || {};
    this.node = node;
}

Database.prototype.getLayer = function(backend, config) {
    switch (backend) {
    case 'MongoDB':
        return new (require('nodegame-mongodb').NGM)(this.node, config);

    default:
        this.node.err("getLayer: Unknown DB backend '" + backend + "'");
        return null;
    }
};
