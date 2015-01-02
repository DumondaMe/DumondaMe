cd client
node_modules/karma/bin/karma start test/config/karma.coverage.conf.js &
TASK_PID=$!
sleep 10s
node_modules/karma/bin/karma run test/config/karma.coverage.conf.js
sonar-runner
kill $TASK_PID
cd ../server
npm run coverage
sonar-runner

