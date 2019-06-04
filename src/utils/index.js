/**
 * @typedef {String | Number | Object | Array} Any
 * */
/**
 * @typedef {Array<string|number>} ArrayPath
 * */
/**
 * @typedef {ArrayPath|string} ObjectPath
 * ['a', 'b', 'c', 0] | 'a.b.c.0'
 * */
/**
 * @callback
 * @param {ObjectPath} path
 * @return Array<string|number>
 * */
function getPathAsArray(path) {
  let fullPath = path;
  if (typeof path === 'string') {
    fullPath = path
      .replace(/\[/g, '.')
      .replace(/]/g, '')
      .split('.')
      .filter(Boolean);
  }
  return fullPath;
}

/**
 * @callback
 * @param {ArrayPath} arrayPath
 * @param {Any} nest
 * @param {Object} obj
 * @return Object
 * */
export function nestByArrayPath(arrayPath, nest, obj = {}) {
  arrayPath.reduce(
    // eslint-disable-next-line
    (o, s, index) =>
      index + 1 === arrayPath.length ? (o[s] = nest) : (o[s] = {}),
    obj,
  );
  return obj;
}

/**
 * @callback
 * @param {Object} obj
 * @param {ObjectPath} path
 * @param {Any?} def
 * @return {string | number | object}
 * */
export function get(obj, path, def) {
  const fullPath = getPathAsArray(path);

  return fullPath.every(everyFunc) ? obj : def;

  function everyFunc(step) {
    return !(obj == null || (step != null && (obj = obj[step]) === undefined));
  }
}

/**
 * @callback
 * @param {Object} target
 * @param {ObjectPath} path
 * @param {Any} setValue
 * @return {Object}
 * */
export function set(target, path, setValue) {
  const fullPath = getPathAsArray(path);
  const length = fullPath.length - 1;
  let index = -1;
  let nested = target;
  let prevNest = null;

  if (fullPath.length) {
    // eslint-disable-next-line
    while (nested != null && index++ < length) {
      prevNest = nested;
      const key = fullPath[index];
      if (typeof nested[key] === 'object') {
        nested = nested[key];
      } else {
        nested = undefined;
      }
    }

    if (index > length) {
      prevNest[fullPath[index - 1]] = setValue;
    } else {
      const nestPath = fullPath.slice(index);
      nestByArrayPath(nestPath, setValue, prevNest);
    }
  } else {
    target = setValue;
  }

  return target;
}

/**
 * @callback
 * @param {Object} target
 * @param {Object} source
 * @return {Object}
 * */
export function deepMerge(target, source) {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (let key of Object.keys(source)) {
    if (source[key] instanceof Object)
      Object.assign(source[key], deepMerge(target[key], source[key]));
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
}
