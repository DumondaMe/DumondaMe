sudo docker run --name elyoosDatabase -d --net="host" --volume /var/lib/neo4j/data:/data --env=NEO4J_AUTH=none --env=NEO4J_ALLOW_STORE_UPGRADE=true neo4j/neo4j:2.3.2
sudo docker run --name redisSessionStore -d --net="host" redis:3.0.7

sudo docker run --name elyoosWebserver -d --net="host" jenkins/elyoos
