import { get, set } from '../utils';

/**
 * @callback
 * @param {QueryObject} fromQuery
 * @param {ObjectPath} retrieveFields
 * @param {QueryObject?} updateQuery
 * @param {ObjectPath?} nestFields
 * @param {Boolean?} withMerge - either merge or replace
 * @return {object}
 * */
export const updateQueryHandler = (
  fromQuery,
  retrieveFields,
  updateQuery,
  nestFields,
  withMerge = true,
) => {
  const newData = get(fromQuery, retrieveFields);
  return set(
    updateQuery,
    nestFields,
    withMerge ? { ...get(updateQuery, nestFields), ...newData } : newData,
  );
};

/**
 * @param {string | QueryObject} query
 * @return {string}
 * */
export const getQueryName = query =>
  get(query, ['definitions', 0, 'name', 'value']);
