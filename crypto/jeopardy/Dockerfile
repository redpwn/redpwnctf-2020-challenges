FROM sagemath/sagemath:9.0-py3

USER root

RUN useradd -m app \
 && mkdir -m 700 /home/app/.sage \
 && chown app:app /home/app/.sage
ENV HOME /home/app
COPY flag.txt /
COPY jeopardy.sage /home/app/

USER app
WORKDIR /
CMD ["sage", "/home/app/jeopardy.sage"]

EXPOSE 9999
