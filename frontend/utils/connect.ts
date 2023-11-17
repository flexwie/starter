import { headers } from "next/headers"
import { createPromiseClient, Interceptor, PromiseClient } from "@bufbuild/connect"
import { createGrpcTransport } from "@bufbuild/connect-node"
import { ServiceType } from "@bufbuild/protobuf"

const injectClientAuth: Interceptor = (next) => async (req) => {
  const headerList = headers()
  req.header.set('cookie', headerList.get('cookie')!)
  return await next(req)
}

const transport = createGrpcTransport({
  httpVersion: "2",
  baseUrl: "http://127.0.0.1:8080",
  interceptors: [injectClientAuth],
})


export function createClient<T extends ServiceType>(service: T): PromiseClient<T> {
  return createPromiseClient(service, transport)
}