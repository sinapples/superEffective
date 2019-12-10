'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const superEffectiveController = require('./controllers/superEffectiveController');
const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    superEffectiveController,

    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    Welcome() {
        this.ask('Welcome to type effectiveness');
    },

    superEffective() {

        this.toStateIntent("superEffectiveController", "superEffective");
    },
});

module.exports.app = app;
