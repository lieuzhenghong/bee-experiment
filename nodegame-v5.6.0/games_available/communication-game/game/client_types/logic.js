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

	var staged_messages = [];


	stager.extendStep('send', {
		matcher: {
			match: 'roundrobin'
		},
		cb: function() {
			console.log('Send');
			node.on.data('sending_msg', function(msg) {
				// Everything looks good here...
				console.log("message received!");
				console.log(msg)
				let other_player = node.game.matcher.getMatchFor(msg.from);
				let message_choices = msg.data.message_choices;
				console.log(`The other player is: ${other_player}`);

				staged_messages.push({
					player_id: msg.from,
					other_player: other_player,
					message_choices: Object.values(message_choices) // convert to array
				});

				//node.say('message', node.game.memory.player, 'Hello');
			});
		}
	});

    stager.extendStep('receive', {
        cb: function() {
            console.log('Receive');
			console.log('Sending message');

			function convert_to_string(choice_array) {

				function reducer(acc, choice) {
					if (choice.value === 'Do not send this part of the message') {}
					else { acc += choice.value; }
					return acc;
				}

				const message_string = choice_array.reduce(reducer, '');
				return message_string;
			}

			staged_messages.forEach((msg_obj) => {
				console.log(msg_obj);
				var message_string = convert_to_string(msg_obj.message_choices);
				console.log('Message string: ' + message_string);
				node.say('message_received', msg_obj.other_player, message_string);
			})

			// Handle reconnection in the receive message step
			node.on.data('reconnect_msg', function() {
				// Find the message that needs to be resent back to player

			})
        }
    });

	var staged_choices = {};	

	stager.extendStep('game', {
		cb: function () {
			node.on.data('choice_made', function(msg) {
				console.log("choice received!");
				console.log(msg)
				console.log(msg.data.game_choice.stag_choice)
				let player_id = msg.from;
				let other_player = node.game.matcher.getMatchFor(msg.from);
				let game_choice = msg.data.game_choice.stag_choice.choice;

				console.log(`The player is: ${player_id}`);
				console.log(`The other player is: ${other_player}`);
				console.log(`This player chose: ${game_choice}`);

				// [TODO] check if this assert actually works
				console.assert(!staged_choices[player_id])
				staged_choices[player_id] = {};
				staged_choices[player_id].other_player = other_player;
				staged_choices[player_id].game_choice = game_choice;
			});
		}
	});

	stager.extendStep('results', {
		cb: function () {
			console.log(staged_choices);
			const playerIds = Object.keys(staged_choices);
			console.log('Now displaying playerIds: ' + playerIds);
			console.log(playerIds);
			const p1Id = playerIds[0];
			const p2Id = playerIds[1];

			// [TODO] check if assert actually works
			console.assert(staged_choices[p1Id].other_player === p2Id);
			console.assert(staged_choices[p2Id].other_player === p1Id);

			// Check what the other player played and update the payoffs

			const p1Choice = staged_choices[p1Id].game_choice;
			const p2Choice = staged_choices[p2Id].game_choice;

			if (p1Choice === 'A' && p2Choice === 'A') {
				staged_choices[p1Id].payoff = settings.BOTH_STAG;
				staged_choices[p2Id].payoff = settings.BOTH_STAG;
			}
			else if (p1Choice === 'A' && p2Choice === 'B') {
				staged_choices[p1Id].payoff = settings.GOT_FUCKED;
				staged_choices[p2Id].payoff = settings.FUCKED_THE_OTHER_GUY;
			}
			else if (p1Choice === 'B' && p2Choice === 'A') {
				staged_choices[p1Id].payoff = settings.FUCKED_THE_OTHER_GUY;
				staged_choices[p2Id].payoff = settings.GOT_FUCKED;
			}
			else {
				staged_choices[p1Id].payoff = settings.BOTH_HARE;
				staged_choices[p2Id].payoff = settings.BOTH_HARE;
			}
			console.log(staged_choices);

			// Update the channel registry for use in EndScreen 
			const p1Client = channel.registry.getClient(p1Id);
			const p2Client = channel.registry.getClient(p2Id);
			p1Client.win = staged_choices[p1Id].payoff;
			p2Client.win = staged_choices[p2Id].payoff;

			// Send the appropriate acknowledgement messages to the players
			sendtoClient(p1Id, p1Choice, p2Choice, staged_choices[p1Id].payoff,
				staged_choices[p2Id].payoff)
			sendtoClient(p2Id, p2Choice, p1Choice, staged_choices[p2Id].payoff,
				staged_choices[p1Id].payoff)
		}
	});

	function sendtoClient(sId, sChoice, oChoice, sPayoff, oPayoff) {
		const message_string = `You played ${sChoice}. Your partner played ${oChoice}. ` +
			`You got $ ${sPayoff.toFixed(2)}. ` +
			`Your partner got $ ${oPayoff.toFixed(2)}.`
		node.say('results_received', sId, message_string);
	}

    stager.extendStep('end', {
        cb: function() {

			gameRoom.computeBonus({
                header: [ 'id', 'type', 'workerid', 'hitid',
                          'assignmentid', 'exit', 'bonus' ],
                headerKeys: [ 'id', 'clientType', 'WorkerId',
                              'HITId', 'AssignmentId', 'ExitCode', 'win' ],
                say: true,   // default false
                dump: true,  // default false
                print: true  // default false                
            });


		   	node.on.data('email', function(msg) {
				var id, code;
				id = msg.from;

				code = channel.registry.getClient(id);
				if (!code) {
					console.log('ERROR: no code in endgame:', id);
					return;
				}

				// Write email.
				appendToCSVFile(msg.data, code, 'email');
			});

			node.on.data('feedback', function(msg) {
				var id, code;
				id = msg.from;

				code = channel.registry.getClient(id);
				if (!code) {
					console.log('ERROR: no code in endgame:', id);
					return;
				}

				// Write email.
				appendToCSVFile(msg.data, code, 'feedback');
			});

            node.game.memory.save('data.json');

        }
    });

    function appendToCSVFile(email, code, fileName) {
        var row;

        row  = '"' + (code.id || code.AccessCode || 'NA') + '", "' +
            (code.workerId || 'NA') + '", "' + email + '"\n';

        fs.appendFile(gameRoom.dataDir + fileName + '.csv', row, function(err) {
            if (err) {
                console.log(err);
                console.log(row);
            }
        });
    }

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
