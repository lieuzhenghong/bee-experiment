var node = require('../nodegame-client/index.js');

node.setup('nodegame', {}); // should not be necessary, it also wants the empty object

var NGM = require('nodegame-mongodb').NGM;

var ngm = new NGM(node);

ngm.on('AHAH', function(a) {
    return {
        ahah_2: a
    };
});


ngm.connect(function() {
    console.log('Connected');

    var db = ngm.getDbObj();
    var collection = db.collection('foo');

    collection.find().toArray(function(err, data) {
        console.log('data in foo:', data);
        console.log();

        var randNum = Math.random();

        console.log('storing value ' + randNum);

        ngm.store({rand: randNum});

        debugger;
        
        node.on('AHAH', function(a){
            ngm.store({ahah: a});
        });

        node.emit('AHAH', '??');


        ngm.disconnect();
    });
});

/*
ngm.on('in.set.DATA', function(msg) {
    return {
        player: msg.from,
        value:  msg.data,
        key:    msg.key,
        time:   getTime()
    };
});
*/
