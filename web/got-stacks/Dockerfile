FROM mariadb:latest

# Add Tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

RUN apt-get update -yqq && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -ssL https://raw.githubusercontent.com/tj/n/master/bin/n | bash -s -- 13

RUN echo "[mysqld]" >> /etc/mysql/my.cnf && \
    echo "secure_file_priv=\"/home/ctf\"" >> /etc/mysql/my.cnf

RUN useradd -m ctf

COPY ./flag.txt /home/ctf
COPY ./app /home/ctf/app

RUN chown -R mysql:mysql /home/ctf/app/db

WORKDIR /home/ctf/app

RUN npm install

COPY ./runall.sh /home/ctf/app
RUN chmod +x runall.sh

ENV MYSQL_RANDOM_ROOT_PASSWORD=1
ENV MYSQL_INITDB_SKIP_TZINFO=1

CMD ["./runall.sh"]
