#!/bin/bash

ZIPFILE=AlexaLambda.zip
REGION=eu-west-1
HANDLER=index.handler
RUNTIME=nodejs6.10

CURRENT_ALIAS=blue
#CURRENT_ALIAS=green

FUNCTION_NAME=alexa-maxi80
#FUNCTION_NAME=alexa-audio-player

#EXEC_ROLE=arn:aws:iam::486652066693:role/lambda_basic_execution
EXEC_ROLE=arn:aws:iam::743602823695:role/lambda_maxi80_alexa

#ACCOUNT_ID=486652066693 # seb @ amazon
ACCOUNT_ID=743602823695 # maxi80

PROFILE=maxi80
#PROFILE=default



pushd src
# if the ZIP file does exist, just refresh it
if [ -e ../$ZIPFILE ];
then
   REFRESH=-f
fi
zip -j $REFRESH ../$ZIPFILE  *.js 
zip $REFRESH ../$ZIPFILE -r node_modules/*
zip $REFRESH ../$ZIPFILE -r utils/*
popd

aws lambda update-function-code                     \
         --profile $PROFILE                         \
         --region $REGION                           \
         --function-name $FUNCTION_NAME             \
         --zip-file fileb://./$ZIPFILE

# CURRENT_VERSION=$(aws lambda publish-version              \
#                        --profile $PROFILE                 \
#                        --function-name $FUNCTION_NAME     \
#                        --query Version --output text)

#  aws lambda update-alias                            \
#          --profile $PROFILE                         \
#          --region $REGION                           \
#          --function-name $FUNCTION_NAME             \
#          --function-version $CURRENT_VERSION        \
#          --name $CURRENT_ALIAS

# to programmatically create Lambda function :

# aws lambda delete-function                        \
#          --profile $PROFILE                       \
#          --region $REGION                         \
#          --function-name $FUNCTION_NAME

# aws lambda create-function                        \
#          --profile $PROFILE                       \
#          --region $REGION                         \
#          --function-name $FUNCTION_NAME           \
#          --runtime $RUNTIME                       \
#          --role $EXEC_ROLE                        \
#          --handler $HANDLER                       \
#          --zip-file fileb://$ZIPFILE              \
#          --memory-size 512                        \
#          --timeout 30                             \
#          --query FunctionArn --output text

# aws lambda add-permission                         \
#             --profile $PROFILE                    \
#             --region $REGION                      \
#             --function-name $FUNCTION_NAME        \
#             --statement-id 1                      \
#             --principal alexa-appkit.amazon.com   \
#             --action lambda:InvokeFunction        \
