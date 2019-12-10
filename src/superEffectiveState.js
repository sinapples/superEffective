module.exports = {
    superEffective() {


        //Get inputs
        const input = this.$inputs.name


        //logic
        let speech = getCounters("", "");



        //Prepare Speach
        this.$speech.addText(speech);

        //Prepare reprompt
        this.$reprompt.addText("Hello there");

        //Send the speech
        this.ask(this.$speech, this.$reprompt);

    },


    getCounters(type1, type2) {

        return "Moo working on it";

    }
}