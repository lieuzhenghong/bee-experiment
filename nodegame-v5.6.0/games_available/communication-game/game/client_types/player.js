/**
 * # Player type implementation of the game stages
 * Copyright(c) 2019 Zhenghong Lieu <lieuzhenghong@gmail.com>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    stager.setOnInit(function() {

        // Initialize the client.

        var header, frame;

        // Bid is valid if it is a number between 0 and 100.
        this.isValidBid = function(n) {
            return node.JSUS.isInt(n, -1, 101);
        };

        // Setup page: header + frame.
        header = W.generateHeader();
        frame = W.generateFrame();

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header);

        this.visualTimer = node.widgets.append('VisualTimer', header);

        this.doneButton = node.widgets.append('DoneButton', header);

        // Additional debug information while developing the game.
        this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm'
    });

	stager.extendStep('quiz', {
		widget: {
			id: 'comprehension_quiz',
			name: 'ChoiceManager',
			root: 'container',
			options: {
				className: 'centered',
				mainText: 'A small quiz to test your understanding',
				forms: settings.quiz
			}
		}
	});


	stager.extendStep('send', {
		widget: {
			id: 'message_choice',
			name: 'ChoiceManager',
			root: 'container',
			options: {
				className: 'centered',
				mainText: 'A small quiz',
				forms: settings.forms
			}
		},

		done: function (values) {
			// How do I getValues of the widget form?
			console.log("Clicked!");
			console.log(values.forms);
			node.say('sending_msg', 'SERVER', { message_choices: values.forms });
		},

	});

	stager.setDefaultProperty('msg', '');

	stager.extendStep('receive', {
		frame: 'receive.htm',
		cb: function() {
			const container = W.getElementById('other_text');
			container.innerHTML += '<h2>Message received</h2>';
			container.innerHTML += "<p> Your partner's message to you is:";

			node.on.data('message_received', function(msg) {
				console.log("message received!");
				console.log(msg);
				// Modify local copy of global var
				node.game.settings.msg_received = msg;
				console.log(node.game.settings.msg_received);
				const display_box = W.getElementById('message_display_box');
				display_box.innerHTML = '<p>' + msg.data;
			});
		}
	});

	stager.extendStep('game', {
		frame: 'stag.htm',
		cb: function() {
			const msg = node.game.settings.msg_received;
			console.log(msg);
			const display_box = W.getElementById('message_display_box');
			display_box.innerHTML = '<p>' + msg.data;
		},
		widget: {
			name: 'ChoiceManager',
			root: 'choice_table_box',
			options: {
				className: 'centered',
				forms: [{
					name: 'ChoiceTable',
					id: 'stag_choice',
					orientation: 'V',
					mainText: "Choose an option to play:",
					choices: [['A', 'Option A'], ['B', 'Option B']],
					requiredChoice: true
				}]
			}
		},
		done: function(values) {
			console.log(values.forms)
			node.say('choice_made', 'SERVER', {game_choice: values.forms });
		}
	});

	stager.extendStep('results', {
		frame: 'receive.htm',
		cb: function() {
			node.on.data('results_received', function(msg) {
				const container = W.getElementById('other_text');
				container.innerHTML += '<h2>Results</h2>'
				const display_box = W.getElementById('message_display_box');
				display_box.innerHTML = '<p>' + msg.data;
			})
			// Automatically go to the results screen after 20 seconds
			setTimeout(function() { node.done(); }, 20000);
		}
	});

    stager.extendStep('end', {
        donebutton: false,
        frame: 'end.htm',
        cb: function() {
            node.game.visualTimer.setToZero();
        }
    });
};
