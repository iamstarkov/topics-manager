// https://gist.github.com/kitten/f34b50b2782476e6aabb0ebd359d5862
// https://github.com/FormidableLabs/urql/issues/293

import { pipe, share, filter, merge, map, tap } from "wonka";

const shouldSkip = ({ operationName }) =>
  operationName !== "subscription" && operationName !== "query";

export const suspenseExchange = ({ client, forward }) => {
  if (!client.suspense) {
    return ops$ => forward(ops$);
  }
  const data = {};
  const isCached = operation => {
    return !shouldSkip(operation) && data[operation.key] !== undefined;
  };
  return ops$ => {
    const sharedOps$ = share(ops$);
    const forwardedOps$ = pipe(
      sharedOps$,
      filter(op => !isCached(op)),
      forward,
      // Cache OperationResults as we receive responses
      tap(result => {
        const { operation } = result;
        if (!shouldSkip(operation)) {
          data[operation.key] = result;
        }
      })
    );
    const cachedOps$ = pipe(
      sharedOps$,
      filter(op => isCached(op)),
      map(op => {
        const serialized = data[op.key];
        return deserializeResult(op, serialized);
      }),
      // This doesn't replace the cacheExchange, so only resolve a result once
      // from the suspense cache
      tap(result => {
        delete data[result.operation.key];
      })
    );
    return merge([forwardedOps$, cachedOps$]);
  };
};
