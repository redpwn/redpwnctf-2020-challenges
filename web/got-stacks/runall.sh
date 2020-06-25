#!/bin/bash

cp db/setup.sql /docker-entrypoint-initdb.d/

/docker-entrypoint.sh mysqld &

until mysql -uredpwnuser -predpwnpassword -h127.0.0.1 -e 'select 1'; do echo "waiting for mysql"; sleep 5; done

su ctf -c "node server.js"
