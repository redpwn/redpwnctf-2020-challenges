FROM python:3.7-buster

RUN apt-get update -yqq && apt-get install -y \
    lib32z1 xinetd curl \
 && rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade --no-cache-dir -I rctf-golf==1.0.5

RUN useradd -m ctf

WORKDIR /

COPY ./ctf.xinetd /etc/xinetd.d/ctf
COPY ./start.sh /start.sh
COPY ./flag.txt /flag.txt
COPY ./albatross.py /albatross.py
RUN echo "Blocked by ctf_xinetd" > /etc/banner_fail

RUN chmod +x /start.sh

RUN chown root:ctf /albatross.py flag.txt && \
    chmod 750 /albatross.py && \
    chmod 740 /flag.txt

CMD ["/start.sh"]

EXPOSE 9999
