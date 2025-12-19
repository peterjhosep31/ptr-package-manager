#!/usr/bin/env node

import RequestNotProcessed from "./Manager/RequestNotProcessed.ts";

(() => {
    let args = process.argv.slice(2);
    let comman = args[0];
    args = args.slice(1);


    if (!!comman === false)
        return console.log("Debe de proporcionar un comando. \nIngrese el comando --help");

    comman = comman.toLowerCase();

    console.log(comman);

    switch (comman) {

        case "--help":
            (new RequestNotProcessed()).getCommands();
            break;

        case "install":
        case "i":
            console.log("Installing...");
            break;

        default:
            return console.log("Comando desconocido. \nIngrese el comando --help");
    }
    console.log("Args:", args);
})();
