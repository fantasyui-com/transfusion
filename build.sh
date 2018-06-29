#!/bin/bash

cp src/server.js server/index.js;
cp src/client.js client/index.js;

# browserify -e src/client.js -t babelify -t brfs -o client/index.js;
