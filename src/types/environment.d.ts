/* eslint-disable @typescript-eslint/no-unused-vars */

namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    REACT_APP_API_KEY: string;
  }
}
