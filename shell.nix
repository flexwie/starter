with import <nixpkgs> { };


mkShell {
  buildInputs = [
    buf
    go
    gopls
    protoc-gen-go
    protoc-gen-go-grpc
    protoc-gen-connect-go
    nodejs
    nodePackages.typescript-language-server
    protobuf
  ];
}