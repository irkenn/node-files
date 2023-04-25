const fs = require('fs');
const axios = require('axios');
const { error } = require('console'); //this is to save a bit of coe instead of using console.error
const validURL = require('valid-url');


function writeFiles(path, data){
    fs.writeFile(path, data, {encoding:'utf8', flag: 'a'}, err => {
        if (err){
            console.log(`Error writing ${path} : \n ${err.message}`)
            process.exit(1)
        }
    });
}


async function requestHandler(argument, path, flag){
    try{
        let responseData = await axios.get(argument)
        if (flag == true && responseData.status == 200){
            console.log('responseData', responseData.data)
            writeFiles(path, responseData.data)
        }
        else if (flag== false && responseData.status == 200){
            console.log(responseData.data)
        }
        else {
            console.log(`Error fetching ${argument}, status code of ${responseData.status}`)
        }
    }
    catch (error){
        console.log(`Error fetching ${argument}: \n ${error}`)
    }
}


function fileHandler(argument, path, flag){
    
    fs.readFile(argument, 'utf8', (err, data) =>{  
        if (err){
            console.log(`Error reading ${argument} : \n ${err.message}`)
            process.exit(1)
        }
        else if(flag==false){
            console.log('this is data', data)
        }
        else if (flag==true){
            fs.writeFile(path, data, 'utf8', err => {
                if (err){
                    console.log(`Error writing ${argument} : \n ${err.message}`)
                    process.exit(1)
                }
            })
        }
    })
}


async function checkForValidUrlsOrText(list, path, flag=false){
    
    for (argument of list){    
        console.log('this is argument', argument);
        if (validURL.isHttpUri(argument)){
            requestHandler(argument, path, flag)
        }
        else {
            fileHandler(argument, path, flag)
        }
    }
}


async function checkPath(path){ 
    if (fs.existsSync(path)){
    }
    else{
        return console.log(`Couldn't write ${path}`)
    }
}


async function functionHandler(...args){
    
    args = args[0];
    let flag = process.argv.includes('--out')
    if (flag){
        let path = args[3]
        let sources = args.slice(4)
        checkPath(path)
        checkForValidUrlsOrText(sources, path, flag)
           
    }
    else if (flag == false){
        let path = args[2]
        let sources = args.slice(3)
        checkPath(path)
        checkForValidUrlsOrText(sources, path, flag)
    }
}

functionHandler(process.argv)