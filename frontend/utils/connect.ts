import { createPromiseClient, Interceptor, PromiseClient } from "@bufbuild/connect"
import { createGrpcTransport } from "@bufbuild/connect-node"
import { ServiceType } from "@bufbuild/protobuf"

const clientAuthInjectorFactory: (req: Request) => Interceptor = (request: Request) => {
  const headerList = request.headers;

  return (next) => async (req) => {
    req.header.set('cookie', headerList.get('cookie')!)
    return await next(req)
  }
}

const transportFactory = (request: Request) => createGrpcTransport({
  httpVersion: "2",
  baseUrl: "http://127.0.0.1:8080",
  interceptors: [clientAuthInjectorFactory(request)],
})


export function createClient<T extends ServiceType>(service: T, request: Request): PromiseClient<T> {
  return createPromiseClient(service, transportFactory(request))
}