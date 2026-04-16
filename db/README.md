# Database Bootstrap

- `clawguard.sql` is the existing MySQL dump used to initialize the `mysql` container.
- Docker mounts this file into `/docker-entrypoint-initdb.d/01-clawguard.sql`.
- The dump is imported automatically only when the `mysql_data` volume is empty.
- If you need to re-import the dump from scratch, remove the `mysql_data` volume first and start the stack again.
