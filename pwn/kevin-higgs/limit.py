#!/usr/bin/env python3

from rctf import golf
import os

rate = 1 / 12
base = 1

print(golf.calculate_limit(
    'https://staging.redpwn.net/' if os.environ.get('DEBUG') else 'https://2020.redpwn.net/',
    'kevin-higgs', # challenge id
    1592769600, # CTF start date
    lambda hours : int(base + (hours * rate))
))
