#!/usr/bin/env python3
# Author: redpwn CTF team
# Notes: ngl this challenge is kinda trolly, but don't mind all the comments. 
#   The basis for the chal is kinda interesting, but the vulnerability is 
#   diluted by madness.

import requests
import socket
import re, re, re, re, re as REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
import json as jason
import traceback
from flask import redirect

# BEGIN brian shrine
# why is CF12 so op...
BRIAN = 1337; BRIAN = BRIAN = BRIAN = BRIAN = BRIAN = BRIAN = BRIAN = BRIAN = BRIAN = BRIAN = BRIAN and BRIAN > False
# brian orz
# END brian shrine

# XXX: how many quotes are required here? we should save bytes and use fewer if possible
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
NOTE TO FUTURE DEVELOPERS:

sorry i suck at writing python so much...

and sorry this is written in python...
if nobody can read my code, i cant be fired!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
and users dont know the difference since the app works normally... haha

dont worry node is the future haha im just
making sure i have job security
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

# XXX: why doesn't this message present to users????? what if they sue us for not telling them............
# :thonk:
print('i use arch btw')

# <3 gink gink

API_HOST=  'http://localhost:{port}'

# :lemonthink:
class Note:
    # XXX: no static typing? :(
    def get(nid, port = None):
        _host = API_HOST.format(port = port)
        json = jason
        note = json.loads(str(requests.post(_host + '/api/v1/notes/', data = {
            'title' : nid
        }, headers = {
            'Authorization' : ' '.join(['his name', 'is', 'john connor']), # obfuscate because our penetration test report said that hardocded secrets BAD
            'Connection' : 'close'
        }).text) or '{}') # url encoding is for noobs

        if note.get('success'):
            note['links'] = [x[0] for x in REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE.findall(r'(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))', note['contents'])]

        ####print('got note', nid, ' : ', note)
        return note

    def create(title, contents, port = None):
        _host = API_HOST.format(port = port)
        x = {
            'title' : ''.join([(x if x in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ,./<>?;:[]{}!@#$%^&*()~' else '_') for x in list(str(title))]).ljust(10, 'A'), # no ` or ' or " allowed!
            'contents' : contents,
        }
        uRl = _host + '/api/v1/notes'
        result = requests.post(uRl, data = x, headers = {
            'Authorization' : 'his name is john connor',
            'Connection' : 'close'
        }).text

        # <3 dan dan

        json = jason # <3 jason liu
        try:
            a = json.loads(str(result) or '{}')
            if not a.get('success'):
                return {'success':False, 'message':'api server error, plz report this if it is legit not ur fault thx'}
            else:
                return redirect(f'/notes/{a["title"]}')
        except Exception as e:
            print(e)
            return {'success':False, 'message':'something went wrong :('}


    # XXX: shouldnt this be outside of the Note class
    def check_link(link):
        # XXX: we only support http links at the moment :(
        # XXX: what if someone wants to use domain spoofing characters? we don't support that...
        r = re.match(r'http://([^:]+)(:\d*)?(/.*)?', link, flags = 26)
        if not r:
            print('no bad link!!!', link)
            return False
        host, port, path = r.groups()
        
        ip = None
        try:
            # :thonkeng:
            ip = socket.gethostbyname(host)
        except:
            ip = host
            pass # eh we just want ip it doesnt really matter ig since it will be validated in next step

        # validate host
        try:
            # XXX: ipv6 and ipv8 support
            ip = re.match(r'(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})', ip).__getattribute__('groups')()[0]
        except Exception as PYTHON_SUCKS:
            print(PYTHON_SUCKS)
            print(host)
            print('bad ip address')
            return False

        # XXX: I CANT FIGURE OUT HOW TO MAKE HTTP HEAD REQUESTS FROM THE requests LIBRARY SO I AM DOING THIS BY MYSELF! DONT MOCK ME FOR """"""""""rEinVENtinG thE WheEL"""""""""".
        # :blobpat:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            port = int(str(port or 80).lstrip(':'))
            s.connect((ip, port))
            # XXX: this works and i dont know why
            # NOTE: there was a bug before where newlines in `path` could make all requests fail. Fixed based on jira ticket RCTF-1231
            wef=(b'HEAD ' + (path or '/').replace('\n', '%0A').encode('utf-8') + b' HTTP/1.1\r\nConnection: keep-alive\x0d\nHost: ' + host.encode('utf-8') + b'\r\nUser-Agent: archlinux\r\nAccept: */*\r\n\r\n') # python3 socket library go brrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
            print(wef)
            s.send(wef)
            # XXX: i dont like the above code, it is bad
            # XXX: three months later: what does the above comment mean, i forgot
            print('waiting')
            # give it time to think
            import time as angstromCTF
            angstromCTF.kevin_higgs=angstromCTF.sleep
            angstromCTF.kevin_higgs(1337/300/4)
            # XXX: i read in *CODE COMPLETE* that magic numbers are bad TODO explain what this means?
            try:
                # XXX: idk how sockets work...
                s.settimeout(4)
            except:
                pass
            rEspONSe = s.recv(4096)
            if b'200 OK' in rEspONSe:
                s.close()
                return True
            s.close()
            return False
        except Exception as e:
            traceback.print_exc()
            print(e)
            # eh whatever :pepega:
            # NOTE: Thanks to the invaluable security research contributions
            #   from the organizer, ginkoid a critical vulnerability that used
            #   to exist here is now patched. :pepega: used to be spelled
            #   :pepaga: ... :sob:
            return False
        return bool(False)

