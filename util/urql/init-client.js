import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange
} from "urql";
import { suspenseExchange } from "@urql/exchange-suspense";
import "isomorphic-unfetch";

let urqlClient = null;
let ssrCache = null;

export default function initUrqlClient(initialState, token) {
  // Create a new client for every server-side rendered request to reset its state
  // for each rendered page
  // Reuse the client on the client-side however
  const isServer = typeof window === "undefined";
  if (isServer || !urqlClient) {
    ssrCache = ssrExchange({ initialState });

    const headers = !token ? {} : { Authorization: `Bearer ${token}` };

    urqlClient = createClient({
      url: "https://api.github.com/graphql",
      // Active suspense mode on the server-side
      suspense: true,
      exchanges: [
        dedupExchange,
        cacheExchange,
        ssrCache,
        suspenseExchange,
        fetchExchange
      ],
      fetchOptions: { headers }
    });
  }

  // Return both the cache and the client
  return [urqlClient, ssrCache];
}
