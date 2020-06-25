FROM python:3.8

RUN useradd -m ctf

COPY ./source.zip /source.zip
RUN mkdir -p /chal
WORKDIR /chal
RUN unzip /source.zip 

COPY ./flag.txt /flag.txt
COPY ./flag.txt /chal/flag.txt

RUN pip3 install --upgrade --no-cache-dir flask requests

RUN chown -R root:ctf /chal && \
    chmod 750 /chal /chal/main.py && \
    chmod 740 /chal/flag.txt /flag.txt && \
    chmod 777 /chal/notes/

USER ctf
CMD ["/usr/local/bin/python", "/chal/main.py"]

EXPOSE 1337
