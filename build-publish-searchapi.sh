#!/bin/bash -el

VERSION=1.0.${BUILD_NUMBER:-0}
docker build -t search-api .

docker tag search-api:latest 702557701840.dkr.ecr.ap-southeast-2.amazonaws.com/search-api:${VERSION}
$(aws ecr get-login --no-include-email --region ap-southeast-2)
docker push 702557701840.dkr.ecr.ap-southeast-2.amazonaws.com/search-api:${VERSION}
