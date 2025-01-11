const protoLoader = require('@grpc/proto-loader');
const { GRPC_Global } = require('../config/grpc.config');

const CHAT_PROTO_PATH  = __dirname + '/../proto/livechat.proto';
const chatPackageDefinitions = protoLoader.loadSync(CHAT_PROTO_PATH);
const chatProto = GRPC_Global.loadPackageDefinition(chatPackageDefinitions).chat_bidireactional

module.exports = {
    chatProto
}
