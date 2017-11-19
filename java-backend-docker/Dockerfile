FROM ivantichy/oracle-java8

RUN apt-get update && apt-get install &&\
apt-get install maven -y -q && \
rm -rf /var/lib/apt/lists/*

#TODO add user java and run under java user

RUN mkdir /home/java

COPY . /home/java/

WORKDIR /home/java/

ENTRYPOINT [ "/home/java/start-server.sh" ]
