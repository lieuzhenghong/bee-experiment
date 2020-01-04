/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2019 Zhenghong Lieu <lieuzhenghong@gmail.com>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

var ngc = require('nodegame-client');
var J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    // Must implement the stages here.

    stager.setOnInit(function() {
        // Initialize the client.
    });

    stager.extendStep('instructions', {
        cb: function() {
            console.log('Instructions.');
        }
    });


    stager.extendStep('communicate', {
        cb: function() {
            console.log('Communicate');
        }
    });

	var other_player;
	var message_choices;

	stager.extendStep('send', {
		cb: function() {
			console.log('Send');
			node.on.data('sending_msg', function(msg) {
				// Everything looks good here...
				console.log("message received!");
				console.log(msg)
				console.log(msg.from)
				// [BUG] [TODO]
				// The following line throws an error:
				// ServerNode caught an exception:
				// TypeError: Matcher.normalizeRound: no matches found
				// But it can get the correct ID in msg.from...
				other_player = node.game.matcher.getMatchFor(msg.from);
				console.log(`The other player is: ${other_player}`);
				message_choices = msg.data.message_choices;
				//node.say('message', node.game.memory.player, 'Hello');
			});
		}
	});

    stager.extendStep('receive', {
        cb: function() {
            console.log('Receive');
			node.say('message_received', other_player, message_choices);
        }
    });

    stager.extendStep('game', {
        matcher: {
            roles: [ 'DICTATOR', 'OBSERVER' ],
            match: 'round_robin',
            cycle: 'mirror_invert',
            // sayPartner: false
            // skipBye: false,

        },
        cb: function() {
            node.once.data('done', function(msg) {
                var offer, observer;
                offer = msg.data.offer;

                // Validate incoming offer.
                if (false === J.isInt(offer, 0, 100)) {
                    console.log('Invalid offer received from ' + msg.from);
                    // If dictator is cheating re-set his/her offer.
                    msg.data.offer = settings.defaultOffer;
                    // Mark the item as manipulated.
                    msg.data.originalOffer = offer;
                }


				// And it also works here, so why doesn't it work in the 'send' step?
				console.log(msg)
				console.log(msg.from);
                observer = node.game.matcher.getMatchFor(msg.from);
				console.log(`The other player is: ${observer}`);
                // Send the decision to the other player.
                node.say('decision', observer, msg.data.offer);

            });
            console.log('Game round: ' + node.player.stage.round);
        }
    });

    stager.extendStep('end', {
        cb: function() {
            // Save data in the data/roomXXX directory.
            node.game.memory.save('data.json');
        }
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
