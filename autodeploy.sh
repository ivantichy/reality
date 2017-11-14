#!/bin/bash


while [ 0 ];
do
  echo "testing"
  cd /root/reality
  git fetch origin
  git diff --name-only origin/master

  if [ "`git diff --name-only origin/master | wc -l`" -gt "0" ]; then
    echo "doing update"
    docker-compose down
    git pull origin master -q
    docker-compose build
    docker-compose up &
  fi

sleep 20
done

