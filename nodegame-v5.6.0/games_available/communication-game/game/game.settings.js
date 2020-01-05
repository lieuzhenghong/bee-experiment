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
        instructions: 120000
    },

	msg_received: "FUCK YOU'RE NOT SUPPOSED TO SEE THIS",

    // # Game specific properties

    // Number of game rounds repetitions.
    REPEAT: 4,

    // In case an incoming offer does not pass validation, which indicates
    // cheating, re-set the dictator's offer to this value.
    defaultOffer: 100,

	bidTime: 30000,



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
