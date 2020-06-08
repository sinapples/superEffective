const typetable = require('./pokedex');
const grammar = require('../languageUtils');
const { GoogleAssistant,Table } = require('jovo-platform-googleassistant');

module.exports = {
    superEffective() {


        //Get inputs
        let name;

        //get data from session
        if (this.$session.$data.pokemon) {
            name = typetable.getRegionalForm(this.$session.$data.pokemon)

        }
        //get data from input
        if( this.$inputs.pokemon){
            name = typetable.getRegionalForm(this.$inputs.pokemon.key)

        }
        //Save type in session 
        this.$session.$data.pokemon = name;


        //logic
        let effectiveness = typetable.getEffectiveness(name);


        //pokemon not found 
        if (effectiveness == null) {
            let notFound = [
                `Sorry, I didn't hear that Pokemon, please say it again?`,
                `Sorry I don't know that Pokemon, Say the name of the Pokemon or its types?`,
                `Sorry I didn't get that, Say the name of the Pokemon or its types?`
            ]
            //speech
            this.$speech.addText(notFound);

            //Prepare reprompt
            this.$reprompt.addText("What is the Pokemon or its type?");

            //Send the speech
            this.ask(this.$speech, this.$reprompt);
        }


        // let speech = `${typeSpeech} is weak to ${weakTo}`;
        let speech = ``;
        let maxEffect = Object.keys(effectiveness.max).length;
        let superEffect = Object.keys(effectiveness.super).length;
        let noEffect = Object.keys(effectiveness.noEffect).length;
        let notVery = Object.keys(effectiveness.notVery).length;
        let noEffectiveType = [];
        let notVeryType = [];
        for (let type in effectiveness.noEffect) {
            noEffectiveType.push(type);
        }
        for (let type in effectiveness.notVery) {
            notVeryType.push(type);
        }

        let maxEffectiveType = [];
        if (maxEffect > 0) {
            this.$speech.addText("You should use ");
            for (let type in effectiveness.max) {
                maxEffectiveType.push(type);
            }
            this.$speech.addText(grammar.addOr(maxEffectiveType));
            this.$speech.addBreak("100ms");
            this.$speech.addText(" it's 4 times super effective!");
            this.$speech.addBreak("300ms");
        }

        let superEffectiveType = [];
        if (superEffect) {

            for (let type in effectiveness.super) {
                superEffectiveType.push(type);
            }

            //add extra dialog for max effective
            if (maxEffect > 0) {

                this.$speech.addText(grammar.singularOrPlural(superEffect, "This type", "These types") + " are also super effective ");
                this.$speech.addBreak("400ms");
                this.$speech.addText(grammar.addAnd(superEffectiveType) + ".");
            } else {
                this.$speech.addText("You should use " + grammar.addOr(superEffectiveType) + ".")

                this.$speech.addBreak("400ms");
                this.$speech.addText(grammar.singularOrPlural(superEffect, "It is", "They are") + " super effective.");
            }


        }





        //Create card
        let img = "https://i.imgur.com/F87NLQj.png"
        let title = grammar.titleCase(name);
        let content = "";
        let table = [];
        //Card content
        if (maxEffect > 0) {
            let row = ["4x Effective:", grammar.addAnd(maxEffectiveType)]
            table.push(row);

            content += "4x Effective:\n"
            content += "\t" + grammar.addAnd(maxEffectiveType) + ".";
            content += "\n"
        }
        if (superEffect > 0) {
            let row = ["2x Effective:", grammar.addAnd(superEffectiveType)]
            table.push(row);

            content += "2x Effective:\n"
            content += "\t" + grammar.addAnd(superEffectiveType);
            content += "\n"

        }
        // if (noEffect > 0) {
        //     let row = ["No Effect:", grammar.addAnd(noEffectiveType)]
        //     table.push(row);

        //     content += "No Effect:\n"
        //     content += "\t" + grammar.addAnd(noEffectiveType) + ".";
        //     content += "\n"
        // }
        // if (notVery > 0) {
        //     let row = ["Not Very Effective:", grammar.addAnd(notVeryType)]
        //     table.push(row);

        //     content += "Not Very Effective:\n"
        //     content += "\t" + grammar.addAnd(notVeryType) + " ";
        //     content += "\n"
        // }

        this.showImageCard(title, content, img);
 
  
        //Follow up question
        //If already asked for effect/resist
        if (this.$session.$data.loop) {
            this.$speech.addBreak("600ms")
                .addText(`What's the name or type of another pokemon?`);
        } else {

            this.$speech.addBreak("500ms")
                .addText(`Do you want to know what types ${name} resist?`);
        }
        this.$session.$data.loop = false;

        //Prepare reprompt
        this.$reprompt.addText("What is the Pokemon's typing?");

        //Send the speech
        // this.ask(this.$speech, this.$reprompt);
        this.ask(this.$speech, '?');

    },

    YesIntent() {

        //Prevent looping in session data 
        this.$session.$data.loop = true;
        this.toStateIntent("resistPokemonState", "resist");




    },

    RepeatIntent() {
        this.toStateIntent("superEffectivePokemonState", "superEffective");

    },

    NoIntent() {

        return this.toIntent('Goodbye');
    },



}

