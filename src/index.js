export GQLStorage from './GQLStorage';
export EnchantedPromise from './helpers/EnchantedPromise';
export * from './helpers';
export * from './utils';
import EnchantedInMemoryCache from './lib/EnchantedInMemoryCache';
export const enchantInMemoryCache = EnchantedInMemoryCache;
export const createEnchantedInMemoryCache = EnchantedInMemoryCache;
