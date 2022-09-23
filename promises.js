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
    let bool = true;
    let promise1 = new Promise((resolve, reject) => {
        if (bool){
            resolve(200);
        }
        else {
            reject(404);
        }
    });
    // for (p in promise1)
    // //     console.log(p);
    // console.log(promise1);
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