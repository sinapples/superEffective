'use strict';
const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
jest.setTimeout(500);

for (const p of [new Alexa(), new GoogleAssistant()]) {
    const testSuite = p.makeTestSuite();

    describe(`PLATFORM: ${p.constructor.name}: superEffective intent ` , () => {
        test('should return the types ', async () => {
            const conversation = testSuite.conversation();

            const launchRequest = await testSuite.requestBuilder.launch();
            const responseLaunchRequest = await conversation.send(launchRequest);
            expect(
                responseLaunchRequest.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')
            ).toBe(true);

        });
    });



        //Test Shark Fact Intent 
        describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
            test('should return a shark fact', async () => {
                const conversation = testSuite.conversation();
                const intent = await testSuite.requestBuilder.intent('superEffective');
                const responseIntentRequest = await conversation.send(intent);
                expect(responseIntentRequest.getSpeech())
                    .toContain('https://disclexa-mp3-us-east-1.' + env + '.discovery.com/sharkweek/factleadin.mp3');
            });
        });






}
