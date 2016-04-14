sudo docker run --name elyoosDatabase -d --publish 7474:7474 --net="host" --volume $HOME/neo4j/data:/data --env=NEO4J_AUTH=none  neo4j/neo4j:2.3.2
sudo docker run --name redisSessionStore -i redis:3.0.7

sudo docker run --name elyoosWebserver -p 8080:8080 -i --net="host" jenkins/elyoos
