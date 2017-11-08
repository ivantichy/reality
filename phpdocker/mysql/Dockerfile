FROM mysql:8.0 

COPY database.sql /
COPY importdb.sh /
COPY myentrypoint.sh /

ENTRYPOINT [ "/myentrypoint.sh" ]
CMD [ "mysqld" ]
