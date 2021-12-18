cd db

if exist directorydb.db3 del directorydb.db3
sqlite3 directorydb.db3 < create_directorydb.sql

cd ..