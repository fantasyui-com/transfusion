#!/bin/bash

cp src/server.js server/index.js;
browserify -e src/client.js -t babelify -t brfs -o client/index.js;
