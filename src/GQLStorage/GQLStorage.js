import AppStorage from '../AppStorage';
import { getQueryName } from '../helpers';

/**
 * @class GQLStorage
 */
class GQLStorage {
  static queryMark = 'Query';

  /**
   * @static
   * @param {Query | string} query
   * @return {string} "Query:<TString>"
   * */
  static getQueryName(query) {
    let queryName = query;
    if (typeof query !== 'string') {
      queryName = getQueryName(query);
    }
    return `${GQLStorage.queryMark}:${queryName}`;
  }

  /**
   * @static
   * @async
   * @param {Query | String} query
   * @param {Object | String} storeData
   * @return {Promise}
   * */
  static async saveQuery(query, storeData) {
    const queryName = GQLStorage.getQueryName(query);
    return AppStorage.set(queryName, JSON.stringify(storeData));
  }

  /**
   * @callback getCallback
   * @param {Error?} error
   * @param {string?} result
   * @return void
   */
  /**
   * @static
   * @async
   * @param {Query | String} query
   * @param {getCallback?} callback
   * @return {Promise}
   * */
  static async getQuery(query, callback) {
    const queryName = GQLStorage.getQueryName(query);
    const result = await AppStorage.get(queryName, callback);
    return JSON.parse(result);
  }

  /**
   * @callback multiActionCallback
   * @param {Array<Error>?} error
   * @param {Array<string>?} result
   * @return void
   */
  /**
   * @static
   * @async
   * @param {Array<Query | String>} queries
   * @param {multiActionCallback?} callback
   * @return {Promise}
   * */
  static async multiGet(queries, callback) {
    const keys = queries.map(GQLStorage.getQueryName);
    const results = await AppStorage.multiGet(keys, callback);
    return results.map(keyValueArray => JSON.parse(keyValueArray[1]));
  }

  /**
   * @static
   * @async
   * @param {Array<Query | String>} queries
   * @param {multiActionCallback?} callback
   * @return {Promise}
   * */
  static async multiRemove(queries, callback) {
    const keys = queries.map(GQLStorage.getQueryName);
    await AppStorage.multiRemove(keys, callback);
    return true;
  }

  /**
   * @callback removeCallback
   * @param {Error?} error
   * @param {string?} result
   * @return void
   */
  /**
   * @static
   * @async
   * @param {Query | String} query
   * @param {removeCallback?} callback
   * @return {Promise}
   * */
  static async removeQuery(query, callback) {
    const queryName = GQLStorage.getQueryName(query);
    return AppStorage.remove(queryName, callback);
  }
}

export default GQLStorage;
