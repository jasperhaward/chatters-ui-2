import { parseEnv } from "./utils";

export interface Config {
  httpApiUrl: string;
  websocketApiUrl: string;
  minUsernameLength: number;
  maxUsernameLength: number;
  minPasswordLength: number;
  maxPasswordLength: number;
  maxConversationTitleLength: number;
  maxMessageLength: number;
}

const config: Readonly<Config> = {
  httpApiUrl: parseEnv("VITE_API_HTTP_URL"),
  websocketApiUrl: parseEnv("VITE_API_WS_URL"),
  // below variables based on backend config
  minUsernameLength: 5,
  maxUsernameLength: 25,
  minPasswordLength: 10,
  maxPasswordLength: 250,
  maxConversationTitleLength: 20,
  maxMessageLength: 250,
};

export default config;
