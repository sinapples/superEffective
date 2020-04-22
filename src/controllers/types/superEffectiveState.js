const typetable = require('../effectiveness');
const grammar = require('../languageUtils');

module.exports = {
    superEffective() {


        //Get inputs
        let type;
        let type2;

        //get data from session
        if (this.$session.$data.type) {
            type = this.$session.$data.type
            type2 = this.$session.$data.type1 ? this.$session.$data.type1 : this.$session.$data.typeOne ? this.$session.$data.typeOne : "";
        }
        //get data from input
        if(this.$inputs.type || this.$inputs.typeOne){
      //Alexa list
            if(this.$alexaSkill){
                type =this.$inputs.typeOne.value;
                type2  =this.$inputs.typeTwo.value != undefined ? this.$inputs.typeTwo.value: "";
            } else {
                type = this.$inputs.type.value
                type2 = this.$inputs.type1 ? this.$inputs.type1.value : this.$inputs.typeOne ? this.$inputs.typeOne : "";
            }
        }
        //Save type in session 
        this.$session.$data.type = type ? type : "";
        this.$session.$data.type1 = type2 ? type2 : "";;


        let typeSpeech = type;
        //type2 exist check
        if (type2) {
            console.log(">>>> two type");
            typeSpeech += ` and ${type2}`;
            //check not the same
            if (type === type2) {
                type2 = "";
            }
            console.log(typeSpeech);

        }


        //logic
        let effectiveness = typetable.getEffectiveness(type, type2);


        // let speech = `${typeSpeech} is weak to ${weakTo}`;
        let speech = ``;
        let maxEffect = Object.keys(effectiveness.max).length;
        let superEffect = Object.keys(effectiveness.super).length;
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
        let title = grammar.titleCase(typeSpeech);
        let content = "";

        //Card content
        if (maxEffect > 0) {
            content += "4x Effective:\n"
            content += "\t" + grammar.addAnd(maxEffectiveType) + ".";
            content += "\n"
        }
        if (superEffect > 0) {
            content += "2x Effective:\n"
            content += "\t" + grammar.addAnd(superEffectiveType);
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
                .addText(`Do you want to know what types ${typeSpeech} resist?`);
        }
        this.$session.$data.loop = false;

        //Prepare reprompt
        this.$reprompt.addText("What is the Pokemon's typing?");

        //Send the speech
        this.ask(this.$speech, this.$reprompt);

    },

    YesIntent() {
        this.$session.$data.loop = true;
        this.toStateIntent("resistState", "resist");




    },

    RepeatIntent() {
        this.toStateIntent("superEffectiveState", "superEffective");

    },

    NoIntent() {

        return this.toIntent('Goodbye');
    },



}

