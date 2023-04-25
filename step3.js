const fs = require('fs');
const axios = require('axios');
const { error } = require('console'); //this is to save a bit of coe instead of using console.error
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

//decides if one of the resources is a valid http or a .txt file
function pathOrURL(input){
    if (validURL.isHttpUri(input)){
        webCat(input);
    }
    else {
        cat(input);
    }
}

// pathOrURL(process.argv[2]);
async function requestURL(source){
    try {
        let response = await axios.get(source)   
        return response.data
    }
    catch (error){
        console.log(`Error fetching ${source}: \n ${error}`)
    }  
}

function readAndWriteFile(source, path){

        fs.readFile(source, 'utf8', (err, data) =>{
            
            if (err){
                console.log(`Error reading ${source} : \n ${err.message}`)
                process.exit(1)
            }
            console.log('this is data', data)
            fs.writeFile(path, data, 'utf8', err => {
                if (err){
                    console.log(`Error writing ${source} : \n ${err.message}`)
                    process.exit(1)
                }
            })
        })
}

async function writeDataResponse(path, responseData, source){
    
    fs.writeFile(path, responseData, 'utf8', err => {
        if (err){
            console.log(`Error writing ${source} : \n ${err.message}`)
            process.exit(1)
        }
    })
    
}

async function outArgumentHandler(path, source){

    if (validURL.isHttpUri(source)){
        let responseData = await requestURL(source);
        writeDataResponse(responseData, path, source)
    }
    else{
        readAndWriteFile(args);
    }

}


async function functionHandler(...args){
    if (process.argv.includes('--out')){
        console.log('out flag was tri')
    }
    args = args[0];
    console.log('******************************', args)
    
    
    if (args[2] == '--out'){   
        let path = args[3]
        let source = args[4]
        
        outArgumentHandler(path, source);
        
    }
    else {
        pathOrURL(args[3])
    }
}

functionHandler(process.argv)