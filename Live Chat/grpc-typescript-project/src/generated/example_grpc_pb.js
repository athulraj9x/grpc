// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var example_pb = require('./example_pb.js');

function serialize_Test_examples_HelloRequest(arg) {
  if (!(arg instanceof example_pb.HelloRequest)) {
    throw new Error('Expected argument of type Test_examples.HelloRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Test_examples_HelloRequest(buffer_arg) {
  return example_pb.HelloRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Test_examples_HelloResponse(arg) {
  if (!(arg instanceof example_pb.HelloResponse)) {
    throw new Error('Expected argument of type Test_examples.HelloResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Test_examples_HelloResponse(buffer_arg) {
  return example_pb.HelloResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var TestServiceService = exports.TestServiceService = {
  sayHello: {
    path: '/Test_examples.TestService/SayHello',
    requestStream: false,
    responseStream: false,
    requestType: example_pb.HelloRequest,
    responseType: example_pb.HelloResponse,
    requestSerialize: serialize_Test_examples_HelloRequest,
    requestDeserialize: deserialize_Test_examples_HelloRequest,
    responseSerialize: serialize_Test_examples_HelloResponse,
    responseDeserialize: deserialize_Test_examples_HelloResponse,
  },
};

exports.TestServiceClient = grpc.makeGenericClientConstructor(TestServiceService);
