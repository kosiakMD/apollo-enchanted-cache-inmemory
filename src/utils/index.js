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
 * @param {any} nest
 * @param {Object} obj
 * @return Object
 * */
export function nestedFromArray(arrayPath, nest, obj = {}) {
  arrayPath.reduce(
    // eslint-disable-next-line
    (o, s, index) => index + 1 === arrayPath.length ? (o[s] = nest) : (o[s] = {}),
    obj,
  );
  return obj;
}

/**
 * @callback
 * @param {Object} obj
 * @param {ObjectPath} path
 * @param {any?} def
 * @return {string | number | object}
 * */
export function get(obj, path, def) {
  const fullPath = getPathAsArray(path);

  return fullPath.every(everyFunc) ? obj : def;

  function everyFunc(step) {
    // eslint-disable-next-line
    return !(step != null && (obj = obj[step]) === undefined);
  }
}

/**
 * @callback
 * @param {Object} obj
 * @param {ObjectPath} path
 * @param {any} setValue
 * @return {Object}
 * */
export function set(obj, path, setValue) {
  const fullPath = getPathAsArray(path);
  const length = fullPath.length - 1;
  let index = -1;
  let nested = obj;
  let prevNest = null;

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
    nestedFromArray(nestPath, setValue, prevNest);
  }

  return obj;
}
