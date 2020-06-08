let pokemonDB = require('./../../db/pokedex.json');
let grammar = require("./../controllers/languageUtils")


//AddPokemon
// addPokemon();


// pokemonName();
googleToAlexa();
function googleToAlexa() {
    fs = require('fs');

    fs.readFile('googleToAlexa.txt', 'utf8', function(err, data){ 
      
        // Display the file content 
        // console.log(data);
        let line =data.split("\n");
        let ret = "";

        for(let i in line){

            let comm = line[i].indexOf(",");
            let temp =line[i];
            temp = temp.slice(0,comm) +  ","   + temp.slice(comm, temp.length-1);
            temp = temp.replace(/"/g, "");

            console.log(temp);
            ret += temp +"\n";
        }

        fs.writeFile('alexaPokemon.txt', ret, function (err) {
            if (err) throw err;
    
            console.log('Saved!');
        });
        




    }); 

}


function pokemonName() {
    fs = require('fs');
    var template = '"Bulbasaur","bulbasaur","BULBASAUR","1"';
    var google = "";
    var alexa = "";

    for (let pokemon in pokemonDB){
        // console.log

        let name  =  pokemon.toString().split(" ");
        let form =  name.shift();
        name = name.toString();
        name = name.replace("," , " ");

        let region = null;
        if(form ==="Alolan") region = ["Alolan", "Alola", "hello", "hola", "aloha", "a low a","a low win"];
        if(form ==="Galarian") region = ["Galarian","galar win", "galorian", "Galar","galer" ];
        
        if(region){

           let googlePokemon = "";
           let alexaPokemon = "";
            for( let i in region ){
                // console.log(region[i]);
            

                googlePokemon +=  `"${region[i]} ${name}","${name} ${region[i]}",`;
                alexaPokemon +=  `${region[i]} ${name},,${name} ${region[i]},`;
            }

            google += grammar.removeLastComma(googlePokemon) + "\n";
            alexa += grammar.removeLastComma(alexaPokemon) + "\n";

        }else{
            googlePokemon +=  `"${name.toLowerCase}","${name} ${region[i]}",`;
            alexaPokemon +=  `${region[i]} ${name},,${name} ${region[i]},`;

            google += grammar.removeLastComma(googlePokemon) + "\n";
            alexa += grammar.removeLastComma(alexaPokemon) + "\n";
        }



    
    }

    console.log(google);
    console.log(alexa);

    let text = "//google\n\n" + google + "\n\n\n//alexa\n\n" + alexa;

    fs.writeFile('pokemonSynonyms.txt', text, function (err) {
        if (err) throw err;

        console.log('Saved!');
    });


}

function addPokemon() {


    fs = require('fs');


    const readline = require('readline-sync');
    let name = "";
    let moo = "";
    let count = 0;
    while (name !== "done") {

        count++;
        name = "Galarian " + grammar.capitalize(readline.question("Pokemon name\n").toLowerCase());
    if(name ==="Galarian Done"){
            break;
    }
        
    
        let number = 'G' + count; //readline.question("Pokemon number\n");
        let type1 = grammar.capitalize(readline.question("Pokemon type\n").toLowerCase());
        let type2 = grammar.capitalize(readline.question("Pokemon type2\n").toLowerCase());


        pokemon[name] = {
            number: 0,
            types: []
        };

        pokemon[name].number = number;
        pokemon[name].types.push(type1);
        if (type2) {
            pokemon[name].types.push(type2);
        }


        console.log(pokemon);

        //  moo = readline.question("continue\n");
        pokemonDB[name] = pokemon[name];
    


    }
    console.log(pokemonDB);

    fs.writeFile('newGalPokemonDB.json', JSON.stringify(pokemonDB), function (err) {
        if (err) throw err;

        console.log('Saved!');
    });
}

