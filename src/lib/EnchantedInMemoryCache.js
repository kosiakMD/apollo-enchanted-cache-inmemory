import DefaultGQLStorage from '../GQLStorage';
import { getQueryName } from '../helpers';
import { nestByArrayPath } from '../utils';
import EnchantedPromise from '../helpers/EnchantedPromise';

// for web to avoid ReferenceError exception
const __DEV__ = this.__DEV__;

/**
 * type DocumentNode = {
 *    +kind: 'Document',
 *    +loc?: Location,
 *    +definitions: $ReadOnlyArray<DefinitionNode>,
 * };
 * */
/**
 * @typedef {{
 *  kind: 'Document',
 *  loc?: Location,
 *  definitions: Array<{}>,
 * }} Query - DocumentNode
 * */
/**
 * @typedef {Object} QueryObject
 * */
/**
 * @typedef {{
 *   data: Object,
 *   depend: Object,
 * }} DepTrackingCache
 * */
/**
 * @callback Retriever
 * @param {QueryObject} fromQuery
 * @return {object}
 * */
/**
 * @callback Updater
 * @param {QueryObject} fromQuery
 * @param  {QueryObject} updateQuery
 * @return {object}
 * */
/**
 * @callback LogMethod
 * @param {...*} var_args
 * @return void
 * */
/**
 * @typedef {{
 *   log: LogMethod,
 *   warn: LogMethod,
 *   error: LogMethod,
 *   info?: LogMethod,
 *   debug?: LogMethod,
 *   [...]: function
 * }} Logger
 * */
/**
 * @callback LogCallback
 * @param {DepTrackingCache} cacheData
 * @param {String} queryName
 * @return void
 * */
/**
 * @typedef {{
 *  data: {}
 *  query: Query
 *  variables
 * }} QueryOptions
 * */
/**
 * @typedef {{
 *  name: string,
 *  queryNode: Query,
 *  updateName: string
 *  updater?: Updater
 * }} LinkedQuery
 * */
/**
 * @typedef {{
 *  name: string,
 *  queryNode: Query,
 *  storeName: string,
 *  nest?: ObjectPath
 *  retrieveField?: string
 *  retriever?: Retriever
 * }} StoredQuery
 * */
/**
 * @typedef {{
 *  name: string,
 *  queryNode: Query,
 *  updateName: string
 *  storeName: string,
 *  nest?: ObjectPath
 *  retrieveField?: string
 *  retriever?: Retriever
 *  updater?: Updater
 * }} SubscribedQuery
 * */
/**
 * @typedef {
 *  Array<SubscribedQuery>
 * } SubscribedQueries
 * */
/**
 * @typedef {InMemoryCache & {
 *  disenchant: Function
 *  restoreAllQueries: Function
 *  writeQuery: Function
 * }} EnchantedInMemoryCache
 * */
/**
 * @typedef {{
 *   logger: Logger,
 *   logCacheWrite: Boolean,
 *   beforeHandlers: LogCallback,
 *   beforeWrite: LogCallback,
 *   afterWrite: LogCallback,
 * }} Logs
 * */
/**
 * @typedef {{
 *   subscribedQueries: SubscribedQueries,
 *   version: string | number | any,
 *   migrations?: Array<any>,
 * }} EnchantedInMemoryCacheConfig */
/**
 * GeneratedClientQuery - set store defaults as 1st cache write "ROOT_QUERY"
 * @param {InMemoryCache | EnchantedInMemoryCache} aCache
 * @param {EnchantedInMemoryCacheConfig} enchantedInMemoryCacheConfig
 * @param {Logs?} logs
 * @param {AsyncStorage || LocalStorage} AppStorage - storage DI
 * @param {GQLStorage?} GraphQLStorage - storage DI
 * @return {EnchantedInMemoryCache}
 * */
// TODO better to extend but seems it's redundant for 1 override & 2 new methods
const createEnchantedInMemoryCache = ({
  aCache,
  enchantedInMemoryCacheConfig,
  AppStorage,
  logs = {},
  GraphQLStorage,
}) => {
  /** static begin */
  const versionQueryName = '&_cacheVersion_$';
  /** static end */

  /** constructor begin */
  const GQLStorage = GraphQLStorage || new DefaultGQLStorage(AppStorage);

  if (!enchantedInMemoryCacheConfig) {
    throw new Error('No EnchantedInMemoryCacheConfig provided');
  }

  /** @type EnchantedPromise */
  let versionSyncing;

  const { subscribedQueries, version } = enchantedInMemoryCacheConfig;

  const {
    logger,
    logCacheWrite,
    beforeHandlers,
    beforeWrite,
    afterWrite,
  } = logs;
  /** constructor end */

  const logError = (title, er, name = '') => {
    if (__DEV__) {
      if (!logger)
        throw new Error('There is no provided `logger` at `logs` param');
      logger.warn(`\nError: ${title}`);
      if (Array.isArray(er)) {
        logger.log('\nqueries', name);
        er.map(logger.error);
      } else {
        name && logger.log(`\ntracked by name ${name}`);
        logger.error(er);
      }
    }
  };

  const asyncVersionSyncing = async (resolve, reject) => {
    try {
      const storedVersion = await GQLStorage.getQuery(versionQueryName);
      if (__DEV__) {
        logger.log(
          'EnchantedInMemoryCache',
          '\n\tstored version:',
          storedVersion,
          '\n\tcurrent version:',
          version,
        );
      }
      if (storedVersion !== version) {
        // TODO: provide logic of migration
        const queryNames = [];
        subscribedQueries.forEach(handler => {
          if (handler.storeName) {
            queryNames.push(handler.storeName);
          }
        });
        await GQLStorage.multiRemove(queryNames);
        await GQLStorage.saveQuery(versionQueryName, version);
      }
      resolve(true);
    } catch (e) {
      logError('Version Syncing', e);
      reject(e);
    }
  };

  /** constructor */
  if (version == null) {
    throw new Error('No version of EnchantedInMemoryCacheConfig provided');
  } else {
    versionSyncing = new EnchantedPromise(asyncVersionSyncing);
  }

  const restoreFromStorage = async () => {
    const queryNames = [];
    const storedQueries = subscribedQueries.filter(handler => {
      if (handler.storeName) {
        queryNames.push(handler.storeName);
        return true;
      }
      return false;
    });
    const callback = errors => {
      errors && logError('Restore From Storage', errors, storedQueries);
    };
    const queriesData = await GQLStorage.multiGet(queryNames, callback);
    return storedQueries.map(({ queryNode, nest }, index) =>
      aCache.writeQuery(
        {
          query: queryNode,
          data: nestByArrayPath(nest, queriesData[index]),
        },
        true, // ignore cache update
      ),
    );
  };

  const storeQuery = async (
    name,
    storeName,
    result,
    retriever,
    retrieveField,
  ) => {
    try {
      await GQLStorage.saveQuery(
        storeName,
        retriever ? retriever(result) : result[retrieveField],
      );
    } catch (e) {
      logError('Storing Query', e, name);
    }
  };

  const updateQuery = (name, queryNode, result, updater, retrieveField) => {
    try {
      const prevValue = aCache.readQuery({ query: queryNode });
      const data = updater ? updater(result, prevValue) : result[retrieveField];
      aCache.writeQuery({
        query: queryNode,
        data,
      });
    } catch (e) {
      logError('Updating Query', e, name);
    }
  };

  const { write: oldWrite, writeQuery: oldWriteQuery } = aCache;

  /**
   * @method
   * @param {QueryOptions} options
   * @param {Boolean?} ignore
   * */
  const writeQuery = (options, ignore) => {
    aCache.write(
      {
        dataId: 'ROOT_QUERY',
        result: options.data,
        query: aCache.transformDocument(options.query),
        variables: options.variables,
      },
      ignore,
    );
  };

  /**
   * @method
   * @param {{
   *   query: QueryObject
   *   result: Object
   * }} writeData
   * @param {Boolean?} ignore
   * @return void
   * */
  const write = (writeData, ignore) => {
    let allowWrite = true;
    const { query, result } = writeData;
    const queryName = getQueryName(query);
    if (logCacheWrite && __DEV__) {
      logger.log('On Cache Write', queryName, result, ignore ? 'ignore' : '');
      if (beforeHandlers) {
        beforeHandlers(aCache.data, queryName);
      }
    }
    if (ignore) {
      // just write into cache without handlers
      return oldWrite.call(aCache, writeData);
    }
    // eslint-disable-next-line
    for (let i = 0, max = subscribedQueries.length; i < max; i++) {
      /** @type SubscribedQuery */
      const handler = subscribedQueries[i];
      const {
        name,
        storeName,
        retriever,
        retrieveField,
        updateName,
        updater,
        queryNode,
      } = handler;

      if (queryName === name) {
        if (storeName) {
          /** storing goes asynchronously to do not influence on UI/UX flow */
          storeQuery(name, storeName, result, retriever, retrieveField);
        }
        if (updateName) {
          /** N.B! update cache goes synchronously to be up to date everywhere */
          updateQuery(name, queryNode, result, updater, retrieveField);
        }
      }
    }
    if (allowWrite) {
      if (logCacheWrite && __DEV__) {
        if (beforeWrite) {
          beforeWrite(aCache.data, queryName);
        }
      }

      oldWrite.call(aCache, writeData);

      if (logCacheWrite && __DEV__) {
        if (afterWrite) {
          afterWrite(aCache.data, queryName);
        }
      }
    }
  };

  /**
   * @method
   * @return void
   * */
  const disenchant = () => {
    aCache.write = oldWrite;
    aCache.writeQuery = oldWriteQuery;
    aCache.disenchant = void 0;
    delete aCache.disenchant;
    aCache.restoreAllQueries = void 0;
    delete aCache.restoreAllQueries;
    delete aCache.GraphQLStorage;
    delete aCache.AppStorage;
  };

  /**
   * @method
   * @return Promise
   * */
  const restoreAllQueries = async () => {
    if (versionSyncing.isPending()) {
      await versionSyncing;
      await restoreFromStorage(); // redundant when migration implemented
    } else {
      await restoreFromStorage();
    }
  };

  /** constructor */
  /** enchant */
  aCache.write = write;
  aCache.writeQuery = writeQuery;
  aCache.disenchant = disenchant;
  aCache.restoreAllQueries = restoreAllQueries;
  aCache.GQLStorage = GQLStorage;
  aCache.AppStorage = GQLStorage.appStorage;

  return aCache;
};

export default createEnchantedInMemoryCache;
