const typetable = require('./pokedex');
const grammar = require('../languageUtils');

module.exports = {
    resist() {


        //Get inputs
        let name;

        //get data from session
        if (this.$session.$data.pokemon) {
            name = this.$session.$data.pokemon

        }
        //get data from input
        else {
            name = this.$inputs.pokemon.value

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
        let noEffect = Object.keys(effectiveness.noEffect).length;
        let notVery = Object.keys(effectiveness.notVery).length;
        let noEffectiveType = [];
        if (noEffect > 0) {
            this.$speech.addText("");
            for (let type in effectiveness.noEffect) {
                noEffectiveType.push(type);
            }
            this.$speech.addText(grammar.capitalize(grammar.addAnd(noEffectiveType)));
            this.$speech.addBreak("100ms");
            this.$speech.addText(grammar.singularOrPlural(noEffect, "has", "have") + " no effect!");
            this.$speech.addBreak("300ms");
        }

        let notVeryType = [];
        if (notVery) {

            for (let type in effectiveness.notVery) {
                notVeryType.push(type);
            }

            //not very effective
            // console.log(">>>>>>>" + grammar.addAnd(notVeryType))
            // console.log(">>>>>>>" + grammar.capitalize("normal, flying, rock, bug, steel, grass, psychic, ice, dragon, and fairy"));
            this.$speech.addText(grammar.capitalize(grammar.addAnd(notVeryType)))
            this.$speech.addBreak("400ms");
            this.$speech.addText(grammar.singularOrPlural(notVery, "is", "are") + " not very effective to " + name + ".");



        }





        //Create card
        let img = "https://i.imgur.com/F87NLQj.png"
        let title = grammar.titleCase(name);
        let content = "";

        //Card content
        if (noEffect > 0) {
            content += "No Effect:\n"
            content += "\t" + grammar.addAnd(noEffectiveType) + ".";
            content += "\n"
        }
        if (notVery > 0) {
            content += "Not Very Effective:\n"
            content += "\t" + grammar.addAnd(notVeryType) + " ";
            content += "\n"
        }

        this.showImageCard(title, content, img);



        //Follow up question
        //If already asked for effect/resist
        if (this.$session.$data.loop) {
            this.$speech.addBreak("600ms")
                .addText(`What's the name or type of another pokemon?`);
        } else {
            this.$speech.addBreak("500ms")
                .addText(`Do you want to know what is super effective to ${name}?`);
        }
        this.$session.$data.loop = false;

        
        //Prepare reprompt
        this.$reprompt.addText("What is the Pokemon's typing?");

        //Send the speech
        this.ask(this.$speech, this.$reprompt);

    },


    YesIntent() {
        this.$session.$data.loop = true;
        this.toStateIntent("superEffectivePokemonState", "superEffective");




    },

    RepeatIntent() {
        this.toStateIntent("resistPokemonState", "resist");

    },

    NoIntent() {

        return this.toIntent('Goodbye');
    },



}

