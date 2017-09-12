# redis-handler
Store, retrieve and remove from redis easily with automatically logging happen in console.

To use this lib below is mandetory
=====================================
import Redis from 'redis-handler';

const redis = new Redis('portno', 'host');

To store data in cache:
=========================

 redis.store('Key', 'data', 'expiry')
 .then()
 .catch();
 
 NOTE: then and catch are optional as logs are handled by lib itself
 
 To Retrieve data from cache:
 =============================
 
 redis.retrieve('Key')
        .then(data => console.log(data))
        .catch(err => console.log(err));

To Delete data from cache:
==============================

redis.remove('key') .then() .catch(); 

NOTE: then and catch are optional as logs are handled by lib itself
