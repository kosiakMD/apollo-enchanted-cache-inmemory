/**
 * @typedef {{
 *   getItem: Function,
 *   setItem: Function,
 *   removeItem: Function,
 *   clear: Function,
 *   getAllKeys: Function,
 *   multiGet?: Function,
 *   multiRemove?: Function,
 *   mergeItem?: Function,
 * }} AnyStorage
 * */

class AppStorage {
  /** @type AnyStorage || null */
  storage = null;

  constructor(storage) {
    if (storage) {
      this.storage = storage;
      if (!this.storage.multiGet || !this.storage.multiRemove) {
        this.enchantLocalStorage(this.storage);
      }
    } else {
      throw new Error('No Storage provided');
    }
  }

  enchantLocalStorage(localStorage) {
    /** add multiGet */
    localStorage.multiGet = async (keys, callback) => {
      const errors = [];
      const results = [];
      const interCallback = (error, result) => {
        if (error) errors.push(error);
        if (result) results.push(result);
      };
      try {
        return await Promise.all(keys.map(key => this.get(key, interCallback)));
      } catch (e) {
        throw e;
      } finally {
        if (callback) callback(errors, results);
      }
    };
    /** add multiRemove */
    localStorage.multiRemove = async (keys, callback) => {
      const errors = [];
      const results = [];
      const interCallback = (error, result) => {
        if (error) errors.push(error);
        if (result) results.push(result);
      };
      try {
        return await Promise.all(
          keys.map(key => this.remove(key, interCallback)),
        );
      } catch (e) {
        throw e;
      } finally {
        if (callback) callback(errors, results);
      }
    };
  }

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
  async get(key, callback) {
    return this.storage.getItem(key, callback);
  }

  /**
   * @callback multiActionCallback
   *  @param {Array<Error>?} error
   *  @param {Array<string>?} result
   *  @return void
   */
  /**
   *  @param {Array<Query | String>} keys
   *  @param {multiActionCallback?} callback
   *  @return {Promise}
   * */
  async multiGet(keys, callback) {
    return this.storage.multiGet(keys, callback);
  }

  /**
   *  @param {Query | String} key
   *  @param {multiActionCallback?} callback
   *  @return {Promise}
   * */
  async multiRemove(key, callback) {
    return this.storage.multiRemove(key, callback);
  }

  /**
   *  @param {String} key
   *  @param {String} data
   *  @param {storageCallback?} callback
   * */
  async set(key, data, callback) {
    return this.storage.setItem(key, data, callback);
  }

  /**
   *  @param {String} key
   *  @param {String} data
   *  @param {storageCallback?} callback
   * */
  async merge(key, data, callback) {
    return this.storage.mergeItem(key, data, callback);
  }

  /**
   *  @param {Query | String} key
   *  @param {storageCallback?} callback
   *  @return {Promise}
   * */
  async remove(key, callback) {
    return this.storage.removeItem(key, callback);
  }

  /**
   *  @param {storageCallback?} callback
   *  @return {Promise}
   * */
  async reset(callback) {
    return this.storage.clear(callback);
  }

  /**
   *  @param {keysCallback?} callback
   *  @return {Promise}
   * */
  async getKeys(callback) {
    return this.storage.getAllKeys(callback);
  }
}

export default AppStorage;
