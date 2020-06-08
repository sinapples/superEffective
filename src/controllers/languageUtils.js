
	 addAnd = (list) => {
        list = list.filter(Boolean);
        var numberOfItems = list.length;
        
        if (numberOfItems == 0){return ''}
        
        var ret = '';
                
        for (var i = 0; i < numberOfItems; i++){
                
            ret = ret + ' '; 
            if (i == numberOfItems-2 && !(numberOfItems <= 1)){
                ret = ret + list[i] + ', and';
                    
            }else if (numberOfItems > 1 && i != numberOfItems-1){
                ret = ret + list[i] +',';
            }else {
                ret = ret + list[i];
            }
            
        }
        
        return ret.trim();
        
    }

    addOr = (list) => {
        list = list.filter(Boolean);
        let numberOfItems = list.length;
        
        if (numberOfItems == 0){return ''}
        
        let ret = '';
                
        for (var i = 0; i < numberOfItems; i++){
                
            ret = ret + ' '; 
            if (i == numberOfItems-2 && !(numberOfItems <= 1)){
                ret = ret + list[i] + ', or';
                    
            }else if (numberOfItems > 1 && i != numberOfItems-1){
                ret = ret + list[i] +',';
            }else {
                ret = ret + list[i];
            }
            
        }
        
        return ret.trim();
        
    }
        
     singularPlural =(count, singular, plural) =>{
        
        if (count >1 ){
            return plural;
        } else if (count == 1){
            return  singular;
        }else{
            return '';
        }
    }

    capitalizeWords = (text ) =>{

        let words = text.split(" ");
        let ret = "";
        for(let i in words){
           ret += capitalize(words[i]) + " ";
        }

        return removeLast(ret);


    }

    capitalize = (text ) =>{

        if(text.charAt(0)===" "){
            return " " +text.charAt(1).toUpperCase() + text.substring(2);
        }
        return text.charAt(0).toUpperCase() + text.substring(1);
    }

    titleCase = (text ) =>{

        const noCap = ["and" ,"the" ,"or" ]
        let ret = "";
        text = text.trim();
        text = text.split(" ");
        for( let i in text){
            if(!noCap.includes(text[i])){
                ret += capitalize(text[i]) + " ";
            }else{
                ret += text[i] + " ";
            }
        }

        return capitalize(ret.trim());


    }

    removeLast = (text) => {
        if(text.charAt(text.length-1)===',' || text.charAt(text.length-1)===' ')
            text = text.substring(0, text.length - 1);
        return text;
    }

module.exports = {
    singularOrPlural: singularPlural,
    addAnd: addAnd,
    addOr: addOr,
    capitalize: capitalizeWords,
    titleCase: titleCase,
    removeLastComma: removeLast,
    capitalizeWords:capitalizeWords
}


// console.log(singularPlural(0 ,"This type","These types") );
// console.log("use"+ addAnd(["water" ]) );
// console.log(capitalize("hello world") );
// console.log(titleCase("the hello  the moo and world") );
// console.log(titleCase("wooloo") );

