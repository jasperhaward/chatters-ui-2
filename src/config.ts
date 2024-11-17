interface Config {
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
  httpApiUrl: "${CHATTERS_SERVER_HTTP_URL}",
  websocketApiUrl: "${CHATTERS_SERVER_WS_URL}",
  // below variables based on backend config
  minUsernameLength: 5,
  maxUsernameLength: 25,
  minPasswordLength: 10,
  maxPasswordLength: 250,
  maxConversationTitleLength: 20,
  maxMessageLength: 250,
};

export default config;
