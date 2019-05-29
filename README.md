## Apollo 🧙 Enhanced InMemoryCache

  Apollo InMemoryCache 🧙wrapper for storing selected only queries and for updating linked/nested without IDs



### Install
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
import { updateQueryHandler } from 'apollo-enhanced-cache-inmemory';
import {
    SomeQueryName,
    SomeQueryName2,
    SomeQueryName3,
    SomeQueryResponseField,
    QUERY_CREATED_BY_GQL_FUNCTION,
} from './.../queries';

// type Retriever = <T1, T2>(fromQuery: QueryObject<T1>, updateQuery: QueryObject<T2>) => QueryObject<T1, T2>,
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
    retriever: (fromQuery, updateQuery) =>
      updateQueryHandler(fromQuery, ['response', 'result'], updateQuery, [
        SomeQueryResponseField,
        'result',
      ]),
  },
  {
    name: SomeQueryName3,
    queryNode: QUERY_CREATED_BY_GQL_FUNCTION,
    updateName: SomeQueryName,
    // type Retriever
    retriever: (fromQuery, updateQuery) =>
      updateQueryHandler(
        fromQuery,
        [ConsumerCoBuyerQueryResponse, 'result'],
        updateQuery,
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

#### Then ordinary usage:

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
