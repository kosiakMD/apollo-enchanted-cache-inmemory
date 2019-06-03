# 🚀‍‍ Apollo 🧙 Enchanted InMemoryCache [![NPM](https://img.shields.io/npm/v/apollo-enchanted-cache-inmemory.svg)](https://www.npmjs.com/package/apollo-enchanted-cache-inmemory)

🚀 Apollo 🛠‍ Tool represented as InMemoryCache 🧙 wrapper for 🗄 storing / 🗃 restoring ✅ selected only 🗂️ queries and for updating ⛓ linked / nested without 🆔 IDs

## Content
 - [Install](#install)
 - [Usage](#usage)
   - [Creating Enchanted InMemoryCache Config](#creating-enchanted-inmemorycache-config)
   - [Basic usage](#basic-usage)
 - [API](#api)
   - [SubscribedQuery](#subscribedquery)
   - [updateQueryHelper: Updater](#updatequeryhelper-updater)
 - [Types](#types)
 - [License](#license)

## Install

`$ npm install apollo-enchanted-cache-inmemory -S`

or

`$ yarn add apollo-enchanted-cache-inmemory`

## Usage

### Creating Enchanted InMemoryCache Config

##### queries

```javascript
// * - example for fields as variables used in a query
export const SomeQueryName = 'SomeQueryName';
export const SomeQueryResponseField = 'response';
export const SomeQueryResultField = 'result';
export const QUERY_CREATED_BY_GQL_FUNCTION = gql`
  query ${SomeQueryName} {
    ${SomeQueryResponseField}: ExampleQuery {
      ${SomeQueryResultField} {
        someDataField {
          ...ExampleFragment
        }
        ...ExampleFragment2
      }
    }
  }
  ${ExampleFragment}
  ${ExampleFragment2}
`;
// * - example for fields as variables used in a query
const SomeQueryName2 = 'SomeQueryName2';
const SomeQueryResponseField2 = 'SomeQueryResponseField2';
const SomeQueryResultField2 = 'SomeQueryResultField2';
const SomeQueryDataField2 = 'SomeQueryDataField2';
export const QUERY_CREATED_BY_GQL_FUNCTION_2 = gql`
  query ${SomeQueryName2} {
    ${SomeQueryResponseField2}: SomeDataQuery {
      ${SomeQueryResultField2} {
        ${SomeQueryDataField2} {
          someDataField {
            ...ExampleFragment
          }
          ...ExampleFragment2
        }
      }
    }
  }
  ${ExampleFragment}
  ${ExampleFragment2}
`;
// ** - example for no variables as fields used in a query
export const QUERY_CREATED_BY_GQL_FUNCTION_3 = gql`
  query SomeQueryName3 {
    response: SomeDataQuery {
      result {
        ...ExampleFragment2
      }
    }
  }
  ${ExampleFragment2}
`;
```

##### import queries and field names if exist

```javascript
import { updateQueryHelper } from 'apollo-enchanted-cache-inmemory';
import {
    SomeQueryName,
    SomeQueryResponseField,
    SomeQueryResultField,
    SomeQueryName2,
    SomeQueryResultField2,
    SomeQueryResponseField2,
    SomeQueryDataField2,
    SomeQueryName3,
    QUERY_CREATED_BY_GQL_FUNCTION,
} from './queries';

/** @type SubscribedQueries */
const subscribedQueries = [
  // #1
  // each write into Apollo Cache with updating SomeQueryName
  // will cause storing SomeQueryName asynchronously
  {
    name: SomeQueryName,
    queryNode: QUERY_CREATED_BY_GQL_FUNCTION,
    storeName: SomeQueryName,
    nest: [SomeQueryResponseField], // optional
    // optional XOR - retriever
    retrieveField: SomeQueryResponseField,
    // or
    // optional XOR - retrieveField
    retriever: () => ({...}) // type Retriever
  },
  // #2
  // SomeQueryName2 will update SomeQueryName at SomeQueryResultField
  // with deep merging all nested objects as updateType='deepMerge';
  // data taken from
  // SomeQueryName2.SomeQueryName2.SomeQueryResponseField2.SomeQueryResultField2
  // is identical with SomeQueryName.SomeQueryResponseField.SomeQueryResultField
  // * - example for fields as variables used in a query
  {
    name: SomeQueryName2,
    queryNode: QUERY_CREATED_BY_GQL_FUNCTION,
    updateName: SomeQueryName,
    updater: (sourceQuery, targetQuery) => // type Retriever
      updateQueryHelper({
        sourceQuery,
        sourcePath: [SomeQueryResponseField2, SomeQueryResultField2, SomeQueryDataField2],
        targetQuery,
        targetPath: [SomeQueryResponseField, SomeQueryResultField],
        updateType: 'deepMerge',
      }),
  },
  // #3
  // SomeQueryName3 will update SomeQueryName at someDataField by replace
  // as updateType='replace' by default;
  // data taken from SomeQueryName3.response.result
  // is identical with SomeQueryName.SomeQueryResponseField.SomeQueryResultField
  // after updating SomeQueryName will be stored as tracked by #1 set
  // ** - example for no variables as fields used in a query
  {
    name: 'SomeQueryName3',
    queryNode: QUERY_CREATED_BY_GQL_FUNCTION,
    updateName: SomeQueryName2,
    updater: (sourceQuery, targetQuery) => // type Retriever
      updateQueryHelper({
        sourceQuery,
        sourcePath: ['response', 'result'],
        targetQuery,
        targetPath: ['SomeQueryResponseField', 'result', 'someDataField'],
        // updateType = 'replace' - by default
      }),
  },
];
// ...
export default subscribedQueries;
```

### Basic usage:

#### Initiation:

```javascript
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
// ...
const inMemoryCache = new InMemoryCache({
  // ...
});
// ...
const cache = createEnchantedInMemoryCache(
  inMemoryCache,
  subscribedQueries,
  logCacheWrite,
);
// ...
const stateLink = withClientState({
  cache,
  resolvers,
  defaults,
});
// ...
const apolloClient = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink]),
});
// ...
export default apolloClient;
```

#### Restoring data from storage into cache:

```javascript
// ...
(async () => {
  // ...
  await cache.restoreAllQueries();
  // ...
})();
```

## API

#### SubscribedQuery

Array\<SubscribedQuery>

| Prop                | Type         | Default             | Note                                                                                                                                         |
| ------------------- | ------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`              | `string`     | _(required)_        | query name which changes in Apollo cache will be tracked                                                                                     |
| `queryNode`         | `Query`      | _(required)_        | Graphql Query created by Apollo's `gql` utility; <br/> type `DocumentNode` from Apollo Client                                                |
| `storeName`         | `string`     | _(semi-required)_\* | name used to store and restore in a storage <br/> _formatted into `'Query:${storeName}'`_ <br/> _\* either `storeName` or `updateName` _     |
| `updateName`        | `string`     | _(semi-required)_\* | query name which will be updated <br/> _\* either `updateName` or `storeName` _                                                              |
| `nest`              | `ObjectPath` |                     | path to Query field for _nesting_ restored data                                                                                              |
| `retrieveField`\*\* | `string`     | _(semi-required)_\* | path to Query field for <br/> _\* in case if `storeName` provided _ <br/> _\*\* - either `retriever` or `retrieveField`_                     |
| `retriever`\*\*     | `Retriever`  | _(semi-required)_\* | function returns data for storing/restoring <br/> _\* in case if `storeName` provided _ <br/> _\*\* - either `retriever` or `retrieveField`_ |
| `updater`           | `Updater`    | _(semi-required)_\* | function returns result with updated data for updating <br/> \_\* - in case if `updateName` provide                                          |

#### updateQueryHelper: Updater

| Prop          | Type              | Default      | Note                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------- | ----------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sourceQuery` | `QueryObject`     | _(required)_ | Object Data of source Query tracked for updating target Query                                                                                                                                                                                                                                                                                                                                                           |
| `sourcePath`  | `ObjectPath`      | `[]`         | path to Data source Query object field                                                                                                                                                                                                                                                                                                                                                                                  |
| `targetQuery` | `QueryObject`     |              | Object Data of target Query should be updated                                                                                                                                                                                                                                                                                                                                                                           |
| `targetPath`  | `ObjectPath`      | `[]`         | path to Data target Query object field                                                                                                                                                                                                                                                                                                                                                                                  |
| `updateType`  | `UpdateTypesEnum` | `replace`    | `replace` - just replacing target Data at object some field by source Data <br/> `rootMerge` - merge target Data Object at object field by source Data with replacing tested Data <br/> `deepMerge` - merge target Object Data at all fields (`sourcePath` of `sourceQuery`) by source Object Data with same fields (`targetPath` of `targetQuery`); begins at source Object field and goes recursively into the depths |

## Types

```typescript
type ArrayPath = Array<string | number>; // ['a', 'b', 0, 'c', 1]

type ObjectPath = ArrayPath | string; // ['a', 'b', 'c', 0] | 'a.b.c.0'

type QueryObject<Data> = { Object, Data }; // Query result data

type Updater = <T1, T2, T3>(
  sourceQuery: QueryObject<T1>,
  targetQuery: QueryObject<T2>,
) => QueryObject<T3>;

type Retriever = <T1, T2, T3>(
  sourceQuery: QueryObject<T1>,
  targetQuery: QueryObject<T2>,
) => QueryObject<T3>;

type LinkedQuery = {
  name: string;
  queryNode: DocumentNode; // Apollo Query definition, returned by gql`...`
  updateName: string;
  updater?: Updater;
}

type StoredQuery = {
  name: string;
  queryNode: DocumentNode; // Apollo Query definition, returned by gql`...`
  storeName: string;
  nest?: ObjectPath;
  retrieveField?: string;
  retriever?: Retriever;
}

type SubscribedQuery = LinkedQuery | StoredQuery

type SubscribedQueries = Array<SubscribedQuery>;

enum UpdateTypesEnum {
  replace = 'replace',
  rootMerge = 'rootMerge',
  deepMerge = 'deepMerge',
}
```

## License

Copyright (c) 2019 KosiakMD (Anton Kosiak)

Licensed under the The MIT License (MIT) (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://raw.githubusercontent.com/airbnb/react-native-maps/master/LICENSE

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
