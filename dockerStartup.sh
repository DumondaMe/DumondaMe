sudo docker run --name elyoosDatabase -d --net="host" --volume /var/lib/neo4j/data:/data --env=NEO4J_AUTH=none --env=NEO4J_dbms_allowFormatMigration=true --env=NEO4J_dbms_memory_pagecache_size=200M --env=NEO4J_dbms_memory_heap_maxSize=400 neo4j:3.0.2
sudo docker run --name redisSessionStore -d --net="host" redis:3.0.7

docker build -t jenkins/elyoos .
sudo docker run --name elyoosWebserver -d --net="host" jenkins/elyoos

//Remove old docker images
docker rm $(docker ps -a -q)
docker rmi $(docker images -a | grep "^<none>" | awk '{print $3}')
