import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, './protos/example.proto');

// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const exampleService = proto.TestService;

function sayHello(
  call: grpc.ServerUnaryCall<{ name: string }, { message: string }>,
  callback: grpc.sendUnaryData<{ message: string }>
) {
  const { name } = call.request;
  callback(null, { message: `Hello, ${name}!` });
}

// Create the gRPC server
const server = new grpc.Server();
server.addService(exampleService.service, { SayHello: sayHello });

server.bindAsync(
  '0.0.0.0:50052',
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Server running at http://0.0.0.0:${port}`);
  }
);
