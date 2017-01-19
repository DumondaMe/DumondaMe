#!/usr/bin/env bash

docker run --name ecs-agent --privileged --detach=true --restart=on-failure:10 --volume=/var/run/docker.sock:/var/run/docker.sock --volume=/var/log/ecs/:/log:z --volume=/var/lib/ecs/data:/data:z --net=host --env=ECS_LOGFILE=/log/ecs-agent.log --env=ECS_LOGLEVEL=info --env=ECS_DATADIR=/data --env=ECS_CLUSTER=webserver --env=ECS_ENABLE_TASK_IAM_ROLE=true --env=ECS_ENABLE_TASK_IAM_ROLE_NETWORK_HOST=true amazon/amazon-ecs-agent:latest

#Getting the admin tool from the repo
docker pull 746250133111.dkr.ecr.eu-central-1.amazonaws.com/elyoos_admin_webserver:latest
docker run --name admin-tool --publish 8082:8082 746250133111.dkr.ecr.eu-central-1.amazonaws.com/elyoos_admin_webserver:latest

#Getting the webserver test from the repo
docker pull 746250133111.dkr.ecr.eu-central-1.amazonaws.com/elyoos_webserver_test:latest
docker run --name webserver --net="host" --publish 8080:8080 746250133111.dkr.ecr.eu-central-1.amazonaws.com/elyoos_webserver_test:latest