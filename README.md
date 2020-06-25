# hello-world

sample hello world app with grpc call

## Generate proto file in js

generate js file for web client using `.proto` files

```bash
protoc -I=. helloworld.proto  \
    --js_out=import_style=commonjs:. \
    --grpc-web_out=import_style=commonjs,mode=grpcwebtext:.
```

with `TS`

```bash
protoc -I=. helloworld.proto  \
    --js_out=import_style=commonjs,binary:. \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:.
```

## Start Envoy

Start Envoy proxy for grpc calls

```bash
docker run -d -v "$(pwd)"/envoy.yaml:/etc/envoy/envoy.yaml:ro \
    -p 8080:8080 -p 9901:9901 envoyproxy/envoy:v1.14.1
```
