import { get, set, deepMerge } from '../utils';

/**
 * @callback
 * @param {QueryObject} sourceQuery
 * @param {ObjectPath} sourcePath
 * @param {QueryObject?} targetQuery
 * @param {ObjectPath?} targetPath
 * @param {Boolean?} withMerge - deep merge or replace; DEFAULT = TRUE!!!
 * @param {Boolean?} withMergeRootOnly - either root merge or deep merge
 * @return {object}
 * */
export const updateQueryHandler = (
  sourceQuery,
  sourcePath,
  targetQuery,
  targetPath,
  withMerge = true,
  withMergeRootOnly = false,
) => {
  const newData = get(sourceQuery, sourcePath);
  return set(
    targetQuery,
    targetPath,
    withMerge
      ? withMergeRootOnly
        ? { ...get(targetQuery, targetPath), ...newData } // root merge only
        : deepMerge(get(targetQuery, targetPath), newData) // deep merge
      : newData, // just replace
  );
};

/**
 * @param {string | QueryObject} query
 * @return {string}
 * */
export const getQueryName = query =>
  get(query, ['definitions', 0, 'name', 'value']);
