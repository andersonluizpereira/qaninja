kill -9 $(lsof -t -i:3000) > /dev/null 2>&1
docker stop mongo
docker stop rabbitmq
sleep 10
docker start mongo
docker start rabbitmq
sleep 10
mongo --host 127.0.0.1:27017 trekodb --eval "db.tasks.drop()"
