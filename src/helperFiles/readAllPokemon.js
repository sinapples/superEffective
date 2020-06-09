
let pokemonDB = require('./newPokemon.json');
fs = require('fs');
function count() {


    let ret = "";


    for(let pokemon in pokemonDB){
        ret += pokemonDB[pokemon].number + " "  +pokemon + "\n";


    }



    fs.writeFile('pokemonCount.txt', ret, function (err) {
        if (err) throw err;

        console.log('Saved!');
    });


}



function read() {

    // fs = require('fs');
    // console.log("mooooooooooo\n\n");

    fs.readFile('pokemon.txt', 'utf8', function (err, data) {
        if (err) throw err;
        // data = "moo\nmoo";
        // Display the file content 
        // console.log("data"+ data);
        let line = data.split("\n");
        let ret = "";
        let json = {};
        
        for (let i = 0; i < line.length;) {
            i++;
            if(!line[i].includes("#")){
                console.log(line[i]);
                break;
            }
            let number = parseInt(line[i].substring(1, line[i].length));
            console.log(line[i]);
            i++
            let name = line[i];
            i++;
            let type = [];
            //dual
            if (line[i].includes("·")) {
                let typeList = line[i].split("·");
                type.push(typeList[0].trim())
                type.push(typeList[1].trim())
            }
            //single
            else {
                type.push(line[i].trim());
            }

            i++




            json[name] = {
                number: number,
                types: type
            }




        }

        fs.writeFile('newPokemon.json', JSON.stringify(json), function (err) {
            if (err) throw err;

            console.log('Saved!');
        });


    })



}


// read();
count();
