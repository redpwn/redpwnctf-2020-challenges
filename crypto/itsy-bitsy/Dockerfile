FROM python:3.8-buster

RUN apt-get update && apt-get install -y \
    xinetd \
 && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir \
    pycryptodome

COPY ctf.xinetd /etc/xinetd.d/ctf

COPY itsy-bitsy.py flag.txt /

CMD ["xinetd", "-dontfork"]

EXPOSE 9999