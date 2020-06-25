"use strict";

/*
 *  @REDPWNCTF 2020
 *  @AUTHOR Jim
 */

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const request = require("request");
const url = require("url");
const fs = require("fs");

const conn = mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "redpwnuser",
    password: "redpwnpassword",
    database: "gotstacks",
    multipleStatements: "true"
});

conn.connect({ function(err){
        if(err){
            throw err;
        }else{
            console.log("mysql connection success");
        }
    }
});

const KEYWORDS = [
    "union",
    "and",
    "or",
    "sleep",
    "hex",
    "char",
    "db",
    "\\\\",
    "/",
    "*",
    "load_file",
    "0x",
    "fl",
    "ag",
    "txt",
    "if"
];

const waf = (str) => {
    for(const i in KEYWORDS){
        const key = KEYWORDS[i];
        if(str.toLowerCase().indexOf(key) !== -1){
            return true;
        }
    }
    return false;
}

const isValid = (ip) => {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)){
      return (true)
    }
  return (false)
}

const isPrivate = (ip) => {
    const parts = ip.split(".");
    return parts[0] === '10' ||
    (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) ||
    (parts[0] === '192' && parts[1] === '168');
}

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.post("/api/initializedb", function(req, res){
    const body = req.body;
    if(body.hasOwnProperty("filename")){
        if(!fs.readdirSync('db').includes(body.filename)) return res.status(400).send("File not found");
        try{
            const sql = fs.readFileSync("db/" + body.filename).toString();
            conn.query(sql, function(error, results, fields){
                res.status(200).send("Success! Database has been intialized");
            });
        } catch(err){
            if(err.code = "EOENT"){
                res.status(400).send("File not found");
            }else{
                res.status(400).send("Bad request");
            }
        }
    }else{
        res.status(400).send("Bad request");
    }
});

app.post("/api/registerproduct", function (req, res) {
    const body = req.body;
    if(body.hasOwnProperty("stockid") && body.hasOwnProperty("name") && body.hasOwnProperty("quantity") && body.hasOwnProperty("vurl")){
        if(!(waf(body.stockid) || waf(body.name) || waf(body.quantity) || waf(body.vurl))){

            let query = "SELECT * FROM stock WHERE stockid = ? LIMIT 1";

            conn.query(query, [req.body.stockid], function(error, results, fields){
                if (error){
                    res.status(500).send("Internal server error");
                    return;
                }

                if(results.length > 0){
                    res.status(400).send("stockID already exists");
                    return;
                }else{
                    query = "INSERT INTO stock (stockid, name, quantity, vurl) VALUES (" + body.stockid + ", '" + body.name + "', " + body.quantity + ", '" + body.vurl + "');";

                    conn.query(query, function(error, results, fields){
                        res.status(200).send("Success! Record was created");
                    });
                }
            });
        }else{
            res.status(403).send("Hacking attempt detected");
        }
    }else{
        res.status(400).send("Bad request");
    }
});

app.post("/api/notifystock", function(req, res){
    const body = req.body;
    if(body.hasOwnProperty("stockid")){
        let query = "SELECT * FROM stock WHERE stockid = ? LIMIT 1";

        conn.query(query, [req.body.stockid], function(error, results, fields){
            if (error){
                res.status(500).send("Internal server error");
                return;
            }

            if(results.length > 0){
                if(results[0].quantity > 0){
                    res.status(400).send("Stock is not empty!");
                }else{
                    if(isValid(results[0].vurl.split("/")[0]) && isPrivate(results[0].vurl.split("/")[0])){
                        try {
                            request.get("http://" + results[0].vurl);
                        } catch(err){
                            console.log("get request failed");
                        }
                        res.status(200).send("Thank you! The vendor has been notified");
                    }else{
                        let options = {
                            url: "https://dns.google.com/resolve?name=" + results[0].vurl.split("/")[0] + "&type=A",
                            method: "GET",
                            headers: {
                                "Accept": "application/json"
                            }
                        }

                        request(options, function(err, dnsRes, body){
                            let jsonRes;
                            try {
                                jsonRes = JSON.parse(body);
                            }catch(err){
                                res.status(400).send("Bad request body");
                                return;
                            }
                            try {
                                const ip = jsonRes["Answer"][0]["data"];
                                if(isPrivate(ip)){
                                    try{
                                        request.get("http://" + results[0].vurl);
                                    } catch(err){
                                        console.log("get request failed");
                                    }
                                    res.status(200).send("Thank you! The vendor has been notified");
                                }else{
                                    res.status(403).send("Thank you! But the address the vendor provided is improper, we will let them know next time we see them");
                                }
                            }catch(err){
                                res.status(403).send("Thank you! But the address the vendor provided is improper, we will let them know next time we see them");
                            }
                        })
                    }
                }
            }else{
                res.status(404).send("Stockid not found");
            }
        });
    }else{
        res.status(400).send("Bad request");
    }
});

app.listen(31337, () => {
    console.log("express listening on 31337");
});
