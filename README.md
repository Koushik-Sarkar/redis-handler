# redis-handler
Store, retrieve and remove from redis easily 

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
 
 To Retrive data from cache:
 =============================
 
 redis.retrive('Key')
        .then(data => console.log(data))
        .catch(err => console.log(err));

To Delete data from cache:
==============================

redis.remove('key') .then() .catch(); 

NOTE: then and catch are optional as logs are handled by lib itself
