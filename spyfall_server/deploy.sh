#!/bin/bash

npm run build

$(aws ecr get-login --no-include-email --region us-east-1)

docker build -t 351575273764.dkr.ecr.us-east-1.amazonaws.com/spyfall/server:$1 .
docker push 351575273764.dkr.ecr.us-east-1.amazonaws.com/spyfall/server:$1