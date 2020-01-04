/**
 * # MongoLayer
 * Copyright(c) 2014 Stefano Balietti
 * MIT Licensed
 *
 * Handles a connection to a MongoDB instance
 *
 * ---
 */
var mongodb = require('mongodb');
var Db = mongodb.Db;
var MongoClient = mongodb.MongoClient;
var Server = mongodb.Server;

module.exports = MongoLayer;

function MongoLayer(node, config) {
    config = config || {};

    this.node = node;

    this.dbName = config.dbName || 'test';  // TODO
    this.collectionName = config.collectionName || 'foo';  // TODO

    this.db = new Db(this.dbName, new Server('localhost', 27017));

    this.activeDb = null;
    this.activeCollection = null;
}


MongoLayer.prototype.connect = function(callback) {
    var that = this;
    this.db.open(function(err, db) {
        if (err !== null) {
            that.node.err('Error opening MongoDB connection: ' + err);
            return;
        }

        that.activeDb = db;

        db.collection(that.collectionName, function(err, collection) {
            if (err !== null) {
                that.node.err("Error opening collection '" +
                    that.collectionName + "': " + err);
                return;
            }

            that.activeCollection = collection;

            callback();
        });
    });
};

MongoLayer.prototype.disconnect = function() {
    if (this.activeDb) this.activeDb.close();
};

MongoLayer.prototype.store = function(data) {
    var d = new Date();
    var year   = d.getFullYear();
    var month  = d.getMonth() + 1;
    var day    = d.getDate();
    var hour   = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    var msec   = d.getMilliseconds();

    // TODO: queue request if not connected

    if ('object' !== typeof data) {
        this.node.err('store called with invalid data');
        return false;
    }

    // add timestamp:
    if (data.hasOwnProperty('time')) {
        this.node.err("object to store must not have 'time' field");
        return false;
    }

    data.time = year + '-' +
        (month < 10 ? '0' + month : month) + '-' +
        (day < 10 ? '0' + day : day) + ' ' +
        (hour < 10 ? '0' + hour : hour) + ':' +
        (minute < 10 ? '0' + minute : minute) + ':' +
        (second < 10 ? '0' + second : second) + '.' +
        (msec < 100 ? '0' + (msec < 10 ? '0' + msec : msec) : msec);

    if (this.activeCollection) {
        this.activeCollection.insert(data);
    }
    else {
        this.node.err('MongoLayer: no active connection!');
    }
    return true;
};

// TODO: test this method
MongoLayer.prototype.on = function(eventType, callback) {
    var that = this;
    
    this.node.events.ng.on(eventType, function(msg) {
        var data = callback(msg);

        if ('object' !== typeof data) {
            that.node.err("MongoLayer.on callback didn't return data object");
            return;
        }

        /*
        if (data.hasOwnProperty('eventType')) {
            that.node.err(
                "MongoLayer.on callback returned data with 'eventType' field");
            return;
        }
        */

        // raise error?
        data.eventType = data.eventType || eventType;
        if (msg.from) {
            data.senderID = data.senderID || msg.from;
        }

        that.store(data);
    });
};

MongoLayer.prototype.getDbObj = function() {
    return this.activeDb;
};
