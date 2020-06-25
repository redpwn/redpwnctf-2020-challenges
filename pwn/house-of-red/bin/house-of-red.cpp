#include <iostream>
#include <string>
#include <string.h>
#include <cstdio>
#include <stdlib.h>
#include <stdio.h>

using namespace std; 

void send(string s);
void resize(long len);
void process();
void recv();

long size;
int reqs = 0;
char* buffer;

int main(void)
{
  setbuf(stdout, NULL);
  setbuf(stdin, NULL);
  setbuf(stderr, NULL);

  recv();
}

void recv() {
  reqs++;

  size = 0x30;

  free(buffer);
  buffer = (char*) malloc(size);

  if(reqs > 10) {
    cout << "HTTP/1.1 500 Not Found" << endl;
    send("<p>Your free trial has expired :(</p>");
    _Exit(0);
  }

  string line; 
  getline(cin, line);
    
  if(line == "POST /red HTTP/1.1") {
    cout << "HTTP/1.1 200 OK" << endl;
    
    process();
    
    if(buffer != NULL) {
      for(int i = 0; i < size; i++) {
        buffer[i] = 0;
      }
      buffer[size] = 0;
    }

    
    int x;
    cin >> x;
    
    snprintf(buffer, 0x100, "<p style=\"color: red\">%d</p>", x);

    send(buffer);
  } else if (line.rfind("GET /", 0) == 0) {
    cout << "HTTP/1.1 200 OK" << endl;
    send("<!DOCTYPE html><html><head><title>House of Red</title><style>  body, html {    margin: 0;    height: 100%;    font-family: monospace;        background-color: black;  }</style></head><body><div style='display: flex; height: 100%; justify-content: center; align-items: center;'><div style='background-color: #181818; color: white; padding: 35px; box-shadow: 10px 10px 5px 0px rgba(255,0,0,0.2);'><p>Red as oloroso, white as smog.</p><p>Send a POST, to slash red.</p></div></div><!-- Request number #" + to_string(reqs) + " --></body></html>");

    recv();
  } else {
    cout << "HTTP/1.1 404 Not Found" << endl;
    send("<p>Your page was not found :(</p>\n<p>Click <a href='/'>here to go back</a></p>");
    recv();
  }

  _Exit(0);
}


inline void resize(long len) {
  if(len >= size) {
    free(buffer);
    buffer = (char*) malloc(len);
  }
  size = len;
}

void process() {
  string line;

  getline(cin, line);

  if(line.length() == 0) {
    return;
  }
  if(line.rfind("Content-Length", 0) == 0) {
    int len = stoi(line.substr(16));
    
    resize(len);
  } else if(line.rfind("X-Debug", 0) == 0) {
    printf("X-Buffer: %s\n", buffer);
  }
  process();
}

void send(string s) {
  cout << "Content-Length: " << s.length() << endl;
  cout << "Content-Type: text/html" << endl;
  cout << "Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'" << endl;
  cout << "Referrer-Policy: no-referrer" << endl;
  cout << "X-XSS-Protection: 1; mode=block" << endl;
  cout << "X-Frame-Options: SAMEORIGIN" << endl;
  cout << "X-Content-Type-Options: nosniff" << endl;
  cout << "X-Download-Options: noopen" << endl;
  cout << endl;
  cout << s;
}
