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
 * @callback updateQueryHandler
 * @param {UpdateInput} updateInput
 * @return {object}
 * */
export const updateQueryHandler = updateInput => {
  const {
    sourceQuery,
    targetQuery,
    sourcePath = [],
    targetPath = [],
    withMerge = false,
    withMergeRootOnly = false,
    updateType,
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
updateQueryHandler.types = UpdateTypesEnum;

/**
 * @param {string | QueryObject} query
 * @return {string}
 * */
export const getQueryName = query =>
  get(query, ['definitions', 0, 'name', 'value']);
