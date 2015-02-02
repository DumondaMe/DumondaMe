cd client
CALL grunt coverage
cd ../server/server
CALL grunt coverage
CALL grunt analysis
cd ../cdn
CALL grunt coverage
cd ../..

