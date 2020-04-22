const typetable = require('../effectiveness');
const grammar = require('../languageUtils');

module.exports = {
    resist() {


        //Get inputs
        let type;
        let type2;

        //get data from session
        if (this.$session.$data.type) {
            type = this.$session.$data.type
            type2 = this.$session.$data.type1 ? this.$session.$data.type1 : "";
        }
        //get data from input
        
            // let input = this.$inputs.type.value;
            //Alexa list
        if(this.$inputs.type || this.$inputs.typeOne){

            if(this.$alexaSkill){
                type =this.$inputs.typeOne.value;
                type2  =this.$inputs.typeTwo.value != undefined ? this.$inputs.typeTwo.value: "";
            }    else {
                type = this.$inputs.type.value
                type2 = this.$inputs.type1 ? this.$inputs.type1.value : this.$inputs.typeOne ? this.$inputs.typeOne : "";
            }
        }
        
        //Save type in session 
        this.$session.$data.type = type ? type : "";
        this.$session.$data.type1 = type2 ? type2 : "";;




        //type2 exist check
        let typeSpeech = type;
        if (type2) {
            // console.log(">>>> two type");
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
            this.$speech.addText(grammar.singularOrPlural(notVery, "is", "are") + " not very effective to " + typeSpeech +".");



        }





        //Create card
        let img = "https://i.imgur.com/F87NLQj.png"
        let title = grammar.titleCase(typeSpeech);
        let content = "";

        //Card content
        if(noEffect> 0 ){
            content +="No Effect:\n"
            content +="\t" + grammar.addAnd(noEffectiveType) + ".";
            content +="\n"
        }
        if(notVery> 0 ){
            content +="Not Very Effective:\n"
            content +="\t" + grammar.addAnd(notVeryType) + " ";
            content +="\n"
        }

        this.showImageCard(title, content,img );



        //Follow up question
        //If already asked for effect/resist
        if (this.$session.$data.loop) {
            this.$speech.addBreak("600ms")
                .addText(`What's the name or type of another pokemon?`);
        } else {
       this.$speech.addBreak("500ms")
            .addText(`Do you want to know what is super effective to ${typeSpeech}?`);
        }
        this.$session.$data.loop = false;

        

        //Prepare reprompt
        this.$reprompt.addText("What is the Pokemon's typing?");

        //Send the speech
        this.ask(this.$speech, this.$reprompt);

    },


    YesIntent() {
        this.$session.$data.loop = true;
        this.toStateIntent("superEffectiveState", "superEffective");




    },

    RepeatIntent(){
        this.toStateIntent("resistState", "resist");

    },

    NoIntent() {

        return this.toIntent('Goodbye');
    },



}

