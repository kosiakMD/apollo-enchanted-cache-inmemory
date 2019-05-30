## 🚀‍‍ Apollo 🧙 Enhanced InMemoryCache

 🚀 Apollo 🛠‍ Tool represented as InMemoryCache 🧙 wrapper for 🗄 storing / 🗃 restoring ✅ selected only 🗂️ queries and for updating ⛓ linked / nested without 🆔 IDs

##### !Disclaimer: can consist 🐛 bugs ;)

## Install

`$ npm install apollo-enhanced-cache-inmemory -S`

or

`$ yarn add apollo-enhanced-cache-inmemory`

## Usage

#### Creating Enhanced InMemoryCache Config:

```$xslt
...
export const SomeQueryName = 'SomeQueryName';
export const SomeQueryResponseField = 'response';
export const QUERY_CREATED_BY_GQL_FUNCTION = gql`
  query ${SomeQueryName} {
    ${SomeQueryResponseField}: UserProfileQuery {
      result {
        ...UserProfileFragment
      }
    }
  }
  ${UserProfileFragment}
`;
```

```$xslt
import { targetQueryHandler } from 'apollo-enhanced-cache-inmemory';
import {
    SomeQueryName,
    SomeQueryName2,
    SomeQueryName3,
    SomeQueryResponseField,
    QUERY_CREATED_BY_GQL_FUNCTION,
} from './.../queries';

// type Retriever = <T1, T2>(sourceQuery: QueryObject<T1>, targetQuery: QueryObject<T2>) => QueryObject<T1, T2>,
const subscribedQueries = [
  {
    name: SomeQueryName,
    queryNode: QUERY_CREATED_BY_GQL_FUNCTION,
    storeName: SomeQueryName,
    nest: [SomeQueryResponseField], // optional
    retrieveField: SomeQueryResponseField, // optional XOR - retriever
    // or 
    // type Retriever
    retriever: () => ({...}) // optional XOR - retrieveField
  },
  {
    name: SomeQueryName2,
    queryNode: QUERY_CREATED_BY_GQL_FUNCTION,
    updateName: SomeQueryName,
    // type Retriever
    retriever: (sourceQuery, targetQuery) =>
      targetQueryHandler(sourceQuery, ['response', 'result'], targetQuery, [
        SomeQueryResponseField,
        'result',
      ]),
  },
  {
    name: SomeQueryName3,
    queryNode: QUERY_CREATED_BY_GQL_FUNCTION,
    updateName: SomeQueryName,
    // type Retriever
    retriever: (sourceQuery, targetQuery) =>
      targetQueryHandler(
        sourceQuery,
        [ConsumerCoBuyerQueryResponse, 'result'],
        targetQuery,
        [SomeQueryResponseField, 'result', 'cobuyer'],
        false, // withMerge = false
      ),
  },
];
```

#### Initiation:

```
...
const inMemoryCache = new InMemoryCache({
    ...
});
...
const cache = createEnhancedInMemoryCache(
    inMemoryCache,
    subscribedQueries,
    logCacheWrite,
);
...
```

#### Restoring data from storage into cache:

```$xslt
...
await cache.restoreAllQueries();
...
```

#### Basic usage:

```$xslt
...
const stateLink = withClientState({
    cache,
    resolvers,
    defaults,
  });
...
const apolloClient = new ApolloClient({
    cache,
    link: ApolloLink.from([stateLink]),
});
...
```
