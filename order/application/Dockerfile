FROM node:20 AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Use a common base image to reduce the cold start time
FROM amazon/aws-lambda-nodejs:20

# Install Lambda Web Adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.1 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=3000 AWS_LWA_INVOKE_MODE=response_stream

COPY --from=builder /build/next.config.mjs ./
COPY --from=builder /build/public ./public
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/.next/standalone ./

# Changes due to the base image
ENTRYPOINT ["node"]
CMD ["server.js"]
