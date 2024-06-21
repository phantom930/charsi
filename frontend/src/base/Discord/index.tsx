import DiscordOAuth2 from "discord-oauth2";

import { discord_clientId, discord_clientSecret, REACT_URL } from "@/config";

const oauth = new DiscordOAuth2({
  clientId: discord_clientId,
  clientSecret: discord_clientSecret,
  redirectUri: `${REACT_URL}/auth`, // Replace with your actual redirect URI
});

export default oauth;
