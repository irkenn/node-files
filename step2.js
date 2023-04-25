const fs = require('fs');
const axios = require('axios');
const { error } = require('console');
const validURL = require('valid-url');

function cat(path){
    fs.readFile(path, 'utf8', (err, data) => {
        if (err){
            console.log(`Error reading ${path} : \n ${err.message}`)
            process.exit(1)
        }
        console.log(data)
    })
};

// USE A TRY CATCH
async function webCat(path){
    try {
        let response = await axios.get(path)
        console.log(response.data)
    }
    catch (error){
        console.log(`Error fetching ${path}: \n ${error}`)
    }    
};


function pathOrURL(input){

    if (validURL.isUri(input)){
        webCat(input);
    }
    else {
        cat(input);
    }
}

pathOrURL(process.argv[2]);

