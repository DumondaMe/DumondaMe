docker run --name dumondaMeDatabase -d --publish 7476:7474 --publish 7688:7687 --volume /var/lib/neo4j/data:/data --volume /var/lib/neo4j/plugins:/plugins --env=NEO4J_AUTH=none --env=NEO4J_dbms_allowFormatMigration=true --env=NEO4J_dbms_memory_pagecache_size=100M --env=NEO4J_dbms_memory_heap_maxSize=400 -e NEO4J_dbms_security_procedures_unrestricted=apoc.\\\* --restart on-failure:10 neo4j:3.4.7

docker run --name database -d --publish 7474:7474 --publish 7687:7687 --volume /var/lib/neo4j/data/develop:/data --volume /var/lib/neo4j/plugins:/plugins --volume /var/lib/neo4j/logs/develop:/logs --env=NEO4J_dbms_allowFormatMigration=true --env=NEO4J_dbms_memory_pagecache_size=100M --env=NEO4J_dbms_memory_heap_maxSize=400 -e NEO4J_dbms_security_procedures_unrestricted=apoc.\\\* -e NEO4J_apoc_autoIndex_async=true --restart on-failure:10 neo4j:3.5.3
docker run --name testDatabase -d --publish 7476:7474 --publish 7688:7687 --volume /var/lib/neo4j/data/test:/data --volume /var/lib/neo4j/plugins/test:/plugins --volume /var/lib/neo4j/logs/test:/logs --env=NEO4J_AUTH=none --env=NEO4J_dbms_allowFormatMigration=true -e NEO4J_dbms_security_procedures_unrestricted=apoc.\\\* -e NEO4J_apoc_export_file_enabled=true --restart on-failure:10 neo4j:3.5.3

docker run --name redisSessionStore -d --publish 6379:6379 --restart on-failure:10 redis:3.2.3

