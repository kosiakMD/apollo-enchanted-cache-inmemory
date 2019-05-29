import { AsyncStorage } from 'react-native';

class AppStorage {
  /**
   * @callback storageCallback
   *  @param {Error|null} error
   *  @return void
   */
  /**
   * @callback getCallback
   *  @param {Error|null} error
   *  @param {string|null} result
   *  @return void
   */
  /**
   * @callback keysCallback
   *  @param {Error|null} error
   *  @param {Array<string>|null} result
   *  @return void
   */
  /**
   *  @param {Query | String} key
   *  @param {getCallback?} callback
   *  @return {Promise}
   * */
  static async get(key, callback) {
    return AsyncStorage.getItem(key, callback);
  }

  /**
   * @callback multiActionCallback
   *  @param {Array<Error>?} error
   *  @param {Array<string>?} result
   *  @return void
   */
  /**
   *  @param {Query | String} key
   *  @param {multiActionCallback?} callback
   *  @return {Promise}
   * */
  static async multiGet(key, callback) {
    return AsyncStorage.multiGet(key, callback);
  }

  /**
   *  @param {Query | String} key
   *  @param {multiActionCallback?} callback
   *  @return {Promise}
   * */
  static async multiRemove(key, callback) {
    return AsyncStorage.multiRemove(key, callback);
  }

  /**
   *  @param {String} key
   *  @param {String} data
   *  @param {storageCallback?} callback
   * */
  static async set(key, data, callback) {
    return AsyncStorage.setItem(key, data, callback);
  }

  /**
   *  @param {String} key
   *  @param {String} data
   *  @param {storageCallback?} callback
   * */
  static async merge(key, data, callback) {
    return AsyncStorage.mergeItem(key, data, callback);
  }

  /**
   *  @param {Query | String} key
   *  @param {storageCallback?} callback
   *  @return {Promise}
   * */
  static async remove(key, callback) {
    return AsyncStorage.removeItem(key, callback);
  }

  /**
   *  @param {storageCallback?} callback
   *  @return {Promise}
   * */
  static async reset(callback) {
    return AsyncStorage.clear(callback);
  }

  /**
   *  @param {keysCallback?} callback
   *  @return {Promise}
   * */
  static async getKeys(callback) {
    return AsyncStorage.getAllKeys(callback);
  }
}

export default AppStorage;
