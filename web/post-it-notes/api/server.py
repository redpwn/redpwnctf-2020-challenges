#!/usr/bin/env python3
# i use arch btw

from flask import Flask, render_template, request
from werkzeug.serving import WSGIRequestHandler, BaseWSGIServer

import subprocess
import json

app = Flask(__name__)


def get_note(nid):
    stdout, stderr = subprocess.Popen(f"cat 'notes/{nid}' || echo it did not work btw", shell = True, stdout = subprocess.PIPE, stderr = subprocess.PIPE, stdin = subprocess.PIPE).communicate()
    if stderr:
        print(stderr) # lemonthink
        return {}
    return {
        'success' : True,
        'title' : nid,
        'contents' : stdout.decode('utf-8', errors = 'ignore')
    }


def write_note(title, contents):
    nid = str(title)[:0xff]
    contents = str(contents)[:0xff]
    stdout, stderr = subprocess.Popen(f"cat > 'notes/{nid}'", shell = True, stdout = subprocess.PIPE, stderr = subprocess.PIPE, stdin = subprocess.PIPE).communicate(input = bytes(contents, 'utf-8'))
    print('made note:', stdout, stderr)
    return {
        'success' : True,
        'title' : nid,
        'contents' : contents
    }


@app.route('/')
def index():
    return 'pong'


@app.route('/api/v1/notes/', methods = ['GET', 'POST'])
def notes():
    # 
    # NOTE: be sure to read this line below, or the following things will happen:
    # 1. You'll spend several hours trying to figure out why your exploit isn't working
    # 2. Then, once you realized I literally warned you about this, you'll be mad.
    # 3. Because you spent hours trying to fix your own exploit, you'll call this chal "guessy"
    # 4. The redpwnCTF CTFTime score will go down because you will downvote it over this chal (plz no)
    # 5. You won't win the CTF (HackerOne hoodies!!!) because you spent so long on this chal.
    # 
    # tl;dr LITERALLY just READ THE CODE CAREFULLY! I am GIVING you the source, you don't even need 
    # to add ?source or use LFI or anything!
    # 
    # ^^^ btw I gotchu, just hmu if u want me to :leek: u some flags ;))
    # 

    #if request.headers.get('Authorization') != 'his name is john connor':
    #    return {'success' : False, 'note' : 'u a fake'}

    # nevermind guys haha i changed my mind, this is a secret webserver, we don't need authorization header since bad guys can never access it anyway!!!!!!!111oneoneoneeleven

    ret_val = {'success':True}
    title = request.values['title']
    if 'contents' not in request.values: # reading note
        note = get_note(str(title)[:0xff])
        ret_val.update(note)
    else: # writing note
        contents = request.values['contents']
        ret_val.update(write_note(str(title)[:0xff], str(contents)))

    return json.dumps(ret_val)


def start(backend_port):
    WSGIRequestHandler.protocol_version = "HTTP/1.1"
    app.run(host='0.0.0.0', port=backend_port, debug=False)
