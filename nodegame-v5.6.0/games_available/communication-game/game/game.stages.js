/**
 * # Game stages definition file
 * Copyright(c) 2019 Zhenghong Lieu <lieuzhenghong@gmail.com>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(stager, settings) {

     stager
        .next('instructions')
		.next('quiz')
        .next('communicate')
		.step('send')
		.step('receive')
		.next('game')
		.next('results')
        //.repeat('game', settings.REPEAT)
        .next('end')
        //.gameover();

    // Modify the stager to skip one stage.
    // stager.skip('instructions');

    // To skip a step within a stage use:
    // stager.skip('stageName', 'stepName');
    // Notice: here all stages have just one step.
};
