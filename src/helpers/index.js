import { get, set, deepMerge } from '../utils';

/** @enum string */
export const UpdateTypesEnum = {
  replace: 'replace',
  rootMerge: 'rootMerge',
  deepMerge: 'deepMerge',
};
/**
 * @typedef {{
 *  sourceQuery: QueryObject
 *  sourcePath?: ObjectPath
 *  targetQuery: QueryObject
 *  targetPath: ObjectPath
 *  updateType?: UpdateTypesEnum
 *  withMerge?: Boolean
 *  withMergeRootOnly?: Boolean
 * }} UpdateInput
 * withMerge - deep merge or replace; DEFAULT = FALSE
 * withMergeRootOnly - either root merge with replacing nested
 */
/**
 * @callback updateQueryHelper
 * @param {UpdateInput} updateInput
 * @return {object}
 * */
export const updateQueryHelper = updateInput => {
  const {
    sourceQuery,
    targetQuery,
    sourcePath = [],
    targetPath = [],
    withMerge = false,
    withMergeRootOnly = false,
    updateType = UpdateTypesEnum.replace,
  } = updateInput;
  const newData = get(sourceQuery, sourcePath);
  let setData = null;
  if (updateType === UpdateTypesEnum.replace) {
    // just replace
    setData = newData;
  } else if (withMergeRootOnly || updateType === UpdateTypesEnum.rootMerge) {
    // root merge only
    setData = { ...get(targetQuery, targetPath), ...newData };
  } else if (withMerge || updateType === UpdateTypesEnum.deepMerge) {
    // deep merge
    setData = deepMerge(get(targetQuery, targetPath), newData);
  }
  return set(targetQuery, targetPath, setData);
};
updateQueryHelper.types = UpdateTypesEnum;

/**
 * @param {string | QueryObject} query
 * @return {string}
 * */
export const getQueryName = query =>
  get(query, ['definitions', 0, 'name', 'value']);
