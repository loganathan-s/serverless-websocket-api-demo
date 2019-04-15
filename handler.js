'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const success = {
  statusCode: 200
};

function saveConnectionInfoToDyanmoDB(connectionId){
  const timeStamp = new Date().getTime();
  const params = {
    TableName: process.env.DYNAMO_DBTABLE,
    Item: {
      connectionId: connectionId,
      createdAt: timeStamp,
      updatedAt: timeStamp
    }
  }
  dynamoDb.put(params, error => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create user, Db error'));
      return;
    };
  callback(null, success);
});
}


function getClient(connectionId) {
  const params = {
    TableName: process.env.DYNAMO_DBTABLE,
    Key: {
      connectionId: connectionId
    }
  }
  
  dynamoDb.get(params, (error, client) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the user.',
      });
      return false;
    }
    return client
  });
}


module.exports.connectionHandler = async (event, context) => {
  const payload = JSON.parse(event.body);
  console.log('event.requestContext.connectionId ===> connectionHandler');
  console.log(event.requestContext.connectionId);
  console.log(event.requestContext.connectionId);
  console.log('event.requestContext.connectionId ===> connectionHandler');
  await saveConnectionInfoToDyanmoDB(event.requestContext.connectionId);
  return success;
};

module.exports.defaultHandler = async (event, context) => {
  
  console.log('event.requestContext.connectionId ===> defaultHandler');
  console.log(event.requestContext);
  console.log(event.requestContext.connectionId);
  console.log('event.requestContext.connectionId ===> defaultHandler');
 // await client = getClient(event.requestContext.connectionId);
  let endPoint;
  if(event.requestContext.apiId){
    endpoint  = `${event.requestContext.apiId}.execute-api.${process.env.API_REGION}.amazonaws.com/${event.requestContext.stage}`;
  }
  
  this.client = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint
  });
  
  await this.client.postToConnection({
    ConnectionId,
    Data: JSON.stringify({
      event: "error",
      message: "invalid action type"
    })
  })
  
  return success;
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};




module.exports.messageHandler = async (event, context) => {
  console.log('event.requestContext.connectionId ===> messageHandler');
  console.log(event.requestContext.connectionId);
  console.log(event.requestContext.connectionId);
  console.log('event.requestContext.connectionId ===> messageHandler');
  return success;
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
