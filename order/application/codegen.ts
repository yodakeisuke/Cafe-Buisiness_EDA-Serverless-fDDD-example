import { CodegenConfig } from '@graphql-codegen/cli'

const APPSYNC_URL = process.env.APPSYNC_URL || ""
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY || ""

const config: CodegenConfig = {
  schema: [
    {
      [APPSYNC_URL]: {
        headers: { "X-API-KEY": APPSYNC_API_KEY },
      },
    },
  ],
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client'
    }
  }
}

export default config
