'use strict';
// set cache name
let staticCacheName = 'restaurantReviewCache';

// cache resources at service worker installation
this.addEventListener('install', () => {
	let urlsToCache = [
		'/',
		'index.html',
		'restaurant.html',
		'css/styles.css',
		'css/frontPage.css',
		'css/restaurantDetails.css',
		'data/restaurants.json',
		'img/1.jpg',
		'img/10.jpg',
		'img/2.jpg',
		'img/3.jpg',
		'img/4.jpg',
		'img/5.jpg',
		'img/6.jpg',
		'img/7.jpg',
		'img/8.jpg',
		'img/9.jpg',
		'js/dbhelper.js',
		'js/main.js',
		'js/restaurant_info.js'
	];

	event.waitUntil(
		caches.open(staticCacheName)
		.then((cache) => {
			return cache.addAll(urlsToCache);
		})
	);
});


// delete any earlier cache at service worker activation
this.addEventListener('activate', () => {
	new Promise.all (
		caches.keys()
		.then((cacheNames) => {
			cacheNames
			.filter((cacheName) => {
				return cacheName.startsWith('rest') && cacheName != staticCacheName;
			})
			.map((cacheName) => {return caches.delete(cacheName);});
		})
	);
});


// interrupt fetch request and serve from cache if resource is cached
// add url to cache if request was not cached before
this.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request)
		.then((response) => {
			if (response) {
				return response;
			}
			return fetch(event.request).then(addUrlToCache(event.request));
		})
	);
});

// add url to cache
function addUrlToCache(request) {
	caches.open(staticCacheName)
	.then((cache) => {cache.add(request.url);});
}