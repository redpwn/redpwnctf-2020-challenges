FROM python:3.8

RUN apt-get update -y && apt-get install -y \
    xinetd \
 && rm -rf /var/lib/apt/lists/*

RUN useradd -m ctf

COPY ./ctf.xinetd /etc/xinetd.d/ctf
COPY ./start.sh /start.sh
RUN echo "Blocked by ctf_xinetd" > /etc/banner_fail

RUN chmod +x /start.sh

RUN mkdir -p /chal
WORKDIR /chal

COPY ./flag.txt /chal/flag.txt
COPY ./flag.txt /flag.txt
COPY ./aall.py /chal/aall.py
COPY ./aall.sh /aall.sh

RUN chown -R root:ctf /chal /aall.sh && \
    chmod 750 /chal/aall.py /aall.sh && \
    chmod 640 /chal/flag.txt /flag.txt && \
    chmod 1775 /chal

CMD ["/start.sh"]

EXPOSE 9999
