"use strict";

/*
 *  @REDPWNCTF 2020
 *  @AUTHOR Jim
 */

const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const mcache = require('memory-cache');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");

const app = express();
const client  = redis.createClient('redis://redis:6379');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(session({
    secret: 'redpwn_supersecret_4089as4e680351SSEIfJOSICVJ9zed1234', // TODO remove in given source
    store: new redisStore({ host: 'redis', port: 6379, client: client}),
    saveUninitialized: false,
    resave: false
}));
app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    res.setHeader("X-Frame-Options", "DENY")
    return next();
});
app.set('view engine', 'ejs');

const middleware = (duration) => {
    return(req, res, next) => {
        const key = '__rpcachekey__|' + req.originalUrl + req.headers['host'].split(':')[0];
        let cachedBody = mcache.get(key);
        if(cachedBody){
            res.send(cachedBody);
            return;
        }else{
            res.sendResponse = res.send;
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body);
            }
            next();
        }
    }
};

app.get('/create', function (req, res) {
    let sess = req.session;

    if(!sess.viperId){
        const newViperId = uuidv4();

        sess.viperId = newViperId;
        sess.viperName = newViperId;
    }
    res.redirect('/viper/' + encodeURIComponent(sess.viperId));
});

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/viper/:viperId', middleware(20), function (req, res) {
    let viperId = req.params.viperId;
    let sess = req.session;

    const sessViperId = sess.viperId;
    const sessviperName = sess.viperName;

    if(sess.isAdmin){
        sess.viperId = "admin_account";
        sess.viperName = "admin_account";
    }

    if(viperId === sessViperId || sess.isAdmin){
        res.render('pages/viper', {
            name: sessviperName,
            analyticsUrl: 'http://' + req.headers['host'] + '/analytics?ip_address=' + req.headers['x-real-ip']
        });
    }else{
        res.redirect('/');
    }
});

app.get('/editviper', function (req, res) {
    let viperName = req.query.viperName;
    let sess = req.session;

    if(sess.viperId){
        sess.viperName = viperName;
        res.redirect('/viper/' + encodeURIComponent(sess.viperId));
    }else{
        res.redirect('/');
    }
});

app.get('/logout', function (req, res) {
    let sess = req.session;

    sess.destroy();

    res.redirect('/');
});

app.get('/analytics', function (req, res) {
    const ip_address = req.query.ip_address;

    if(!ip_address){
        res.status(400).send("Bad request body");
        return;
    }

    client.exists(ip_address, function(err, reply) {
        if (reply === 1) {
            client.incr(ip_address, function(err, reply) {
                if(err){
                    res.status(500).send("Something went wrong");
                    return;
                }
                res.status(200).send("Success! " + ip_address + " has visited the site " + reply + " times.");
            });
        } else {
            client.set(ip_address, 1, function(err, reply) {
                if(err){
                    res.status(500).send("Something went wrong");
                    return;
                }
                res.status(200).send("Success! " + ip_address + " has visited the site 1 time.");
            });
        }
    });
 });

 // README: This is the code used to generate the cookie stored on the admin user

 app.get('/admin/generate/:secret_token', function(req, res) {
    const secret_token = "redpwn_supersecret_JKHSDKIJTO$sdfse93efnsf"; // TODO remove in given source
    
    if(req.params.secret_token === secret_token){
        let sess = req.session;

        sess.viperId = "admin_account";
        sess.viperName = "admin_account";
        sess.isAdmin = true;
    }
    
    res.redirect('/');
 });

 const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
 };

 app.get('/admin', function (req, res) {
    let sess = req.session;

    if(sess.isAdmin){
        client.exists('__csrftoken__' + sess.viperId, function(err, reply) {
            if(err){
                res.status(500).send("Something went wrong");
                return;
            }
            if (reply === 1) {
                client.get('__csrftoken__' + sess.viperId, function(err, reply) {
                    if(err){
                        res.status(500).send("Something went wrong");
                        return;
                    }
                    res.render('pages/admin', {
                        csrfToken: Buffer.from(reply).toString('base64')
                    });
                });
            } else {
                const randomToken = getRandomInt(10000, 1000000000);
                client.set('__csrftoken__' + sess.viperId, randomToken, function(err, reply) {
                    if(err){
                        res.status(500).send("Something went wrong");
                        return;
                    }
                    res.render('pages/admin', {
                        csrfToken: Buffer.from(randomToken).toString('base64')
                    });
                });
            }
        });
    }else{
        res.redirect('/');
    } 
 });

 app.get('/admin/create', function(req, res) {
    let sess = req.session;
    let viperId = req.query.viperId;
    let csrfToken = req.query.csrfToken;

    const v4regex = new RegExp("^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$", "i");
    if(!viperId.match(v4regex)){
        res.status(400).send("Bad request body");
        return;
    }

    if(!viperId || !csrfToken){
        res.status(400).send("Bad request body");
        return;
    }

    if(sess.isAdmin){
        client.exists('__csrftoken__' + sess.viperId, function(err, reply) {
            if(err){
                res.status(500).send("Something went wrong");
                return;
            }
            if (reply === 1) {
                client.get('__csrftoken__' + sess.viperId, function(err, reply) {
                    if(err){
                        res.status(500).send("Something went wrong");
                        return;
                    }
                    if(reply === Buffer.from(csrfToken, 'base64').toString('ascii')){
                        const randomToken = getRandomInt(1000000, 10000000000);
                        client.set('__csrftoken__' + sess.viperId, randomToken, function(err, reply) {
                            if(err){
                                res.status(500).send("Something went wrong");
                                return;
                            }
                        });

                        sess.viperId = viperId;
                        sess.viperName = fs.readFileSync('./flag.txt').toString();

                        res.redirect('/viper/' + encodeURIComponent(sess.viperId));
                    }else{
                        res.status(401).send("Unauthorized");
                    }
                });
            } else {
                res.status(401).send("Unauthorized");
            }
        });
    }else{
        res.redirect('/');
    }
 });

app.listen(31337, () => {
    console.log("express listening on 31337");
});