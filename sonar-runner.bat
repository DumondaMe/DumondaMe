CALL git pull
cd elyoos/client
CALL npm update
CALL grunt coverage
cd ../server
CALL npm update
CALL npm install ../../commonLib/serverLib
CALL npm install ../../commonLib/serverTestUtil
CALL grunt coverage
CALL grunt analysis
cd ../../elyoosAdmin/client
CALL npm update
CALL grunt coverage
cd ../server
CALL npm update
CALL npm install ../../commonLib/serverLib
CALL npm install ../../commonLib/serverTestUtil
CALL grunt coverage
CALL grunt analysis
cd ../../