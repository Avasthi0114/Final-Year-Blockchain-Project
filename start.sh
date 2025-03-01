
nvm use 18
sleep 2

 source setEnv.sh
 sleep 5

cd artifacts
sleep 2

 cd channel
 sleep 2

./create-artifacts.sh
sleep 5

 cd ..
 sleep 2

 docker-compose up -d
 sleep 5

cd ..
sleep 2

./createChannel.sh
sleep 5

./deployChaincode.sh
sleep 5
