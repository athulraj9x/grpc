const protoLoader = require('@grpc/proto-loader');
const { GRPC_Global } = require('../config/grpc.config');

const CHAT_PROTO_PATH  = __dirname + '/../proto/livechat.proto';
const CHAT_QUEUE  = __dirname + '/../proto/clientRabbitQueue.proto';
const TEST_LIVE  = __dirname + '/../proto/example.proto';

const chatPackageDefinitions = protoLoader.loadSync(CHAT_PROTO_PATH);
const queuePackageDefinitions = protoLoader.loadSync(CHAT_QUEUE);
const textExamplePackageDefinitions = protoLoader.loadSync(TEST_LIVE);
const chatProto = GRPC_Global.loadPackageDefinition(chatPackageDefinitions).chat_bidireactional
const QueueProto = GRPC_Global.loadPackageDefinition(queuePackageDefinitions).order
const TestProto = GRPC_Global.loadPackageDefinition(textExamplePackageDefinitions).Test_examples

module.exports = {
    chatProto,
    QueueProto,
    TestProto,
}
