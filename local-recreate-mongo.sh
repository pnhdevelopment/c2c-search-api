#!/bin/bash -el
CONTAINER_NAME=policy-search
MONGO_PORT=27017

docker stop ${CONTAINER_NAME} || true && docker rm ${CONTAINER_NAME} || true

docker pull mongo

docker run \
    --publish=${MONGO_PORT}:${MONGO_PORT} \
    --volume $(pwd)/data/db:/data/db \
    --volume=$(pwd)/mongo/data/seed-data:/input-data \
    --name ${CONTAINER_NAME} \
    -d \
    mongo

# Bit of a hack, actually mongo may not be up yet! But ok for now for local dev setup...
sleep 20

docker exec -it ${CONTAINER_NAME} bash -c "mongoimport --db policy-search-db --collection policies --drop --type json --file /input-data/policies-2018.json --jsonArray"
docker exec -it ${CONTAINER_NAME} bash -c "mongo policy-search-db /input-data/update-schema.js"