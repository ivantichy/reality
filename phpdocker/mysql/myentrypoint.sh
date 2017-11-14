#!/bin/bash
(sleep 30 && mysql reality -u reality -pdlfjdsafsl98FS0SA9F < /database.sql) &
exec /usr/local/bin/docker-entrypoint.sh "$@"

