angular.module('starter.services')
.factory('Cache', ['CacheFactory', '$q', function(CacheFactory, $q) {

    var Cache;

    if (!CacheFactory.get('cache')) {
        Cache = CacheFactory('cache', {
            maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes.
            cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour.
            deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
            storageMode: 'localStorage' // This cache will use `localStorage`.
        });
    }

    Cache.timeExp = {
        'user_me': 30
    };

    Cache.putExp =  function(key, data, sec) {

        var currentDate = new Date().getTime();
        var expCacheDate = currentDate + sec * 1000;


        Cache.put(key, data);
        Cache.put(key + '_date_exp', expCacheDate);
    };

    Cache.getPromise = function(key) {

        var q = $q.defer();

        if (Cache.get(key)) {
            var currentDate = new Date().getTime();
            if (Cache.get(key + '_date_exp') != null && currentDate  >= Cache.get(key + '_date_exp')) {
                Cache.remove(key);
                Cache.remove(key + '_date_exp');
                q.reject('cache_error_exp');
            } else {
                q.resolve(Cache.get(key));
            }
        } else {
            q.reject('cache_error');
        }


        return q.promise;

    };

    return Cache;

}]);