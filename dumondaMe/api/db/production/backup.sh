#!/bin/sh
PATH=/root/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games

neo4j-backup -host 127.0.0.1 -to /mnt/backup/neo4j-backup
cd /mnt/backup/
time=$(date +"%Y_%m_%d__%H_%M_%S")
tar -zcf $time.tar.gz neo4j-backup/
aws s3 cp $time.tar.gz s3://elyoosbackup/neo4j/
rm -r neo4j-backup
rm $time.tar.gz
