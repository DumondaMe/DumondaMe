sudo docker run --name elyoosDatabase -d --publish 7476:7474 --volume /var/lib/neo4j/data:/data --env=NEO4J_AUTH=none --env=NEO4J_dbms_allowFormatMigration=true --env=NEO4J_dbms_memory_pagecache_size=100M --env=NEO4J_dbms_memory_heap_maxSize=400 --restart on-failure:10 neo4j:3.1.0
sudo docker run --name redisSessionStore -d --publish 6379:6379 --restart on-failure:10 redis:3.2.3

docker build -t jenkins/elyoos .
sudo docker run --name elyoosWebserver -d --restart on-failure:10 --net="host" jenkins/elyoos

//Remove old docker images
docker rm $(docker ps -a -q)
docker rmi $(docker images -q | grep "^<none>")
