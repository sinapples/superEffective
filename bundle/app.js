'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const superEffectiveState = require('./controllers/types/superEffectiveState');
const superEffectivePokemonState = require('./controllers/pokemon/superEffectivePokemonState');
const resistPokemonState = require('./controllers/pokemon/resistPokemonState');
const resistState = require('./controllers/types/resistState');
const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);

//webhook
// https://us-central1-voice-261623.cloudfunctions.net/super-effective
// https://webhook.jovo.cloud/6c1a5771-2b16-4729-90cd-9cb70ee38efb


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    superEffectiveState,
    superEffectivePokemonState,
    resistPokemonState,
    resistState,
    LAUNCH() {
        return this.toIntent('Welcome');
    },

    Welcome() {
        //Prepare Speach
        this.$speech.addText("Welcome to Pokemon Types!")
            .addText("Tell me the Pokemon's name or type and I'll tell you what is super effective against it!");

        //Prepare reprompt
        this.$reprompt = this.$speech;

        //card content
        let img = "https://i.imgur.com/F87NLQj.png"
        let title = "Type Table";
        let content = "What is the Pokemon's name or type?";
        this.showImageCard(title, content, img);

        //Send the speech

        this.ask(this.$speech, this.$reprompt);
    },

    superEffective() {
        console.log("app: superEffective");
        this.toStateIntent("superEffectiveState", "superEffective");
    },
    superEffectivePokemon() {
        console.log("app: superEffectivePokemon");
        this.toStateIntent("superEffectivePokemonState", "superEffectivePokemon");
    },

    resist() {
        console.log("app: resist");
        this.toStateIntent("resistState", "resist");
    },
    resistPokemon() {
        console.log("app: resistPokemon");
        this.toStateIntent("resistPokemonState", "resistPokemon");
    },

    YesIntent() {
        console.log("app: YesIntent");
        if (this.getState() === 'superEffectiveState.superEffective') {
            this.toStateIntent("resistState", "resist");
        }
        if (this.getState() === 'resistState.resist') {
            this.toStateIntent("superEffectiveState", "superEffective");
        }


    },

    NoIntent() {
        console.log("app: NoIntent");
        return this.toIntent('Goodbye');
    },






    help() {
        console.log("app: help");
          //Prepare Speach
          let speech = [
            "Tell me one or two Pokemon types.",
            "Tell me the name or type of the Pokemon?",
            "Tell me the name of the Pokemon?",
            "What is the type of the Pokemon?",
            "What is the type or name of the Pokemon?",
            "What is the name of the Pokemon?",
            "Name the type of the Pokemon.",
            "Tell me the Name of the Pokemon.",
            "Name the Pokemon's type."

        ]
        this.$speech.addText(speech);

        //card content
        let img = "https://i.imgur.com/F87NLQj.png"
        let title = "Type Table Help";
        let content = "Say the Pokemon's name or type.";
        this.showImageCard(title, content, img);

        //Prepare reprompt
        this.$reprompt = this.$speech;

        //Send the speech

        this.ask(this.$speech, this.$reprompt);
    },
    Goodbye() {
        console.log("app: Goodbye");
        //Prepare Speach
        let speech = [
            "Good luck!",
            "See you later!",
            "Go catch them all!",
            "May the shiny luck be with you!",
            "Have fun!",
            "Gotta catch them all!",
            "Have a good day!",
            "Hope you can catch it!",
            "Good luck on the battle!",
            "Hope it is shiny!"

        ]
        this.$speech.addText(speech);

        //card content
        let img = "https://i.imgur.com/F87NLQj.png"
        let title = "Type Table";
        let content = "By @SinappleSoft";
        this.showImageCard(title, content, img);

        //Prepare reprompt
        this.$reprompt = this.$speech;

        //Send the speech

        this.tell(this.$speech, this.$reprompt);
    },

});

module.exports.app = app;
