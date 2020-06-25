#!/usr/bin/env python3

from api import server as api_server
from web import server as web_server

import threading, random

if __name__ == '__main__':
    backend_port = random.randint(50000, 51000)

    at = threading.Thread(target = api_server.start, args = (backend_port,))
    wt = threading.Thread(target = web_server.start, args = (backend_port,))

    at.daemon = True
    wt.daemon = True

    at.start()
    wt.start()

    at.join()
    exit() # something is wrong
    wt.join()
    exit() # something is wrong
