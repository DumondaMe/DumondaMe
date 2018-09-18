docker run --name dumondaMeDatabase -d --publish 7476:7474 --publish 7688:7687 --volume /var/lib/neo4j/data:/data --volume /var/lib/neo4j/plugins:/plugins --env=NEO4J_AUTH=none --env=NEO4J_dbms_allowFormatMigration=true --env=NEO4J_dbms_memory_pagecache_size=100M --env=NEO4J_dbms_memory_heap_maxSize=400 -e NEO4J_dbms_security_procedures_unrestricted=apoc.\\\* --restart on-failure:10 neo4j:3.2.10

docker run --name redisSessionStore -d --publish 6379:6379 --restart on-failure:10 redis:3.2.3

