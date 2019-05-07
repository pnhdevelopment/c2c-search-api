#!/bin/bash -el

if [ -z ${ENVIRONMENT} ]; then
  echo "Environment Name / Identifier is required for launching of the stack"
  echo "Please set the ENVIRONMENT environment variable"
  exit 255
fi

if [ -z ${DEPLOYMENT_ENVIRONMENT} ]; then
  echo "Deployment Environment Name / Identifier is required for launching of the stack"
  echo "Please set the DEPLOYMENT_ENVIRONMENT environment variable"
  exit 255
fi

export STACKUP_DOCKER_IMAGE="realestate/stackup:1.2.0"
export AWS_DEFAULT_REGION="ap-southeast-2"
export TIME=$(date +%M%S)

VERSION=1.0.${BUILD_NUMBER:-0}
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

TEMPLATES=(
  "searchapi.yml"
)

for TEMPLATE in "${TEMPLATES[@]}"
do
  echo "INFO: [`date +"%T"`] Finding ${TEMPLATE}..."
  echo ""
  echo "INFO: [`date +"%T"`] Validating Template ${DIR}/${TEMPLATE}"
  aws cloudformation validate-template --template-body file://${DIR}/${TEMPLATE}
done

cd ${DIR}

TEMPLATE="searchapi.yml"
TYPE="${TEMPLATE%.*}"
STACK_NAME="caretocompare-${DEPLOYMENT_ENVIRONMENT}-${TYPE}"
VPC_ID=$(aws cloudformation describe-stacks --stack-name caretocompare-${ENVIRONMENT}-vpc --output text --query 'Stacks[0].Outputs[?OutputKey==`VPCId`].OutputValue')
SUBNET_IDS=$(aws cloudformation describe-stacks --stack-name caretocompare-${ENVIRONMENT}-subnet --output text --query 'Stacks[0].Outputs[?OutputKey==`PublicSubnetIds`].OutputValue')
ECS_CLUSTER=$(aws cloudformation describe-stacks --stack-name caretocompare-shared-${ENVIRONMENT}-svc --output text --query 'Stacks[0].Outputs[?OutputKey==`EcsCluster`].OutputValue')
ECS_SG=$(aws cloudformation describe-stacks --stack-name caretocompare-shared-${ENVIRONMENT}-svc --output text --query 'Stacks[0].Outputs[?OutputKey==`EcsSecurityGroup`].OutputValue')
ALB_LISTENER=$(aws cloudformation describe-stacks --stack-name caretocompare-shared-${ENVIRONMENT}-svc --output text --query 'Stacks[0].Outputs[?OutputKey==`Listener`].OutputValue')

echo ""
echo "INFO: [`date +"%T"`] Deploying to ${STACK_NAME} for environment ${ENVIRONMENT}"
docker run --rm \
    -v `pwd`:/cwd \
    -e AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY \
    -e AWS_SESSION_TOKEN \
    -e AWS_DEFAULT_REGION \
    ${STACKUP_DOCKER_IMAGE} "${STACK_NAME}" down
    
docker run --rm \
    -v `pwd`:/cwd \
    -e AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY \
    -e AWS_SESSION_TOKEN \
    -e AWS_DEFAULT_REGION \
    ${STACKUP_DOCKER_IMAGE} "${STACK_NAME}" up -t ${TEMPLATE} \
    -o VpcId=${VPC_ID} \
    -o SubnetId="${SUBNET_IDS}" \
    -o ECSCluster="${ECS_CLUSTER}" \
    -o ECSSecurityGroup="${ECS_SG}" \
    -o ALBListener="${ALB_LISTENER}" \
    -o ListenerPriority="${TIME##+(0)}" \
    -o ApiVersion=${VERSION} \
    -o EnvironmentName="${DEPLOYMENT_ENVIRONMENT}" \
    -o ApplicationPath="/${DEPLOYMENT_ENVIRONMENT}"
