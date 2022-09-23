'use strict';

const { resolve } = require('path');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function main(){
    let promise1 = getInput().then((userInput) => {
        console.log("Got user input");
    });
    let endTime = (Date.now() / 1000) + 10;
    while (Date.now() / 1000 < endTime){
        
    }
    console.log("Promise resolved");
    readline.close();
};

function getInput(){
    let input = readline.question("Enter a number: ", (num) => {
        console.log(`You entered: ${num}`);
    })
    console.log(input);
    return Promise.resolve();
};

function printPromiseParamters(){
    
    let promise1 = new Promise((resolve, reject) => {
        let bool = false;
        if (bool){
            console.log(resolve("Work done"));
        }
        else {
            console.log(reject("Couldn't finish"));
        }
        return;
    });
    promise1.then((ok) => {
        console.log(ok);
    }).catch((err) => {
        console.log(err);
    })
    return;
    // console.log(promise1);
}

printPromiseParamters();
// console.log("Hello World");
// main()
readline.close();