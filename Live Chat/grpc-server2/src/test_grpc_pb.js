// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var test_pb = require('./test_pb.js');

function serialize_order_OrderRequest(arg) {
  if (!(arg instanceof test_pb.OrderRequest)) {
    throw new Error('Expected argument of type order.OrderRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_order_OrderRequest(buffer_arg) {
  return test_pb.OrderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_order_OrderResponse(arg) {
  if (!(arg instanceof test_pb.OrderResponse)) {
    throw new Error('Expected argument of type order.OrderResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_order_OrderResponse(buffer_arg) {
  return test_pb.OrderResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// Service definition
var OrderServiceService = exports.OrderServiceService = {
  processOrder: {
    path: '/order.OrderService/ProcessOrder',
    requestStream: false,
    responseStream: false,
    requestType: test_pb.OrderRequest,
    responseType: test_pb.OrderResponse,
    requestSerialize: serialize_order_OrderRequest,
    requestDeserialize: deserialize_order_OrderRequest,
    responseSerialize: serialize_order_OrderResponse,
    responseDeserialize: deserialize_order_OrderResponse,
  },
};

exports.OrderServiceClient = grpc.makeGenericClientConstructor(OrderServiceService);
