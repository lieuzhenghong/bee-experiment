/**
 * # Game settings definition file
 * Copyright(c) 2019 Zhenghong Lieu <lieuzhenghong@gmail.com>
 * MIT Licensed
 *
 * The variables in this file will be sent to each client and saved under:
 *
 *   `node.game.settings`
 *
 * The name of the chosen treatment will be added as:
 *
 *    `node.game.settings.treatmentName`
 *
 * http://www.nodegame.org
 * ---
 */


	intent_choicetable=	{
		name: 'ChoiceTable',
		id: 'choice_1',
		orientation: 'V',
		mainText: "Please choose a message to send to the other player:",
		choices: [
			'I intend to choose A. ',
			'I intend to choose B. ',
			'Do not send this part of the message'
		],
		requiredChoice: true
	}

	imperative_choicetable= {
		name: 'ChoiceTable',
		id: 'choice_2',
		orientation: 'V',
		mainText: 'Please choose an additional message to send to the other player',
		choices: [
			'You should choose A. ',
			'You should choose B. ',
			'Do not send this part of the message'
		],
		requiredChoice: true
	}

	shared_knowledge_choicetable= {
		name: 'ChoiceTable',
		id: 'choice_3',
		orientation: 'V',
		mainText: 'Please choose an additional message to send to the other player',
		choices: [
			'Option A is the better choice if both players ' +
			'choose option A as both players get the highest payoff. ' +
			'Option B is the better choice if the other player plays option B. ',
			'Do not send this part of the message'
		],
		requiredChoice: true
	}

	prosocial_choicetable= {
		name: 'ChoiceTable',
		id: 'choice_4',
		orientation: 'V',
		mainText: 'Please choose an additional message to send to the other player',
		choices: [
			'I care about both of our payoffs. ',
			'I care only about my own payoff. ',
			'Do not send this part of the message'
		],
		requiredChoice: true
	}

module.exports = {

    // Variables shared by all treatments.

    // #nodeGame properties:

    /**
     * ### TIMER (object) [nodegame-property]
     *
     * Maps the names of the steps of the game to timer durations
     *
     * If a step name is found here, then the value of the property is
     * used to initialize the game timer for the step.
     */
    TIMER: {
        instructions: 10000,
		quiz: 120000,
		send: 120000,
		receive: 20000,
		game: 120000,
		results: 20000
    },

	msg_received: "FUCK YOU'RE NOT SUPPOSED TO SEE THIS",

    // # Game specific properties

	quiz : [
		{
			name: 'ChoiceTable',
			id: 'quiz_1',
			orientation: 'V',
			mainText: "What happens before you play the game with your partner?",
			choices: [
				'Both of you send a message to one another', 
				'Only you get to send a message to your partner',
				'Only your partner gets to send a message to you'
			],
			correctChoice: 0
		},
		{
			name: 'ChoiceTable',
			id: 'quiz_2',
			orientation: 'V',
			mainText: "What happens if one person plays B and the other plays A?",
			choices: [
				'The person who plays A gets $0.90, the person who plays B gets $0.20', 
				'The person who plays B gets $0.90, the person who plays A gets $0.20' 
			],
			correctChoice: 1
		},
		{
			name: 'ChoiceTable',
			id: 'quiz_3',
			orientation: 'V',
			mainText: "What do you get if both players play A?",
			choices: [
				'Both players get $0.50', 
				'Both players get $0.90',
				'Both players get $1.00'
			],
			correctChoice: 2
		},
		{
			name: 'ChoiceTable',
			id: 'quiz_4',
			orientation: 'V',
			mainText: "What do you get if both players play B?",
			choices: [
				'Both players get $0.50', 
				'Both players get $0.90', 
				'Both players get $1.00'
			],
			correctChoice: 0
		}
	],

	BOTH_STAG : 1,
	BOTH_HARE : 0.5,
	GOT_FUCKED : 0.2,
	FUCKED_THE_OTHER_GUY : 0.9,

    // # Treatments definition.

    // They can contain any number of properties, and also overwrite
    // those defined above.

    // If the `treatments` object is missing a treatment named _standard_
    // will be created automatically, and will contain all variables.

    treatments: {

        standard: {
            description: "No shared knowledge",
			forms: [intent_choicetable]
        },

		imperative: {
			description: "Option to tell the other player what to do",
			forms: [intent_choicetable, imperative_choicetable]
		},

        shared_knowledge: {
            description: "Standard + Imperative + Shared knowledge",
			forms: [intent_choicetable, imperative_choicetable, shared_knowledge_choicetable]
		},

		prosocial: {
			description: "Standard + Imperative + Shared knowledge + prosocial",
			forms: [intent_choicetable, imperative_choicetable, 
				shared_knowledge_choicetable, prosocial_choicetable]
		},


    }
};
