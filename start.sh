#!/bin/bash

HOME=$(dirname $0)
SCRIPT=$HOME/server/server.js
NPM=npm
NODE=node
PID_FILE=filestop.pid

stop_node() {
  if [ -e "$PID_FILE" ]; then
    PID=$(cat $PID_FILE)
    ps ax | grep -v grep | grep $PID > /dev/null
    if [ $? -eq 0 ]; then
      kill $PID > /dev/null
    fi
  fi
}

start_node() {
  NODE_ENV=production $NODE $SCRIPT > /dev/null &
  echo $! > $PID_FILE
}

function restart_node {
  stop_node
  start_node
}
cd $HOME
$NPM install > /dev/null

restart_node
