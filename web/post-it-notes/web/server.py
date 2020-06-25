#!/usr/bin/env python3
# i use arch btw

from flask import Flask, render_template, request
from werkzeug.serving import WSGIRequestHandler, BaseWSGIServer
from notes import *

import threading


class local(Flask):
    def process_response(self, response):
        response.headers['server'] = 'arch linux webserver'
        super(local, self).process_response(response)
        return(response)

app = local(__name__)

BACKEND_PORT = None


@app.route('/')
def index():
    return render_template('index.html');


@app.route('/notes/<nid>')
def notes(nid):
    try:
        n = Note.get(nid, port = BACKEND_PORT)
        return render_template('note.html', note = n)
    except:
        return render_template('error.html')


@app.route('/create', methods = ['POST'])
def create_note():
    data = request.form
    # id(...) is rAndoMNesS
    return (Note.create(data.get('title', 'example') + str(id(request.form)), data.get('contents', 'the user didnt know how to use this api endpoint so its an empty post now lol'), port = BACKEND_PORT))


@app.route('/check-links', methods = ['POST'])
def check_post():
    # check for broken links
    ret_val = dict()
    links = request.form.get('links')
    if isinstance(links, str):
        links = [links]
    for link in links:
        ret_val[link] = Note.check_link(link)
    return ret_val # :pepega:


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/.git/config')
def gitconfig():
    return 'i use arch btw' # don't use dirsearch !!!!


@app.route('/protected-by-captcha.png')
def captcha():
    return app.send_static_file('protected-by-captcha.png')


def start(backend_port):
    global BACKEND_PORT
    BACKEND_PORT = backend_port
    BaseWSGIServer.protocol_version = "HTTP/1.1"
    app.run(host='0.0.0.0', port=1337, debug=False)

