import { setContext } from "@apollo/client/link/context";
import slugify from "slugify";
import { format } from "date-fns";

import client from "@/graphql";
import { API_URL } from "@/config";

export * from "./Hooks/useWindowDimensions";

interface DiscordAvatarProps {
  userId: string;
  avatarHash: string;
}

export const fullDiscordAvatarUrl = ({
  userId,
  avatarHash,
}: DiscordAvatarProps) =>
  `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png`;

export const urlToFile = (url: string, filename: string, mimeType: string) => {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => new File([buffer], filename, { type: mimeType }));
};

export const imageUrlToDataURL = (url: string) => {
  return new Promise<string | ArrayBuffer | null>((resolver, reject) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();

        reader.onerror = () => {
          reader.abort();
          reject(new DOMException("Problem reading input file."));
        };

        reader.onloadend = () => {
          if (!reader.result) {
            reject(new DOMException("Problem reading input file."));
            return;
          }

          resolver(reader.result);
        };

        reader.readAsDataURL(blob);
      });
  });
};

export const getImageDataUrl = (file: File) => {
  return new Promise<string | ArrayBuffer | null>((resolver, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem reading input file."));
    };

    reader.onloadend = () => {
      if (!reader.result) {
        reject(new DOMException("Problem reading input file."));
        return;
      }

      resolver(reader.result);
    };

    reader.readAsDataURL(file);
  });
};

export const serverAssetUrl = (uri: string) =>
  `${API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL}/${
    uri.startsWith("/") ? uri.slice(1) : uri
  }`;

export const lisitingUrl = (listingRewardID: string) =>
  `/listing/${listingRewardID}`;

export const authenticateApolloClient = (jwtToken: string) => {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: jwtToken ? `Bearer ${jwtToken}` : "",
      },
    };
  });

  client.setLink(authLink.concat(client.link));
};

export const uriIdGenerator = (uri: string) =>
  slugify(uri, { lower: true, remove: /[*+~.()'"!:@]/g });

export const toCharsiDateTime = (date: Date) =>
  format(new Date(date), "MMM. dd, yyyy @ h:mm a");

export const toCharsiDate = (date: Date) =>
  format(new Date(date), "MMM. dd, yyyy");
