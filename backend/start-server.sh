#!/bin/sh

if [ "$1" = "debug" ]; then
    OPTIONS="-agentlib:jdwp=transport=dt_socket,server=y,address=8000,suspend=n -Dlogging.level.org.springframework.web=DEBUG"
fi

mvn clean package
java ${OPTIONS} -jar target/realau-server-0.0.1-SNAPSHOT.war
