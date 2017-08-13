/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "8ac35b0bea5185ad7a37"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_svg_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_svg_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_svg_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__graph__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tooltip__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__seeder__ = __webpack_require__(6);






// Config
const { id, w, h, bubbleWidth } = __WEBPACK_IMPORTED_MODULE_3__config__["a" /* config */]
const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth()

// Data
const boxes = Object(__WEBPACK_IMPORTED_MODULE_4__seeder__["a" /* getBoxes */])(currentYear)

// Graph
const graph = Object(__WEBPACK_IMPORTED_MODULE_1__graph__["a" /* GCGraph */])(id)
document.body.appendChild(graph)

// Tooltip
const tooltip = Object(__WEBPACK_IMPORTED_MODULE_2__tooltip__["a" /* GCTooltip */])(bubbleWidth)
document.body.appendChild(tooltip)

// Inject
Object(__WEBPACK_IMPORTED_MODULE_1__graph__["b" /* drawGCGraph */])(
  __WEBPACK_IMPORTED_MODULE_0_svg_js___default()(id).size(w, h),
  Object.assign(__WEBPACK_IMPORTED_MODULE_3__config__["a" /* config */], {
    tooltip,
    boxes,
    currentYear,
    currentMonth
  })
)


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
* svg.js - A lightweight library for manipulating and animating SVG.
* @version 2.6.3
* https://svgdotjs.github.io/
*
* @copyright Wout Fierens <wout@mick-wout.com>
* @license MIT
*
* BUILT: Fri Jul 21 2017 14:50:37 GMT+0200 (Mitteleuropäische Sommerzeit)
*/;
(function(root, factory) {
  /* istanbul ignore next */
  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(){
      return factory(root, root.document)
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof exports === 'object') {
    module.exports = root.document ? factory(root, root.document) : function(w){ return factory(w, w.document) }
  } else {
    root.SVG = factory(root, root.document)
  }
}(typeof window !== "undefined" ? window : this, function(window, document) {

// The main wrapping element
var SVG = this.SVG = function(element) {
  if (SVG.supported) {
    element = new SVG.Doc(element)

    if(!SVG.parser.draw)
      SVG.prepare()

    return element
  }
}

// Default namespaces
SVG.ns    = 'http://www.w3.org/2000/svg'
SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
SVG.xlink = 'http://www.w3.org/1999/xlink'
SVG.svgjs = 'http://svgjs.com/svgjs'

// Svg support test
SVG.supported = (function() {
  return !! document.createElementNS &&
         !! document.createElementNS(SVG.ns,'svg').createSVGRect
})()

// Don't bother to continue if SVG is not supported
if (!SVG.supported) return false

// Element id sequence
SVG.did  = 1000

// Get next named element id
SVG.eid = function(name) {
  return 'Svgjs' + capitalize(name) + (SVG.did++)
}

// Method for element creation
SVG.create = function(name) {
  // create element
  var element = document.createElementNS(this.ns, name)

  // apply unique id
  element.setAttribute('id', this.eid(name))

  return element
}

// Method for extending objects
SVG.extend = function() {
  var modules, methods, key, i

  // Get list of modules
  modules = [].slice.call(arguments)

  // Get object with extensions
  methods = modules.pop()

  for (i = modules.length - 1; i >= 0; i--)
    if (modules[i])
      for (key in methods)
        modules[i].prototype[key] = methods[key]

  // Make sure SVG.Set inherits any newly added methods
  if (SVG.Set && SVG.Set.inherit)
    SVG.Set.inherit()
}

// Invent new element
SVG.invent = function(config) {
  // Create element initializer
  var initializer = typeof config.create == 'function' ?
    config.create :
    function() {
      this.constructor.call(this, SVG.create(config.create))
    }

  // Inherit prototype
  if (config.inherit)
    initializer.prototype = new config.inherit

  // Extend with methods
  if (config.extend)
    SVG.extend(initializer, config.extend)

  // Attach construct method to parent
  if (config.construct)
    SVG.extend(config.parent || SVG.Container, config.construct)

  return initializer
}

// Adopt existing svg elements
SVG.adopt = function(node) {
  // check for presence of node
  if (!node) return null

  // make sure a node isn't already adopted
  if (node.instance) return node.instance

  // initialize variables
  var element

  // adopt with element-specific settings
  if (node.nodeName == 'svg')
    element = node.parentNode instanceof window.SVGElement ? new SVG.Nested : new SVG.Doc
  else if (node.nodeName == 'linearGradient')
    element = new SVG.Gradient('linear')
  else if (node.nodeName == 'radialGradient')
    element = new SVG.Gradient('radial')
  else if (SVG[capitalize(node.nodeName)])
    element = new SVG[capitalize(node.nodeName)]
  else
    element = new SVG.Element(node)

  // ensure references
  element.type  = node.nodeName
  element.node  = node
  node.instance = element

  // SVG.Class specific preparations
  if (element instanceof SVG.Doc)
    element.namespace().defs()

  // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
  element.setData(JSON.parse(node.getAttribute('svgjs:data')) || {})

  return element
}

// Initialize parsing element
SVG.prepare = function() {
  // Select document body and create invisible svg element
  var body = document.getElementsByTagName('body')[0]
    , draw = (body ? new SVG.Doc(body) : SVG.adopt(document.documentElement).nested()).size(2, 0)

  // Create parser object
  SVG.parser = {
    body: body || document.documentElement
  , draw: draw.style('opacity:0;position:absolute;left:-100%;top:-100%;overflow:hidden').node
  , poly: draw.polyline().node
  , path: draw.path().node
  , native: SVG.create('svg')
  }
}

SVG.parser = {
  native: SVG.create('svg')
}

document.addEventListener('DOMContentLoaded', function() {
  if(!SVG.parser.draw)
    SVG.prepare()
}, false)

// Storage for regular expressions
SVG.regex = {
  // Parse unit value
  numberAndUnit:    /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i

  // Parse hex value
, hex:              /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

  // Parse rgb value
, rgb:              /rgb\((\d+),(\d+),(\d+)\)/

  // Parse reference id
, reference:        /#([a-z0-9\-_]+)/i

  // splits a transformation chain
, transforms:       /\)\s*,?\s*/

  // Whitespace
, whitespace:       /\s/g

  // Test hex value
, isHex:            /^#[a-f0-9]{3,6}$/i

  // Test rgb value
, isRgb:            /^rgb\(/

  // Test css declaration
, isCss:            /[^:]+:[^;]+;?/

  // Test for blank string
, isBlank:          /^(\s+)?$/

  // Test for numeric string
, isNumber:         /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i

  // Test for percent value
, isPercent:        /^-?[\d\.]+%$/

  // Test for image url
, isImage:          /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i

  // split at whitespace and comma
, delimiter:        /[\s,]+/

  // The following regex are used to parse the d attribute of a path

  // Matches all hyphens which are not after an exponent
, hyphen:           /([^e])\-/gi

  // Replaces and tests for all path letters
, pathLetters:      /[MLHVCSQTAZ]/gi

  // yes we need this one, too
, isPathLetter:     /[MLHVCSQTAZ]/i

  // matches 0.154.23.45
, numbersWithDots:  /((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+))+/gi

  // matches .
, dots:             /\./g
}

SVG.utils = {
  // Map function
  map: function(array, block) {
    var i
      , il = array.length
      , result = []

    for (i = 0; i < il; i++)
      result.push(block(array[i]))

    return result
  }

  // Filter function
, filter: function(array, block) {
    var i
      , il = array.length
      , result = []

    for (i = 0; i < il; i++)
      if (block(array[i]))
        result.push(array[i])

    return result
  }

  // Degrees to radians
, radians: function(d) {
    return d % 360 * Math.PI / 180
  }

  // Radians to degrees
, degrees: function(r) {
    return r * 180 / Math.PI % 360
  }

, filterSVGElements: function(nodes) {
    return this.filter( nodes, function(el) { return el instanceof window.SVGElement })
  }

}

SVG.defaults = {
  // Default attribute values
  attrs: {
    // fill and stroke
    'fill-opacity':     1
  , 'stroke-opacity':   1
  , 'stroke-width':     0
  , 'stroke-linejoin':  'miter'
  , 'stroke-linecap':   'butt'
  , fill:               '#000000'
  , stroke:             '#000000'
  , opacity:            1
    // position
  , x:                  0
  , y:                  0
  , cx:                 0
  , cy:                 0
    // size
  , width:              0
  , height:             0
    // radius
  , r:                  0
  , rx:                 0
  , ry:                 0
    // gradient
  , offset:             0
  , 'stop-opacity':     1
  , 'stop-color':       '#000000'
    // text
  , 'font-size':        16
  , 'font-family':      'Helvetica, Arial, sans-serif'
  , 'text-anchor':      'start'
  }

}
// Module for color convertions
SVG.Color = function(color) {
  var match

  // initialize defaults
  this.r = 0
  this.g = 0
  this.b = 0

  if(!color) return

  // parse color
  if (typeof color === 'string') {
    if (SVG.regex.isRgb.test(color)) {
      // get rgb values
      match = SVG.regex.rgb.exec(color.replace(SVG.regex.whitespace,''))

      // parse numeric values
      this.r = parseInt(match[1])
      this.g = parseInt(match[2])
      this.b = parseInt(match[3])

    } else if (SVG.regex.isHex.test(color)) {
      // get hex values
      match = SVG.regex.hex.exec(fullHex(color))

      // parse numeric values
      this.r = parseInt(match[1], 16)
      this.g = parseInt(match[2], 16)
      this.b = parseInt(match[3], 16)

    }

  } else if (typeof color === 'object') {
    this.r = color.r
    this.g = color.g
    this.b = color.b

  }

}

SVG.extend(SVG.Color, {
  // Default to hex conversion
  toString: function() {
    return this.toHex()
  }
  // Build hex value
, toHex: function() {
    return '#'
      + compToHex(this.r)
      + compToHex(this.g)
      + compToHex(this.b)
  }
  // Build rgb value
, toRgb: function() {
    return 'rgb(' + [this.r, this.g, this.b].join() + ')'
  }
  // Calculate true brightness
, brightness: function() {
    return (this.r / 255 * 0.30)
         + (this.g / 255 * 0.59)
         + (this.b / 255 * 0.11)
  }
  // Make color morphable
, morph: function(color) {
    this.destination = new SVG.Color(color)

    return this
  }
  // Get morphed color at given position
, at: function(pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    // normalise pos
    pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

    // generate morphed color
    return new SVG.Color({
      r: ~~(this.r + (this.destination.r - this.r) * pos)
    , g: ~~(this.g + (this.destination.g - this.g) * pos)
    , b: ~~(this.b + (this.destination.b - this.b) * pos)
    })
  }

})

// Testers

// Test if given value is a color string
SVG.Color.test = function(color) {
  color += ''
  return SVG.regex.isHex.test(color)
      || SVG.regex.isRgb.test(color)
}

// Test if given value is a rgb object
SVG.Color.isRgb = function(color) {
  return color && typeof color.r == 'number'
               && typeof color.g == 'number'
               && typeof color.b == 'number'
}

// Test if given value is a color
SVG.Color.isColor = function(color) {
  return SVG.Color.isRgb(color) || SVG.Color.test(color)
}
// Module for array conversion
SVG.Array = function(array, fallback) {
  array = (array || []).valueOf()

  // if array is empty and fallback is provided, use fallback
  if (array.length == 0 && fallback)
    array = fallback.valueOf()

  // parse array
  this.value = this.parse(array)
}

SVG.extend(SVG.Array, {
  // Make array morphable
  morph: function(array) {
    this.destination = this.parse(array)

    // normalize length of arrays
    if (this.value.length != this.destination.length) {
      var lastValue       = this.value[this.value.length - 1]
        , lastDestination = this.destination[this.destination.length - 1]

      while(this.value.length > this.destination.length)
        this.destination.push(lastDestination)
      while(this.value.length < this.destination.length)
        this.value.push(lastValue)
    }

    return this
  }
  // Clean up any duplicate points
, settle: function() {
    // find all unique values
    for (var i = 0, il = this.value.length, seen = []; i < il; i++)
      if (seen.indexOf(this.value[i]) == -1)
        seen.push(this.value[i])

    // set new value
    return this.value = seen
  }
  // Get morphed array at given position
, at: function(pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    // generate morphed array
    for (var i = 0, il = this.value.length, array = []; i < il; i++)
      array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)

    return new SVG.Array(array)
  }
  // Convert array to string
, toString: function() {
    return this.value.join(' ')
  }
  // Real value
, valueOf: function() {
    return this.value
  }
  // Parse whitespace separated string
, parse: function(array) {
    array = array.valueOf()

    // if already is an array, no need to parse it
    if (Array.isArray(array)) return array

    return this.split(array)
  }
  // Strip unnecessary whitespace
, split: function(string) {
    return string.trim().split(SVG.regex.delimiter).map(parseFloat)
  }
  // Reverse array
, reverse: function() {
    this.value.reverse()

    return this
  }
, clone: function() {
    var clone = new this.constructor()
    clone.value = array_clone(this.value)
    return clone
  }
})
// Poly points array
SVG.PointArray = function(array, fallback) {
  SVG.Array.call(this, array, fallback || [[0,0]])
}

// Inherit from SVG.Array
SVG.PointArray.prototype = new SVG.Array
SVG.PointArray.prototype.constructor = SVG.PointArray

SVG.extend(SVG.PointArray, {
  // Convert array to string
  toString: function() {
    // convert to a poly point string
    for (var i = 0, il = this.value.length, array = []; i < il; i++)
      array.push(this.value[i].join(','))

    return array.join(' ')
  }
  // Convert array to line object
, toLine: function() {
    return {
      x1: this.value[0][0]
    , y1: this.value[0][1]
    , x2: this.value[1][0]
    , y2: this.value[1][1]
    }
  }
  // Get morphed array at given position
, at: function(pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    // generate morphed point string
    for (var i = 0, il = this.value.length, array = []; i < il; i++)
      array.push([
        this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos
      , this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
      ])

    return new SVG.PointArray(array)
  }
  // Parse point string and flat array
, parse: function(array) {
    var points = []

    array = array.valueOf()

    // if it is an array
    if (Array.isArray(array)) {
      // and it is not flat, there is no need to parse it
      if(Array.isArray(array[0])) {
        return array
      }
    } else { // Else, it is considered as a string
      // parse points
      array = array.trim().split(SVG.regex.delimiter).map(parseFloat)
    }

    // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
    // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.
    if (array.length % 2 !== 0) array.pop()

    // wrap points in two-tuples and parse points as floats
    for(var i = 0, len = array.length; i < len; i = i + 2)
      points.push([ array[i], array[i+1] ])

    return points
  }
  // Move point string
, move: function(x, y) {
    var box = this.bbox()

    // get relative offset
    x -= box.x
    y -= box.y

    // move every point
    if (!isNaN(x) && !isNaN(y))
      for (var i = this.value.length - 1; i >= 0; i--)
        this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]

    return this
  }
  // Resize poly string
, size: function(width, height) {
    var i, box = this.bbox()

    // recalculate position of all points according to new size
    for (i = this.value.length - 1; i >= 0; i--) {
      if(box.width) this.value[i][0] = ((this.value[i][0] - box.x) * width)  / box.width  + box.x
      if(box.height) this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
    }

    return this
  }
  // Get bounding box of points
, bbox: function() {
    SVG.parser.poly.setAttribute('points', this.toString())

    return SVG.parser.poly.getBBox()
  }
})

var pathHandlers = {
  M: function(c, p, p0) {
    p.x = p0.x = c[0]
    p.y = p0.y = c[1]

    return ['M', p.x, p.y]
  },
  L: function(c, p) {
    p.x = c[0]
    p.y = c[1]
    return ['L', c[0], c[1]]
  },
  H: function(c, p) {
    p.x = c[0]
    return ['H', c[0]]
  },
  V: function(c, p) {
    p.y = c[0]
    return ['V', c[0]]
  },
  C: function(c, p) {
    p.x = c[4]
    p.y = c[5]
    return ['C', c[0], c[1], c[2], c[3], c[4], c[5]]
  },
  S: function(c, p) {
    p.x = c[2]
    p.y = c[3]
    return ['S', c[0], c[1], c[2], c[3]]
  },
  Q: function(c, p) {
    p.x = c[2]
    p.y = c[3]
    return ['Q', c[0], c[1], c[2], c[3]]
  },
  T: function(c, p) {
    p.x = c[0]
    p.y = c[1]
    return ['T', c[0], c[1]]
  },
  Z: function(c, p, p0) {
    p.x = p0.x
    p.y = p0.y
    return ['Z']
  },
  A: function(c, p) {
    p.x = c[5]
    p.y = c[6]
    return ['A', c[0], c[1], c[2], c[3], c[4], c[5], c[6]]
  }
}

var mlhvqtcsa = 'mlhvqtcsaz'.split('')

for(var i = 0, il = mlhvqtcsa.length; i < il; ++i){
  pathHandlers[mlhvqtcsa[i]] = (function(i){
    return function(c, p, p0) {
      if(i == 'H') c[0] = c[0] + p.x
      else if(i == 'V') c[0] = c[0] + p.y
      else if(i == 'A'){
        c[5] = c[5] + p.x,
        c[6] = c[6] + p.y
      }
      else
        for(var j = 0, jl = c.length; j < jl; ++j) {
          c[j] = c[j] + (j%2 ? p.y : p.x)
        }

      return pathHandlers[i](c, p, p0)
    }
  })(mlhvqtcsa[i].toUpperCase())
}

// Path points array
SVG.PathArray = function(array, fallback) {
  SVG.Array.call(this, array, fallback || [['M', 0, 0]])
}

// Inherit from SVG.Array
SVG.PathArray.prototype = new SVG.Array
SVG.PathArray.prototype.constructor = SVG.PathArray

SVG.extend(SVG.PathArray, {
  // Convert array to string
  toString: function() {
    return arrayToString(this.value)
  }
  // Move path string
, move: function(x, y) {
    // get bounding box of current situation
    var box = this.bbox()

    // get relative offset
    x -= box.x
    y -= box.y

    if (!isNaN(x) && !isNaN(y)) {
      // move every point
      for (var l, i = this.value.length - 1; i >= 0; i--) {
        l = this.value[i][0]

        if (l == 'M' || l == 'L' || l == 'T')  {
          this.value[i][1] += x
          this.value[i][2] += y

        } else if (l == 'H')  {
          this.value[i][1] += x

        } else if (l == 'V')  {
          this.value[i][1] += y

        } else if (l == 'C' || l == 'S' || l == 'Q')  {
          this.value[i][1] += x
          this.value[i][2] += y
          this.value[i][3] += x
          this.value[i][4] += y

          if (l == 'C')  {
            this.value[i][5] += x
            this.value[i][6] += y
          }

        } else if (l == 'A')  {
          this.value[i][6] += x
          this.value[i][7] += y
        }

      }
    }

    return this
  }
  // Resize path string
, size: function(width, height) {
    // get bounding box of current situation
    var i, l, box = this.bbox()

    // recalculate position of all points according to new size
    for (i = this.value.length - 1; i >= 0; i--) {
      l = this.value[i][0]

      if (l == 'M' || l == 'L' || l == 'T')  {
        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y

      } else if (l == 'H')  {
        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x

      } else if (l == 'V')  {
        this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y

      } else if (l == 'C' || l == 'S' || l == 'Q')  {
        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
        this.value[i][3] = ((this.value[i][3] - box.x) * width)  / box.width  + box.x
        this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y

        if (l == 'C')  {
          this.value[i][5] = ((this.value[i][5] - box.x) * width)  / box.width  + box.x
          this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y
        }

      } else if (l == 'A')  {
        // resize radii
        this.value[i][1] = (this.value[i][1] * width)  / box.width
        this.value[i][2] = (this.value[i][2] * height) / box.height

        // move position values
        this.value[i][6] = ((this.value[i][6] - box.x) * width)  / box.width  + box.x
        this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y
      }

    }

    return this
  }
  // Test if the passed path array use the same path data commands as this path array
, equalCommands: function(pathArray) {
    var i, il, equalCommands

    pathArray = new SVG.PathArray(pathArray)

    equalCommands = this.value.length === pathArray.value.length
    for(i = 0, il = this.value.length; equalCommands && i < il; i++) {
      equalCommands = this.value[i][0] === pathArray.value[i][0]
    }

    return equalCommands
  }
  // Make path array morphable
, morph: function(pathArray) {
    pathArray = new SVG.PathArray(pathArray)

    if(this.equalCommands(pathArray)) {
      this.destination = pathArray
    } else {
      this.destination = null
    }

    return this
  }
  // Get morphed path array at given position
, at: function(pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    var sourceArray = this.value
      , destinationArray = this.destination.value
      , array = [], pathArray = new SVG.PathArray()
      , i, il, j, jl

    // Animate has specified in the SVG spec
    // See: https://www.w3.org/TR/SVG11/paths.html#PathElement
    for (i = 0, il = sourceArray.length; i < il; i++) {
      array[i] = [sourceArray[i][0]]
      for(j = 1, jl = sourceArray[i].length; j < jl; j++) {
        array[i][j] = sourceArray[i][j] + (destinationArray[i][j] - sourceArray[i][j]) * pos
      }
      // For the two flags of the elliptical arc command, the SVG spec say:
      // Flags and booleans are interpolated as fractions between zero and one, with any non-zero value considered to be a value of one/true
      // Elliptical arc command as an array followed by corresponding indexes:
      // ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
      //   0    1   2        3                 4             5      6  7
      if(array[i][0] === 'A') {
        array[i][4] = +(array[i][4] != 0)
        array[i][5] = +(array[i][5] != 0)
      }
    }

    // Directly modify the value of a path array, this is done this way for performance
    pathArray.value = array
    return pathArray
  }
  // Absolutize and parse path to array
, parse: function(array) {
    // if it's already a patharray, no need to parse it
    if (array instanceof SVG.PathArray) return array.valueOf()

    // prepare for parsing
    var i, x0, y0, s, seg, arr
      , x = 0
      , y = 0
      , paramCnt = { 'M':2, 'L':2, 'H':1, 'V':1, 'C':6, 'S':4, 'Q':4, 'T':2, 'A':7, 'Z':0 }

    if(typeof array == 'string'){

      array = array
        .replace(SVG.regex.numbersWithDots, pathRegReplace) // convert 45.123.123 to 45.123 .123
        .replace(SVG.regex.pathLetters, ' $& ') // put some room between letters and numbers
        .replace(SVG.regex.hyphen, '$1 -')      // add space before hyphen
        .trim()                                 // trim
        .split(SVG.regex.delimiter)   // split into array

    }else{
      array = array.reduce(function(prev, curr){
        return [].concat.call(prev, curr)
      }, [])
    }

    // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]
    var arr = []
      , p = new SVG.Point()
      , p0 = new SVG.Point()
      , index = 0
      , len = array.length

    do{
      // Test if we have a path letter
      if(SVG.regex.isPathLetter.test(array[index])){
        s = array[index]
        ++index
      // If last letter was a move command and we got no new, it defaults to [L]ine
      }else if(s == 'M'){
        s = 'L'
      }else if(s == 'm'){
        s = 'l'
      }

      arr.push(pathHandlers[s].call(null,
          array.slice(index, (index = index + paramCnt[s.toUpperCase()])).map(parseFloat),
          p, p0
        )
      )

    }while(len > index)

    return arr

  }
  // Get bounding box of path
, bbox: function() {
    SVG.parser.path.setAttribute('d', this.toString())

    return SVG.parser.path.getBBox()
  }

})

// Module for unit convertions
SVG.Number = SVG.invent({
  // Initialize
  create: function(value, unit) {
    // initialize defaults
    this.value = 0
    this.unit  = unit || ''

    // parse value
    if (typeof value === 'number') {
      // ensure a valid numeric value
      this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value

    } else if (typeof value === 'string') {
      unit = value.match(SVG.regex.numberAndUnit)

      if (unit) {
        // make value numeric
        this.value = parseFloat(unit[1])

        // normalize
        if (unit[5] == '%')
          this.value /= 100
        else if (unit[5] == 's')
          this.value *= 1000

        // store unit
        this.unit = unit[5]
      }

    } else {
      if (value instanceof SVG.Number) {
        this.value = value.valueOf()
        this.unit  = value.unit
      }
    }

  }
  // Add methods
, extend: {
    // Stringalize
    toString: function() {
      return (
        this.unit == '%' ?
          ~~(this.value * 1e8) / 1e6:
        this.unit == 's' ?
          this.value / 1e3 :
          this.value
      ) + this.unit
    }
  , toJSON: function() {
      return this.toString()
    }
  , // Convert to primitive
    valueOf: function() {
      return this.value
    }
    // Add number
  , plus: function(number) {
      number = new SVG.Number(number)
      return new SVG.Number(this + number, this.unit || number.unit)
    }
    // Subtract number
  , minus: function(number) {
      number = new SVG.Number(number)
      return new SVG.Number(this - number, this.unit || number.unit)
    }
    // Multiply number
  , times: function(number) {
      number = new SVG.Number(number)
      return new SVG.Number(this * number, this.unit || number.unit)
    }
    // Divide number
  , divide: function(number) {
      number = new SVG.Number(number)
      return new SVG.Number(this / number, this.unit || number.unit)
    }
    // Convert to different unit
  , to: function(unit) {
      var number = new SVG.Number(this)

      if (typeof unit === 'string')
        number.unit = unit

      return number
    }
    // Make number morphable
  , morph: function(number) {
      this.destination = new SVG.Number(number)

      if(number.relative) {
        this.destination.value += this.value
      }

      return this
    }
    // Get morphed number at given position
  , at: function(pos) {
      // Make sure a destination is defined
      if (!this.destination) return this

      // Generate new morphed number
      return new SVG.Number(this.destination)
          .minus(this)
          .times(pos)
          .plus(this)
    }

  }
})


SVG.Element = SVG.invent({
  // Initialize node
  create: function(node) {
    // make stroke value accessible dynamically
    this._stroke = SVG.defaults.attrs.stroke
    this._event = null

    // initialize data object
    this.dom = {}

    // create circular reference
    if (this.node = node) {
      this.type = node.nodeName
      this.node.instance = this

      // store current attribute value
      this._stroke = node.getAttribute('stroke') || this._stroke
    }
  }

  // Add class methods
, extend: {
    // Move over x-axis
    x: function(x) {
      return this.attr('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      return this.attr('y', y)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2)
    }
    // Move element to given x and y values
  , move: function(x, y) {
      return this.x(x).y(y)
    }
    // Move element by its center
  , center: function(x, y) {
      return this.cx(x).cy(y)
    }
    // Set width of element
  , width: function(width) {
      return this.attr('width', width)
    }
    // Set height of element
  , height: function(height) {
      return this.attr('height', height)
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = proportionalSize(this, width, height)

      return this
        .width(new SVG.Number(p.width))
        .height(new SVG.Number(p.height))
    }
    // Clone element
  , clone: function(parent, withData) {
      // write dom data to the dom so the clone can pickup the data
      this.writeDataToDom()

      // clone element and assign new id
      var clone = assignNewId(this.node.cloneNode(true))

      // insert the clone in the given parent or after myself
      if(parent) parent.add(clone)
      else this.after(clone)

      return clone
    }
    // Remove element
  , remove: function() {
      if (this.parent())
        this.parent().removeElement(this)

      return this
    }
    // Replace element
  , replace: function(element) {
      this.after(element).remove()

      return element
    }
    // Add element to given container and return self
  , addTo: function(parent) {
      return parent.put(this)
    }
    // Add element to given container and return container
  , putIn: function(parent) {
      return parent.add(this)
    }
    // Get / set id
  , id: function(id) {
      return this.attr('id', id)
    }
    // Checks whether the given point inside the bounding box of the element
  , inside: function(x, y) {
      var box = this.bbox()

      return x > box.x
          && y > box.y
          && x < box.x + box.width
          && y < box.y + box.height
    }
    // Show element
  , show: function() {
      return this.style('display', '')
    }
    // Hide element
  , hide: function() {
      return this.style('display', 'none')
    }
    // Is element visible?
  , visible: function() {
      return this.style('display') != 'none'
    }
    // Return id on string conversion
  , toString: function() {
      return this.attr('id')
    }
    // Return array of classes on the node
  , classes: function() {
      var attr = this.attr('class')

      return attr == null ? [] : attr.trim().split(SVG.regex.delimiter)
    }
    // Return true if class exists on the node, false otherwise
  , hasClass: function(name) {
      return this.classes().indexOf(name) != -1
    }
    // Add class to the node
  , addClass: function(name) {
      if (!this.hasClass(name)) {
        var array = this.classes()
        array.push(name)
        this.attr('class', array.join(' '))
      }

      return this
    }
    // Remove class from the node
  , removeClass: function(name) {
      if (this.hasClass(name)) {
        this.attr('class', this.classes().filter(function(c) {
          return c != name
        }).join(' '))
      }

      return this
    }
    // Toggle the presence of a class on the node
  , toggleClass: function(name) {
      return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
    }
    // Get referenced element form attribute value
  , reference: function(attr) {
      return SVG.get(this.attr(attr))
    }
    // Returns the parent element instance
  , parent: function(type) {
      var parent = this

      // check for parent
      if(!parent.node.parentNode) return null

      // get parent element
      parent = SVG.adopt(parent.node.parentNode)

      if(!type) return parent

      // loop trough ancestors if type is given
      while(parent && parent.node instanceof window.SVGElement){
        if(typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent
        if(parent.node.parentNode.nodeName == '#document') return null // #720
        parent = SVG.adopt(parent.node.parentNode)
      }
    }
    // Get parent document
  , doc: function() {
      return this instanceof SVG.Doc ? this : this.parent(SVG.Doc)
    }
    // return array of all ancestors of given type up to the root svg
  , parents: function(type) {
      var parents = [], parent = this

      do{
        parent = parent.parent(type)
        if(!parent || !parent.node) break

        parents.push(parent)
      } while(parent.parent)

      return parents
    }
    // matches the element vs a css selector
  , matches: function(selector){
      return matches(this.node, selector)
    }
    // Returns the svg node to call native svg methods on it
  , native: function() {
      return this.node
    }
    // Import raw svg
  , svg: function(svg) {
      // create temporary holder
      var well = document.createElement('svg')

      // act as a setter if svg is given
      if (svg && this instanceof SVG.Parent) {
        // dump raw svg
        well.innerHTML = '<svg>' + svg.replace(/\n/, '').replace(/<(\w+)([^<]+?)\/>/g, '<$1$2></$1>') + '</svg>'

        // transplant nodes
        for (var i = 0, il = well.firstChild.childNodes.length; i < il; i++)
          this.node.appendChild(well.firstChild.firstChild)

      // otherwise act as a getter
      } else {
        // create a wrapping svg element in case of partial content
        well.appendChild(svg = document.createElement('svg'))

        // write svgjs data to the dom
        this.writeDataToDom()

        // insert a copy of this node
        svg.appendChild(this.node.cloneNode(true))

        // return target element
        return well.innerHTML.replace(/^<svg>/, '').replace(/<\/svg>$/, '')
      }

      return this
    }
  // write svgjs data to the dom
  , writeDataToDom: function() {

      // dump variables recursively
      if(this.each || this.lines){
        var fn = this.each ? this : this.lines();
        fn.each(function(){
          this.writeDataToDom()
        })
      }

      // remove previously set data
      this.node.removeAttribute('svgjs:data')

      if(Object.keys(this.dom).length)
        this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)) // see #428

      return this
    }
  // set given data to the elements data property
  , setData: function(o){
      this.dom = o
      return this
    }
  , is: function(obj){
      return is(this, obj)
    }
  }
})

SVG.easing = {
  '-': function(pos){return pos}
, '<>':function(pos){return -Math.cos(pos * Math.PI) / 2 + 0.5}
, '>': function(pos){return  Math.sin(pos * Math.PI / 2)}
, '<': function(pos){return -Math.cos(pos * Math.PI / 2) + 1}
}

SVG.morph = function(pos){
  return function(from, to) {
    return new SVG.MorphObj(from, to).at(pos)
  }
}

SVG.Situation = SVG.invent({

  create: function(o){
    this.init = false
    this.reversed = false
    this.reversing = false

    this.duration = new SVG.Number(o.duration).valueOf()
    this.delay = new SVG.Number(o.delay).valueOf()

    this.start = +new Date() + this.delay
    this.finish = this.start + this.duration
    this.ease = o.ease

    // this.loop is incremented from 0 to this.loops
    // it is also incremented when in an infinite loop (when this.loops is true)
    this.loop = 0
    this.loops = false

    this.animations = {
      // functionToCall: [list of morphable objects]
      // e.g. move: [SVG.Number, SVG.Number]
    }

    this.attrs = {
      // holds all attributes which are not represented from a function svg.js provides
      // e.g. someAttr: SVG.Number
    }

    this.styles = {
      // holds all styles which should be animated
      // e.g. fill-color: SVG.Color
    }

    this.transforms = [
      // holds all transformations as transformation objects
      // e.g. [SVG.Rotate, SVG.Translate, SVG.Matrix]
    ]

    this.once = {
      // functions to fire at a specific position
      // e.g. "0.5": function foo(){}
    }

  }

})


SVG.FX = SVG.invent({

  create: function(element) {
    this._target = element
    this.situations = []
    this.active = false
    this.situation = null
    this.paused = false
    this.lastPos = 0
    this.pos = 0
    // The absolute position of an animation is its position in the context of its complete duration (including delay and loops)
    // When performing a delay, absPos is below 0 and when performing a loop, its value is above 1
    this.absPos = 0
    this._speed = 1
  }

, extend: {

    /**
     * sets or returns the target of this animation
     * @param o object || number In case of Object it holds all parameters. In case of number its the duration of the animation
     * @param ease function || string Function which should be used for easing or easing keyword
     * @param delay Number indicating the delay before the animation starts
     * @return target || this
     */
    animate: function(o, ease, delay){

      if(typeof o == 'object'){
        ease = o.ease
        delay = o.delay
        o = o.duration
      }

      var situation = new SVG.Situation({
        duration: o || 1000,
        delay: delay || 0,
        ease: SVG.easing[ease || '-'] || ease
      })

      this.queue(situation)

      return this
    }

    /**
     * sets a delay before the next element of the queue is called
     * @param delay Duration of delay in milliseconds
     * @return this.target()
     */
  , delay: function(delay){
      // The delay is performed by an empty situation with its duration
      // attribute set to the duration of the delay
      var situation = new SVG.Situation({
        duration: delay,
        delay: 0,
        ease: SVG.easing['-']
      })

      return this.queue(situation)
    }

    /**
     * sets or returns the target of this animation
     * @param null || target SVG.Element which should be set as new target
     * @return target || this
     */
  , target: function(target){
      if(target && target instanceof SVG.Element){
        this._target = target
        return this
      }

      return this._target
    }

    // returns the absolute position at a given time
  , timeToAbsPos: function(timestamp){
      return (timestamp - this.situation.start) / (this.situation.duration/this._speed)
    }

    // returns the timestamp from a given absolute positon
  , absPosToTime: function(absPos){
      return this.situation.duration/this._speed * absPos + this.situation.start
    }

    // starts the animationloop
  , startAnimFrame: function(){
      this.stopAnimFrame()
      this.animationFrame = window.requestAnimationFrame(function(){ this.step() }.bind(this))
    }

    // cancels the animationframe
  , stopAnimFrame: function(){
      window.cancelAnimationFrame(this.animationFrame)
    }

    // kicks off the animation - only does something when the queue is currently not active and at least one situation is set
  , start: function(){
      // dont start if already started
      if(!this.active && this.situation){
        this.active = true
        this.startCurrent()
      }

      return this
    }

    // start the current situation
  , startCurrent: function(){
      this.situation.start = +new Date + this.situation.delay/this._speed
      this.situation.finish = this.situation.start + this.situation.duration/this._speed
      return this.initAnimations().step()
    }

    /**
     * adds a function / Situation to the animation queue
     * @param fn function / situation to add
     * @return this
     */
  , queue: function(fn){
      if(typeof fn == 'function' || fn instanceof SVG.Situation)
        this.situations.push(fn)

      if(!this.situation) this.situation = this.situations.shift()

      return this
    }

    /**
     * pulls next element from the queue and execute it
     * @return this
     */
  , dequeue: function(){
      // stop current animation
      this.stop()

      // get next animation from queue
      this.situation = this.situations.shift()

      if(this.situation){
        if(this.situation instanceof SVG.Situation) {
          this.start()
        } else {
          // If it is not a SVG.Situation, then it is a function, we execute it
          this.situation.call(this)
        }
      }

      return this
    }

    // updates all animations to the current state of the element
    // this is important when one property could be changed from another property
  , initAnimations: function() {
      var i, j, source
      var s = this.situation

      if(s.init) return this

      for(i in s.animations){
        source = this.target()[i]()

        if(!Array.isArray(source)) {
          source = [source]
        }

        if(!Array.isArray(s.animations[i])) {
          s.animations[i] = [s.animations[i]]
        }

        //if(s.animations[i].length > source.length) {
        //  source.concat = source.concat(s.animations[i].slice(source.length, s.animations[i].length))
        //}

        for(j = source.length; j--;) {
          // The condition is because some methods return a normal number instead
          // of a SVG.Number
          if(s.animations[i][j] instanceof SVG.Number)
            source[j] = new SVG.Number(source[j])

          s.animations[i][j] = source[j].morph(s.animations[i][j])
        }
      }

      for(i in s.attrs){
        s.attrs[i] = new SVG.MorphObj(this.target().attr(i), s.attrs[i])
      }

      for(i in s.styles){
        s.styles[i] = new SVG.MorphObj(this.target().style(i), s.styles[i])
      }

      s.initialTransformation = this.target().matrixify()

      s.init = true
      return this
    }
  , clearQueue: function(){
      this.situations = []
      return this
    }
  , clearCurrent: function(){
      this.situation = null
      return this
    }
    /** stops the animation immediately
     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately.
     * @param clearQueue A Boolean indicating whether to remove queued animation as well.
     * @return this
     */
  , stop: function(jumpToEnd, clearQueue){
      var active = this.active
      this.active = false

      if(clearQueue){
        this.clearQueue()
      }

      if(jumpToEnd && this.situation){
        // initialize the situation if it was not
        !active && this.startCurrent()
        this.atEnd()
      }

      this.stopAnimFrame()

      return this.clearCurrent()
    }

    /** resets the element to the state where the current element has started
     * @return this
     */
  , reset: function(){
      if(this.situation){
        var temp = this.situation
        this.stop()
        this.situation = temp
        this.atStart()
      }
      return this
    }

    // Stop the currently-running animation, remove all queued animations, and complete all animations for the element.
  , finish: function(){

      this.stop(true, false)

      while(this.dequeue().situation && this.stop(true, false));

      this.clearQueue().clearCurrent()

      return this
    }

    // set the internal animation pointer at the start position, before any loops, and updates the visualisation
  , atStart: function() {
      return this.at(0, true)
    }

    // set the internal animation pointer at the end position, after all the loops, and updates the visualisation
  , atEnd: function() {
      if (this.situation.loops === true) {
        // If in a infinite loop, we end the current iteration
        this.situation.loops = this.situation.loop + 1
      }

      if(typeof this.situation.loops == 'number') {
        // If performing a finite number of loops, we go after all the loops
        return this.at(this.situation.loops, true)
      } else {
        // If no loops, we just go at the end
        return this.at(1, true)
      }
    }

    // set the internal animation pointer to the specified position and updates the visualisation
    // if isAbsPos is true, pos is treated as an absolute position
  , at: function(pos, isAbsPos){
      var durDivSpd = this.situation.duration/this._speed

      this.absPos = pos
      // If pos is not an absolute position, we convert it into one
      if (!isAbsPos) {
        if (this.situation.reversed) this.absPos = 1 - this.absPos
        this.absPos += this.situation.loop
      }

      this.situation.start = +new Date - this.absPos * durDivSpd
      this.situation.finish = this.situation.start + durDivSpd

      return this.step(true)
    }

    /**
     * sets or returns the speed of the animations
     * @param speed null || Number The new speed of the animations
     * @return Number || this
     */
  , speed: function(speed){
      if (speed === 0) return this.pause()

      if (speed) {
        this._speed = speed
        // We use an absolute position here so that speed can affect the delay before the animation
        return this.at(this.absPos, true)
      } else return this._speed
    }

    // Make loopable
  , loop: function(times, reverse) {
      var c = this.last()

      // store total loops
      c.loops = (times != null) ? times : true
      c.loop = 0

      if(reverse) c.reversing = true
      return this
    }

    // pauses the animation
  , pause: function(){
      this.paused = true
      this.stopAnimFrame()

      return this
    }

    // unpause the animation
  , play: function(){
      if(!this.paused) return this
      this.paused = false
      // We use an absolute position here so that the delay before the animation can be paused
      return this.at(this.absPos, true)
    }

    /**
     * toggle or set the direction of the animation
     * true sets direction to backwards while false sets it to forwards
     * @param reversed Boolean indicating whether to reverse the animation or not (default: toggle the reverse status)
     * @return this
     */
  , reverse: function(reversed){
      var c = this.last()

      if(typeof reversed == 'undefined') c.reversed = !c.reversed
      else c.reversed = reversed

      return this
    }


    /**
     * returns a float from 0-1 indicating the progress of the current animation
     * @param eased Boolean indicating whether the returned position should be eased or not
     * @return number
     */
  , progress: function(easeIt){
      return easeIt ? this.situation.ease(this.pos) : this.pos
    }

    /**
     * adds a callback function which is called when the current animation is finished
     * @param fn Function which should be executed as callback
     * @return number
     */
  , after: function(fn){
      var c = this.last()
        , wrapper = function wrapper(e){
            if(e.detail.situation == c){
              fn.call(this, c)
              this.off('finished.fx', wrapper) // prevent memory leak
            }
          }

      this.target().on('finished.fx', wrapper)

      return this._callStart()
    }

    // adds a callback which is called whenever one animation step is performed
  , during: function(fn){
      var c = this.last()
        , wrapper = function(e){
            if(e.detail.situation == c){
              fn.call(this, e.detail.pos, SVG.morph(e.detail.pos), e.detail.eased, c)
            }
          }

      // see above
      this.target().off('during.fx', wrapper).on('during.fx', wrapper)

      this.after(function(){
        this.off('during.fx', wrapper)
      })

      return this._callStart()
    }

    // calls after ALL animations in the queue are finished
  , afterAll: function(fn){
      var wrapper = function wrapper(e){
            fn.call(this)
            this.off('allfinished.fx', wrapper)
          }

      // see above
      this.target().off('allfinished.fx', wrapper).on('allfinished.fx', wrapper)

      return this._callStart()
    }

    // calls on every animation step for all animations
  , duringAll: function(fn){
      var wrapper = function(e){
            fn.call(this, e.detail.pos, SVG.morph(e.detail.pos), e.detail.eased, e.detail.situation)
          }

      this.target().off('during.fx', wrapper).on('during.fx', wrapper)

      this.afterAll(function(){
        this.off('during.fx', wrapper)
      })

      return this._callStart()
    }

  , last: function(){
      return this.situations.length ? this.situations[this.situations.length-1] : this.situation
    }

    // adds one property to the animations
  , add: function(method, args, type){
      this.last()[type || 'animations'][method] = args
      return this._callStart()
    }

    /** perform one step of the animation
     *  @param ignoreTime Boolean indicating whether to ignore time and use position directly or recalculate position based on time
     *  @return this
     */
  , step: function(ignoreTime){

      // convert current time to an absolute position
      if(!ignoreTime) this.absPos = this.timeToAbsPos(+new Date)

      // This part convert an absolute position to a position
      if(this.situation.loops !== false) {
        var absPos, absPosInt, lastLoop

        // If the absolute position is below 0, we just treat it as if it was 0
        absPos = Math.max(this.absPos, 0)
        absPosInt = Math.floor(absPos)

        if(this.situation.loops === true || absPosInt < this.situation.loops) {
          this.pos = absPos - absPosInt
          lastLoop = this.situation.loop
          this.situation.loop = absPosInt
        } else {
          this.absPos = this.situation.loops
          this.pos = 1
          // The -1 here is because we don't want to toggle reversed when all the loops have been completed
          lastLoop = this.situation.loop - 1
          this.situation.loop = this.situation.loops
        }

        if(this.situation.reversing) {
          // Toggle reversed if an odd number of loops as occured since the last call of step
          this.situation.reversed = this.situation.reversed != Boolean((this.situation.loop - lastLoop) % 2)
        }

      } else {
        // If there are no loop, the absolute position must not be above 1
        this.absPos = Math.min(this.absPos, 1)
        this.pos = this.absPos
      }

      // while the absolute position can be below 0, the position must not be below 0
      if(this.pos < 0) this.pos = 0

      if(this.situation.reversed) this.pos = 1 - this.pos


      // apply easing
      var eased = this.situation.ease(this.pos)

      // call once-callbacks
      for(var i in this.situation.once){
        if(i > this.lastPos && i <= eased){
          this.situation.once[i].call(this.target(), this.pos, eased)
          delete this.situation.once[i]
        }
      }

      // fire during callback with position, eased position and current situation as parameter
      if(this.active) this.target().fire('during', {pos: this.pos, eased: eased, fx: this, situation: this.situation})

      // the user may call stop or finish in the during callback
      // so make sure that we still have a valid situation
      if(!this.situation){
        return this
      }

      // apply the actual animation to every property
      this.eachAt()

      // do final code when situation is finished
      if((this.pos == 1 && !this.situation.reversed) || (this.situation.reversed && this.pos == 0)){

        // stop animation callback
        this.stopAnimFrame()

        // fire finished callback with current situation as parameter
        this.target().fire('finished', {fx:this, situation: this.situation})

        if(!this.situations.length){
          this.target().fire('allfinished')

          // Recheck the length since the user may call animate in the afterAll callback
          if(!this.situations.length){
            this.target().off('.fx') // there shouldnt be any binding left, but to make sure...
            this.active = false
          }
        }

        // start next animation
        if(this.active) this.dequeue()
        else this.clearCurrent()

      }else if(!this.paused && this.active){
        // we continue animating when we are not at the end
        this.startAnimFrame()
      }

      // save last eased position for once callback triggering
      this.lastPos = eased
      return this

    }

    // calculates the step for every property and calls block with it
  , eachAt: function(){
      var i, len, at, self = this, target = this.target(), s = this.situation

      // apply animations which can be called trough a method
      for(i in s.animations){

        at = [].concat(s.animations[i]).map(function(el){
          return typeof el !== 'string' && el.at ? el.at(s.ease(self.pos), self.pos) : el
        })

        target[i].apply(target, at)

      }

      // apply animation which has to be applied with attr()
      for(i in s.attrs){

        at = [i].concat(s.attrs[i]).map(function(el){
          return typeof el !== 'string' && el.at ? el.at(s.ease(self.pos), self.pos) : el
        })

        target.attr.apply(target, at)

      }

      // apply animation which has to be applied with style()
      for(i in s.styles){

        at = [i].concat(s.styles[i]).map(function(el){
          return typeof el !== 'string' && el.at ? el.at(s.ease(self.pos), self.pos) : el
        })

        target.style.apply(target, at)

      }

      // animate initialTransformation which has to be chained
      if(s.transforms.length){

        // get initial initialTransformation
        at = s.initialTransformation
        for(i = 0, len = s.transforms.length; i < len; i++){

          // get next transformation in chain
          var a = s.transforms[i]

          // multiply matrix directly
          if(a instanceof SVG.Matrix){

            if(a.relative){
              at = at.multiply(new SVG.Matrix().morph(a).at(s.ease(this.pos)))
            }else{
              at = at.morph(a).at(s.ease(this.pos))
            }
            continue
          }

          // when transformation is absolute we have to reset the needed transformation first
          if(!a.relative)
            a.undo(at.extract())

          // and reapply it after
          at = at.multiply(a.at(s.ease(this.pos)))

        }

        // set new matrix on element
        target.matrix(at)
      }

      return this

    }


    // adds an once-callback which is called at a specific position and never again
  , once: function(pos, fn, isEased){
      var c = this.last()
      if(!isEased) pos = c.ease(pos)

      c.once[pos] = fn

      return this
    }

  , _callStart: function() {
      setTimeout(function(){this.start()}.bind(this), 0)
      return this
    }

  }

, parent: SVG.Element

  // Add method to parent elements
, construct: {
    // Get fx module or create a new one, then animate with given duration and ease
    animate: function(o, ease, delay) {
      return (this.fx || (this.fx = new SVG.FX(this))).animate(o, ease, delay)
    }
  , delay: function(delay){
      return (this.fx || (this.fx = new SVG.FX(this))).delay(delay)
    }
  , stop: function(jumpToEnd, clearQueue) {
      if (this.fx)
        this.fx.stop(jumpToEnd, clearQueue)

      return this
    }
  , finish: function() {
      if (this.fx)
        this.fx.finish()

      return this
    }
    // Pause current animation
  , pause: function() {
      if (this.fx)
        this.fx.pause()

      return this
    }
    // Play paused current animation
  , play: function() {
      if (this.fx)
        this.fx.play()

      return this
    }
    // Set/Get the speed of the animations
  , speed: function(speed) {
      if (this.fx)
        if (speed == null)
          return this.fx.speed()
        else
          this.fx.speed(speed)

      return this
    }
  }

})

// MorphObj is used whenever no morphable object is given
SVG.MorphObj = SVG.invent({

  create: function(from, to){
    // prepare color for morphing
    if(SVG.Color.isColor(to)) return new SVG.Color(from).morph(to)
    // prepare value list for morphing
    if(SVG.regex.delimiter.test(from)) return new SVG.Array(from).morph(to)
    // prepare number for morphing
    if(SVG.regex.numberAndUnit.test(to)) return new SVG.Number(from).morph(to)

    // prepare for plain morphing
    this.value = from
    this.destination = to
  }

, extend: {
    at: function(pos, real){
      return real < 1 ? this.value : this.destination
    },

    valueOf: function(){
      return this.value
    }
  }

})

SVG.extend(SVG.FX, {
  // Add animatable attributes
  attr: function(a, v, relative) {
    // apply attributes individually
    if (typeof a == 'object') {
      for (var key in a)
        this.attr(key, a[key])

    } else {
      this.add(a, v, 'attrs')
    }

    return this
  }
  // Add animatable styles
, style: function(s, v) {
    if (typeof s == 'object')
      for (var key in s)
        this.style(key, s[key])

    else
      this.add(s, v, 'styles')

    return this
  }
  // Animatable x-axis
, x: function(x, relative) {
    if(this.target() instanceof SVG.G){
      this.transform({x:x}, relative)
      return this
    }

    var num = new SVG.Number(x)
    num.relative = relative
    return this.add('x', num)
  }
  // Animatable y-axis
, y: function(y, relative) {
    if(this.target() instanceof SVG.G){
      this.transform({y:y}, relative)
      return this
    }

    var num = new SVG.Number(y)
    num.relative = relative
    return this.add('y', num)
  }
  // Animatable center x-axis
, cx: function(x) {
    return this.add('cx', new SVG.Number(x))
  }
  // Animatable center y-axis
, cy: function(y) {
    return this.add('cy', new SVG.Number(y))
  }
  // Add animatable move
, move: function(x, y) {
    return this.x(x).y(y)
  }
  // Add animatable center
, center: function(x, y) {
    return this.cx(x).cy(y)
  }
  // Add animatable size
, size: function(width, height) {
    if (this.target() instanceof SVG.Text) {
      // animate font size for Text elements
      this.attr('font-size', width)

    } else {
      // animate bbox based size for all other elements
      var box

      if(!width || !height){
        box = this.target().bbox()
      }

      if(!width){
        width = box.width / box.height  * height
      }

      if(!height){
        height = box.height / box.width  * width
      }

      this.add('width' , new SVG.Number(width))
          .add('height', new SVG.Number(height))

    }

    return this
  }
  // Add animatable width
, width: function(width) {
    return this.add('width', new SVG.Number(width))
  }
  // Add animatable height
, height: function(height) {
    return this.add('height', new SVG.Number(height))
  }
  // Add animatable plot
, plot: function(a, b, c, d) {
    // Lines can be plotted with 4 arguments
    if(arguments.length == 4) {
      return this.plot([a, b, c, d])
    }

    return this.add('plot', new (this.target().morphArray)(a))
  }
  // Add leading method
, leading: function(value) {
    return this.target().leading ?
      this.add('leading', new SVG.Number(value)) :
      this
  }
  // Add animatable viewbox
, viewbox: function(x, y, width, height) {
    if (this.target() instanceof SVG.Container) {
      this.add('viewbox', new SVG.ViewBox(x, y, width, height))
    }

    return this
  }
, update: function(o) {
    if (this.target() instanceof SVG.Stop) {
      if (typeof o == 'number' || o instanceof SVG.Number) {
        return this.update({
          offset:  arguments[0]
        , color:   arguments[1]
        , opacity: arguments[2]
        })
      }

      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
      if (o.color   != null) this.attr('stop-color', o.color)
      if (o.offset  != null) this.attr('offset', o.offset)
    }

    return this
  }
})

SVG.Box = SVG.invent({
  create: function(x, y, width, height) {
    if (typeof x == 'object' && !(x instanceof SVG.Element)) {
      // chromes getBoundingClientRect has no x and y property
      return SVG.Box.call(this, x.left != null ? x.left : x.x , x.top != null ? x.top : x.y, x.width, x.height)
    } else if (arguments.length == 4) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    }

    // add center, right, bottom...
    fullBox(this)
  }
, extend: {
    // Merge rect box with another, return a new instance
    merge: function(box) {
      var b = new this.constructor()

      // merge boxes
      b.x      = Math.min(this.x, box.x)
      b.y      = Math.min(this.y, box.y)
      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y

      return fullBox(b)
    }

  , transform: function(m) {
      var xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, p, bbox

      var pts = [
        new SVG.Point(this.x, this.y),
        new SVG.Point(this.x2, this.y),
        new SVG.Point(this.x, this.y2),
        new SVG.Point(this.x2, this.y2)
      ]

      pts.forEach(function(p) {
        p = p.transform(m)
        xMin = Math.min(xMin,p.x)
        xMax = Math.max(xMax,p.x)
        yMin = Math.min(yMin,p.y)
        yMax = Math.max(yMax,p.y)
      })

      bbox = new this.constructor()
      bbox.x = xMin
      bbox.width = xMax-xMin
      bbox.y = yMin
      bbox.height = yMax-yMin

      fullBox(bbox)

      return bbox
    }
  }
})

SVG.BBox = SVG.invent({
  // Initialize
  create: function(element) {
    SVG.Box.apply(this, [].slice.call(arguments))

    // get values if element is given
    if (element instanceof SVG.Element) {
      var box

      // yes this is ugly, but Firefox can be a bitch when it comes to elements that are not yet rendered
      try {

        if (!document.documentElement.contains){
          // This is IE - it does not support contains() for top-level SVGs
          var topParent = element.node
          while (topParent.parentNode){
            topParent = topParent.parentNode
          }
          if (topParent != document) throw new Exception('Element not in the dom')
        } else {
          // the element is NOT in the dom, throw error
          if(!document.documentElement.contains(element.node)) throw new Exception('Element not in the dom')
        }

        // find native bbox
        box = element.node.getBBox()
      } catch(e) {
        if(element instanceof SVG.Shape){
          var clone = element.clone(SVG.parser.draw.instance).show()
          box = clone.node.getBBox()
          clone.remove()
        }else{
          box = {
            x:      element.node.clientLeft
          , y:      element.node.clientTop
          , width:  element.node.clientWidth
          , height: element.node.clientHeight
          }
        }
      }

      SVG.Box.call(this, box)
    }

  }

  // Define ancestor
, inherit: SVG.Box

  // Define Parent
, parent: SVG.Element

  // Constructor
, construct: {
    // Get bounding box
    bbox: function() {
      return new SVG.BBox(this)
    }
  }

})

SVG.BBox.prototype.constructor = SVG.BBox


SVG.extend(SVG.Element, {
  tbox: function(){
    console.warn('Use of TBox is deprecated and mapped to RBox. Use .rbox() instead.')
    return this.rbox(this.doc())
  }
})

SVG.RBox = SVG.invent({
  // Initialize
  create: function(element) {
    SVG.Box.apply(this, [].slice.call(arguments))

    if (element instanceof SVG.Element) {
      SVG.Box.call(this, element.node.getBoundingClientRect())
    }
  }

, inherit: SVG.Box

  // define Parent
, parent: SVG.Element

, extend: {
    addOffset: function() {
      // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
      this.x += window.pageXOffset
      this.y += window.pageYOffset
      return this
    }
  }

  // Constructor
, construct: {
    // Get rect box
    rbox: function(el) {
      if (el) return new SVG.RBox(this).transform(el.screenCTM().inverse())
      return new SVG.RBox(this).addOffset()
    }
  }

})

SVG.RBox.prototype.constructor = SVG.RBox

SVG.Matrix = SVG.invent({
  // Initialize
  create: function(source) {
    var i, base = arrayToMatrix([1, 0, 0, 1, 0, 0])

    // ensure source as object
    source = source instanceof SVG.Element ?
      source.matrixify() :
    typeof source === 'string' ?
      arrayToMatrix(source.split(SVG.regex.delimiter).map(parseFloat)) :
    arguments.length == 6 ?
      arrayToMatrix([].slice.call(arguments)) :
    Array.isArray(source) ?
      arrayToMatrix(source) :
    typeof source === 'object' ?
      source : base

    // merge source
    for (i = abcdef.length - 1; i >= 0; --i)
      this[abcdef[i]] = source[abcdef[i]] != null ?
        source[abcdef[i]] : base[abcdef[i]]
  }

  // Add methods
, extend: {
    // Extract individual transformations
    extract: function() {
      // find delta transform points
      var px    = deltaTransformPoint(this, 0, 1)
        , py    = deltaTransformPoint(this, 1, 0)
        , skewX = 180 / Math.PI * Math.atan2(px.y, px.x) - 90

      return {
        // translation
        x:        this.e
      , y:        this.f
      , transformedX:(this.e * Math.cos(skewX * Math.PI / 180) + this.f * Math.sin(skewX * Math.PI / 180)) / Math.sqrt(this.a * this.a + this.b * this.b)
      , transformedY:(this.f * Math.cos(skewX * Math.PI / 180) + this.e * Math.sin(-skewX * Math.PI / 180)) / Math.sqrt(this.c * this.c + this.d * this.d)
        // skew
      , skewX:    -skewX
      , skewY:    180 / Math.PI * Math.atan2(py.y, py.x)
        // scale
      , scaleX:   Math.sqrt(this.a * this.a + this.b * this.b)
      , scaleY:   Math.sqrt(this.c * this.c + this.d * this.d)
        // rotation
      , rotation: skewX
      , a: this.a
      , b: this.b
      , c: this.c
      , d: this.d
      , e: this.e
      , f: this.f
      , matrix: new SVG.Matrix(this)
      }
    }
    // Clone matrix
  , clone: function() {
      return new SVG.Matrix(this)
    }
    // Morph one matrix into another
  , morph: function(matrix) {
      // store new destination
      this.destination = new SVG.Matrix(matrix)

      return this
    }
    // Get morphed matrix at a given position
  , at: function(pos) {
      // make sure a destination is defined
      if (!this.destination) return this

      // calculate morphed matrix at a given position
      var matrix = new SVG.Matrix({
        a: this.a + (this.destination.a - this.a) * pos
      , b: this.b + (this.destination.b - this.b) * pos
      , c: this.c + (this.destination.c - this.c) * pos
      , d: this.d + (this.destination.d - this.d) * pos
      , e: this.e + (this.destination.e - this.e) * pos
      , f: this.f + (this.destination.f - this.f) * pos
      })

      return matrix
    }
    // Multiplies by given matrix
  , multiply: function(matrix) {
      return new SVG.Matrix(this.native().multiply(parseMatrix(matrix).native()))
    }
    // Inverses matrix
  , inverse: function() {
      return new SVG.Matrix(this.native().inverse())
    }
    // Translate matrix
  , translate: function(x, y) {
      return new SVG.Matrix(this.native().translate(x || 0, y || 0))
    }
    // Scale matrix
  , scale: function(x, y, cx, cy) {
      // support uniformal scale
      if (arguments.length == 1) {
        y = x
      } else if (arguments.length == 3) {
        cy = cx
        cx = y
        y = x
      }

      return this.around(cx, cy, new SVG.Matrix(x, 0, 0, y, 0, 0))
    }
    // Rotate matrix
  , rotate: function(r, cx, cy) {
      // convert degrees to radians
      r = SVG.utils.radians(r)

      return this.around(cx, cy, new SVG.Matrix(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0))
    }
    // Flip matrix on x or y, at a given offset
  , flip: function(a, o) {
      return a == 'x' ?
          this.scale(-1, 1, o, 0) :
        a == 'y' ?
          this.scale(1, -1, 0, o) :
          this.scale(-1, -1, a, o != null ? o : a)
    }
    // Skew
  , skew: function(x, y, cx, cy) {
      // support uniformal skew
      if (arguments.length == 1) {
        y = x
      } else if (arguments.length == 3) {
        cy = cx
        cx = y
        y = x
      }

      // convert degrees to radians
      x = SVG.utils.radians(x)
      y = SVG.utils.radians(y)

      return this.around(cx, cy, new SVG.Matrix(1, Math.tan(y), Math.tan(x), 1, 0, 0))
    }
    // SkewX
  , skewX: function(x, cx, cy) {
      return this.skew(x, 0, cx, cy)
    }
    // SkewY
  , skewY: function(y, cx, cy) {
      return this.skew(0, y, cx, cy)
    }
    // Transform around a center point
  , around: function(cx, cy, matrix) {
      return this
        .multiply(new SVG.Matrix(1, 0, 0, 1, cx || 0, cy || 0))
        .multiply(matrix)
        .multiply(new SVG.Matrix(1, 0, 0, 1, -cx || 0, -cy || 0))
    }
    // Convert to native SVGMatrix
  , native: function() {
      // create new matrix
      var matrix = SVG.parser.native.createSVGMatrix()

      // update with current values
      for (var i = abcdef.length - 1; i >= 0; i--)
        matrix[abcdef[i]] = this[abcdef[i]]

      return matrix
    }
    // Convert matrix to string
  , toString: function() {
      return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
    }
  }

  // Define parent
, parent: SVG.Element

  // Add parent method
, construct: {
    // Get current matrix
    ctm: function() {
      return new SVG.Matrix(this.node.getCTM())
    },
    // Get current screen matrix
    screenCTM: function() {
      /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
         This is needed because FF does not return the transformation matrix
         for the inner coordinate system when getScreenCTM() is called on nested svgs.
         However all other Browsers do that */
      if(this instanceof SVG.Nested) {
        var rect = this.rect(1,1)
        var m = rect.node.getScreenCTM()
        rect.remove()
        return new SVG.Matrix(m)
      }
      return new SVG.Matrix(this.node.getScreenCTM())
    }

  }

})

SVG.Point = SVG.invent({
  // Initialize
  create: function(x,y) {
    var i, source, base = {x:0, y:0}

    // ensure source as object
    source = Array.isArray(x) ?
      {x:x[0], y:x[1]} :
    typeof x === 'object' ?
      {x:x.x, y:x.y} :
    x != null ?
      {x:x, y:(y != null ? y : x)} : base // If y has no value, then x is used has its value

    // merge source
    this.x = source.x
    this.y = source.y
  }

  // Add methods
, extend: {
    // Clone point
    clone: function() {
      return new SVG.Point(this)
    }
    // Morph one point into another
  , morph: function(x, y) {
      // store new destination
      this.destination = new SVG.Point(x, y)

      return this
    }
    // Get morphed point at a given position
  , at: function(pos) {
      // make sure a destination is defined
      if (!this.destination) return this

      // calculate morphed matrix at a given position
      var point = new SVG.Point({
        x: this.x + (this.destination.x - this.x) * pos
      , y: this.y + (this.destination.y - this.y) * pos
      })

      return point
    }
    // Convert to native SVGPoint
  , native: function() {
      // create new point
      var point = SVG.parser.native.createSVGPoint()

      // update with current values
      point.x = this.x
      point.y = this.y

      return point
    }
    // transform point with matrix
  , transform: function(matrix) {
      return new SVG.Point(this.native().matrixTransform(matrix.native()))
    }

  }

})

SVG.extend(SVG.Element, {

  // Get point
  point: function(x, y) {
    return new SVG.Point(x,y).transform(this.screenCTM().inverse());
  }

})

SVG.extend(SVG.Element, {
  // Set svg element attribute
  attr: function(a, v, n) {
    // act as full getter
    if (a == null) {
      // get an object of attributes
      a = {}
      v = this.node.attributes
      for (n = v.length - 1; n >= 0; n--)
        a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue

      return a

    } else if (typeof a == 'object') {
      // apply every attribute individually if an object is passed
      for (v in a) this.attr(v, a[v])

    } else if (v === null) {
        // remove value
        this.node.removeAttribute(a)

    } else if (v == null) {
      // act as a getter if the first and only argument is not an object
      v = this.node.getAttribute(a)
      return v == null ?
        SVG.defaults.attrs[a] :
      SVG.regex.isNumber.test(v) ?
        parseFloat(v) : v

    } else {
      // BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0
      if (a == 'stroke-width')
        this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
      else if (a == 'stroke')
        this._stroke = v

      // convert image fill and stroke to patterns
      if (a == 'fill' || a == 'stroke') {
        if (SVG.regex.isImage.test(v))
          v = this.doc().defs().image(v, 0, 0)

        if (v instanceof SVG.Image)
          v = this.doc().defs().pattern(0, 0, function() {
            this.add(v)
          })
      }

      // ensure correct numeric values (also accepts NaN and Infinity)
      if (typeof v === 'number')
        v = new SVG.Number(v)

      // ensure full hex color
      else if (SVG.Color.isColor(v))
        v = new SVG.Color(v)

      // parse array values
      else if (Array.isArray(v))
        v = new SVG.Array(v)

      // if the passed attribute is leading...
      if (a == 'leading') {
        // ... call the leading method instead
        if (this.leading)
          this.leading(v)
      } else {
        // set given attribute on node
        typeof n === 'string' ?
          this.node.setAttributeNS(n, a, v.toString()) :
          this.node.setAttribute(a, v.toString())
      }

      // rebuild if required
      if (this.rebuild && (a == 'font-size' || a == 'x'))
        this.rebuild(a, v)
    }

    return this
  }
})
SVG.extend(SVG.Element, {
  // Add transformations
  transform: function(o, relative) {
    // get target in case of the fx module, otherwise reference this
    var target = this
      , matrix, bbox

    // act as a getter
    if (typeof o !== 'object') {
      // get current matrix
      matrix = new SVG.Matrix(target).extract()

      return typeof o === 'string' ? matrix[o] : matrix
    }

    // get current matrix
    matrix = new SVG.Matrix(target)

    // ensure relative flag
    relative = !!relative || !!o.relative

    // act on matrix
    if (o.a != null) {
      matrix = relative ?
        // relative
        matrix.multiply(new SVG.Matrix(o)) :
        // absolute
        new SVG.Matrix(o)

    // act on rotation
    } else if (o.rotation != null) {
      // ensure centre point
      ensureCentre(o, target)

      // apply transformation
      matrix = relative ?
        // relative
        matrix.rotate(o.rotation, o.cx, o.cy) :
        // absolute
        matrix.rotate(o.rotation - matrix.extract().rotation, o.cx, o.cy)

    // act on scale
    } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
      // ensure centre point
      ensureCentre(o, target)

      // ensure scale values on both axes
      o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
      o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1

      if (!relative) {
        // absolute; multiply inversed values
        var e = matrix.extract()
        o.scaleX = o.scaleX * 1 / e.scaleX
        o.scaleY = o.scaleY * 1 / e.scaleY
      }

      matrix = matrix.scale(o.scaleX, o.scaleY, o.cx, o.cy)

    // act on skew
    } else if (o.skew != null || o.skewX != null || o.skewY != null) {
      // ensure centre point
      ensureCentre(o, target)

      // ensure skew values on both axes
      o.skewX = o.skew != null ? o.skew : o.skewX != null ? o.skewX : 0
      o.skewY = o.skew != null ? o.skew : o.skewY != null ? o.skewY : 0

      if (!relative) {
        // absolute; reset skew values
        var e = matrix.extract()
        matrix = matrix.multiply(new SVG.Matrix().skew(e.skewX, e.skewY, o.cx, o.cy).inverse())
      }

      matrix = matrix.skew(o.skewX, o.skewY, o.cx, o.cy)

    // act on flip
    } else if (o.flip) {
      if(o.flip == 'x' || o.flip == 'y') {
        o.offset = o.offset == null ? target.bbox()['c' + o.flip] : o.offset
      } else {
        if(o.offset == null) {
          bbox = target.bbox()
          o.flip = bbox.cx
          o.offset = bbox.cy
        } else {
          o.flip = o.offset
        }
      }

      matrix = new SVG.Matrix().flip(o.flip, o.offset)

    // act on translate
    } else if (o.x != null || o.y != null) {
      if (relative) {
        // relative
        matrix = matrix.translate(o.x, o.y)
      } else {
        // absolute
        if (o.x != null) matrix.e = o.x
        if (o.y != null) matrix.f = o.y
      }
    }

    return this.attr('transform', matrix)
  }
})

SVG.extend(SVG.FX, {
  transform: function(o, relative) {
    // get target in case of the fx module, otherwise reference this
    var target = this.target()
      , matrix, bbox

    // act as a getter
    if (typeof o !== 'object') {
      // get current matrix
      matrix = new SVG.Matrix(target).extract()

      return typeof o === 'string' ? matrix[o] : matrix
    }

    // ensure relative flag
    relative = !!relative || !!o.relative

    // act on matrix
    if (o.a != null) {
      matrix = new SVG.Matrix(o)

    // act on rotation
    } else if (o.rotation != null) {
      // ensure centre point
      ensureCentre(o, target)

      // apply transformation
      matrix = new SVG.Rotate(o.rotation, o.cx, o.cy)

    // act on scale
    } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
      // ensure centre point
      ensureCentre(o, target)

      // ensure scale values on both axes
      o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
      o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1

      matrix = new SVG.Scale(o.scaleX, o.scaleY, o.cx, o.cy)

    // act on skew
    } else if (o.skewX != null || o.skewY != null) {
      // ensure centre point
      ensureCentre(o, target)

      // ensure skew values on both axes
      o.skewX = o.skewX != null ? o.skewX : 0
      o.skewY = o.skewY != null ? o.skewY : 0

      matrix = new SVG.Skew(o.skewX, o.skewY, o.cx, o.cy)

    // act on flip
    } else if (o.flip) {
      if(o.flip == 'x' || o.flip == 'y') {
        o.offset = o.offset == null ? target.bbox()['c' + o.flip] : o.offset
      } else {
        if(o.offset == null) {
          bbox = target.bbox()
          o.flip = bbox.cx
          o.offset = bbox.cy
        } else {
          o.flip = o.offset
        }
      }

      matrix = new SVG.Matrix().flip(o.flip, o.offset)

    // act on translate
    } else if (o.x != null || o.y != null) {
      matrix = new SVG.Translate(o.x, o.y)
    }

    if(!matrix) return this

    matrix.relative = relative

    this.last().transforms.push(matrix)

    return this._callStart()
  }
})

SVG.extend(SVG.Element, {
  // Reset all transformations
  untransform: function() {
    return this.attr('transform', null)
  },
  // merge the whole transformation chain into one matrix and returns it
  matrixify: function() {

    var matrix = (this.attr('transform') || '')
      // split transformations
      .split(SVG.regex.transforms).slice(0,-1).map(function(str){
        // generate key => value pairs
        var kv = str.trim().split('(')
        return [kv[0], kv[1].split(SVG.regex.delimiter).map(function(str){ return parseFloat(str) })]
      })
      // merge every transformation into one matrix
      .reduce(function(matrix, transform){

        if(transform[0] == 'matrix') return matrix.multiply(arrayToMatrix(transform[1]))
        return matrix[transform[0]].apply(matrix, transform[1])

      }, new SVG.Matrix())

    return matrix
  },
  // add an element to another parent without changing the visual representation on the screen
  toParent: function(parent) {
    if(this == parent) return this
    var ctm = this.screenCTM()
    var pCtm = parent.screenCTM().inverse()

    this.addTo(parent).untransform().transform(pCtm.multiply(ctm))

    return this
  },
  // same as above with parent equals root-svg
  toDoc: function() {
    return this.toParent(this.doc())
  }

})

SVG.Transformation = SVG.invent({

  create: function(source, inversed){

    if(arguments.length > 1 && typeof inversed != 'boolean'){
      return this.constructor.call(this, [].slice.call(arguments))
    }

    if(Array.isArray(source)){
      for(var i = 0, len = this.arguments.length; i < len; ++i){
        this[this.arguments[i]] = source[i]
      }
    } else if(typeof source == 'object'){
      for(var i = 0, len = this.arguments.length; i < len; ++i){
        this[this.arguments[i]] = source[this.arguments[i]]
      }
    }

    this.inversed = false

    if(inversed === true){
      this.inversed = true
    }

  }

, extend: {

    arguments: []
  , method: ''

  , at: function(pos){

      var params = []

      for(var i = 0, len = this.arguments.length; i < len; ++i){
        params.push(this[this.arguments[i]])
      }

      var m = this._undo || new SVG.Matrix()

      m = new SVG.Matrix().morph(SVG.Matrix.prototype[this.method].apply(m, params)).at(pos)

      return this.inversed ? m.inverse() : m

    }

  , undo: function(o){
      for(var i = 0, len = this.arguments.length; i < len; ++i){
        o[this.arguments[i]] = typeof this[this.arguments[i]] == 'undefined' ? 0 : o[this.arguments[i]]
      }

      // The method SVG.Matrix.extract which was used before calling this
      // method to obtain a value for the parameter o doesn't return a cx and
      // a cy so we use the ones that were provided to this object at its creation
      o.cx = this.cx
      o.cy = this.cy

      this._undo = new SVG[capitalize(this.method)](o, true).at(1)

      return this
    }

  }

})

SVG.Translate = SVG.invent({

  parent: SVG.Matrix
, inherit: SVG.Transformation

, create: function(source, inversed){
    this.constructor.apply(this, [].slice.call(arguments))
  }

, extend: {
    arguments: ['transformedX', 'transformedY']
  , method: 'translate'
  }

})

SVG.Rotate = SVG.invent({

  parent: SVG.Matrix
, inherit: SVG.Transformation

, create: function(source, inversed){
    this.constructor.apply(this, [].slice.call(arguments))
  }

, extend: {
    arguments: ['rotation', 'cx', 'cy']
  , method: 'rotate'
  , at: function(pos){
      var m = new SVG.Matrix().rotate(new SVG.Number().morph(this.rotation - (this._undo ? this._undo.rotation : 0)).at(pos), this.cx, this.cy)
      return this.inversed ? m.inverse() : m
    }
  , undo: function(o){
      this._undo = o
      return this
    }
  }

})

SVG.Scale = SVG.invent({

  parent: SVG.Matrix
, inherit: SVG.Transformation

, create: function(source, inversed){
    this.constructor.apply(this, [].slice.call(arguments))
  }

, extend: {
    arguments: ['scaleX', 'scaleY', 'cx', 'cy']
  , method: 'scale'
  }

})

SVG.Skew = SVG.invent({

  parent: SVG.Matrix
, inherit: SVG.Transformation

, create: function(source, inversed){
    this.constructor.apply(this, [].slice.call(arguments))
  }

, extend: {
    arguments: ['skewX', 'skewY', 'cx', 'cy']
  , method: 'skew'
  }

})

SVG.extend(SVG.Element, {
  // Dynamic style generator
  style: function(s, v) {
    if (arguments.length == 0) {
      // get full style
      return this.node.style.cssText || ''

    } else if (arguments.length < 2) {
      // apply every style individually if an object is passed
      if (typeof s == 'object') {
        for (v in s) this.style(v, s[v])

      } else if (SVG.regex.isCss.test(s)) {
        // parse css string
        s = s.split(/\s*;\s*/)
          // filter out suffix ; and stuff like ;;
          .filter(function(e) { return !!e })
          .map(function(e){ return e.split(/\s*:\s*/) })

        // apply every definition individually
        while (v = s.pop()) {
          this.style(v[0], v[1])
        }
      } else {
        // act as a getter if the first and only argument is not an object
        return this.node.style[camelCase(s)]
      }

    } else {
      this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? '' : v
    }

    return this
  }
})
SVG.Parent = SVG.invent({
  // Initialize node
  create: function(element) {
    this.constructor.call(this, element)
  }

  // Inherit from
, inherit: SVG.Element

  // Add class methods
, extend: {
    // Returns all child elements
    children: function() {
      return SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes), function(node) {
        return SVG.adopt(node)
      })
    }
    // Add given element at a position
  , add: function(element, i) {
      if (i == null)
        this.node.appendChild(element.node)
      else if (element.node != this.node.childNodes[i])
        this.node.insertBefore(element.node, this.node.childNodes[i])

      return this
    }
    // Basically does the same as `add()` but returns the added element instead
  , put: function(element, i) {
      this.add(element, i)
      return element
    }
    // Checks if the given element is a child
  , has: function(element) {
      return this.index(element) >= 0
    }
    // Gets index of given element
  , index: function(element) {
      return [].slice.call(this.node.childNodes).indexOf(element.node)
    }
    // Get a element at the given index
  , get: function(i) {
      return SVG.adopt(this.node.childNodes[i])
    }
    // Get first child
  , first: function() {
      return this.get(0)
    }
    // Get the last child
  , last: function() {
      return this.get(this.node.childNodes.length - 1)
    }
    // Iterates over all children and invokes a given block
  , each: function(block, deep) {
      var i, il
        , children = this.children()

      for (i = 0, il = children.length; i < il; i++) {
        if (children[i] instanceof SVG.Element)
          block.apply(children[i], [i, children])

        if (deep && (children[i] instanceof SVG.Container))
          children[i].each(block, deep)
      }

      return this
    }
    // Remove a given child
  , removeElement: function(element) {
      this.node.removeChild(element.node)

      return this
    }
    // Remove all elements in this container
  , clear: function() {
      // remove children
      while(this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild)

      // remove defs reference
      delete this._defs

      return this
    }
  , // Get defs
    defs: function() {
      return this.doc().defs()
    }
  }

})

SVG.extend(SVG.Parent, {

  ungroup: function(parent, depth) {
    if(depth === 0 || this instanceof SVG.Defs || this.node == SVG.parser.draw) return this

    parent = parent || (this instanceof SVG.Doc ? this : this.parent(SVG.Parent))
    depth = depth || Infinity

    this.each(function(){
      if(this instanceof SVG.Defs) return this
      if(this instanceof SVG.Parent) return this.ungroup(parent, depth-1)
      return this.toParent(parent)
    })

    this.node.firstChild || this.remove()

    return this
  },

  flatten: function(parent, depth) {
    return this.ungroup(parent, depth)
  }

})
SVG.Container = SVG.invent({
  // Initialize node
  create: function(element) {
    this.constructor.call(this, element)
  }

  // Inherit from
, inherit: SVG.Parent

})

SVG.ViewBox = SVG.invent({

  create: function(source) {
    var i, base = [0, 0, 0, 0]

    var x, y, width, height, box, view, we, he
      , wm   = 1 // width multiplier
      , hm   = 1 // height multiplier
      , reg  = /[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi

    if(source instanceof SVG.Element){

      we = source
      he = source
      view = (source.attr('viewBox') || '').match(reg)
      box = source.bbox

      // get dimensions of current node
      width  = new SVG.Number(source.width())
      height = new SVG.Number(source.height())

      // find nearest non-percentual dimensions
      while (width.unit == '%') {
        wm *= width.value
        width = new SVG.Number(we instanceof SVG.Doc ? we.parent().offsetWidth : we.parent().width())
        we = we.parent()
      }
      while (height.unit == '%') {
        hm *= height.value
        height = new SVG.Number(he instanceof SVG.Doc ? he.parent().offsetHeight : he.parent().height())
        he = he.parent()
      }

      // ensure defaults
      this.x      = 0
      this.y      = 0
      this.width  = width  * wm
      this.height = height * hm
      this.zoom   = 1

      if (view) {
        // get width and height from viewbox
        x      = parseFloat(view[0])
        y      = parseFloat(view[1])
        width  = parseFloat(view[2])
        height = parseFloat(view[3])

        // calculate zoom accoring to viewbox
        this.zoom = ((this.width / this.height) > (width / height)) ?
          this.height / height :
          this.width  / width

        // calculate real pixel dimensions on parent SVG.Doc element
        this.x      = x
        this.y      = y
        this.width  = width
        this.height = height

      }

    }else{

      // ensure source as object
      source = typeof source === 'string' ?
        source.match(reg).map(function(el){ return parseFloat(el) }) :
      Array.isArray(source) ?
        source :
      typeof source == 'object' ?
        [source.x, source.y, source.width, source.height] :
      arguments.length == 4 ?
        [].slice.call(arguments) :
        base

      this.x = source[0]
      this.y = source[1]
      this.width = source[2]
      this.height = source[3]
    }


  }

, extend: {

    toString: function() {
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
    }
  , morph: function(x, y, width, height){
      this.destination = new SVG.ViewBox(x, y, width, height)
      return this
    }

  , at: function(pos) {

      if(!this.destination) return this

      return new SVG.ViewBox([
          this.x + (this.destination.x - this.x) * pos
        , this.y + (this.destination.y - this.y) * pos
        , this.width + (this.destination.width - this.width) * pos
        , this.height + (this.destination.height - this.height) * pos
      ])

    }

  }

  // Define parent
, parent: SVG.Container

  // Add parent method
, construct: {

    // get/set viewbox
    viewbox: function(x, y, width, height) {
      if (arguments.length == 0)
        // act as a getter if there are no arguments
        return new SVG.ViewBox(this)

      // otherwise act as a setter
      return this.attr('viewBox', new SVG.ViewBox(x, y, width, height))
    }

  }

})
// Add events to elements
;[  'click'
  , 'dblclick'
  , 'mousedown'
  , 'mouseup'
  , 'mouseover'
  , 'mouseout'
  , 'mousemove'
  // , 'mouseenter' -> not supported by IE
  // , 'mouseleave' -> not supported by IE
  , 'touchstart'
  , 'touchmove'
  , 'touchleave'
  , 'touchend'
  , 'touchcancel' ].forEach(function(event) {

  // add event to SVG.Element
  SVG.Element.prototype[event] = function(f) {
    // bind event to element rather than element node
    SVG.on(this.node, event, f)
    return this
  }
})

// Initialize listeners stack
SVG.listeners = []
SVG.handlerMap = []
SVG.listenerId = 0

// Add event binder in the SVG namespace
SVG.on = function(node, event, listener, binding, options) {
  // create listener, get object-index
  var l     = listener.bind(binding || node.instance || node)
    , index = (SVG.handlerMap.indexOf(node) + 1 || SVG.handlerMap.push(node)) - 1
    , ev    = event.split('.')[0]
    , ns    = event.split('.')[1] || '*'


  // ensure valid object
  SVG.listeners[index]         = SVG.listeners[index]         || {}
  SVG.listeners[index][ev]     = SVG.listeners[index][ev]     || {}
  SVG.listeners[index][ev][ns] = SVG.listeners[index][ev][ns] || {}

  if(!listener._svgjsListenerId)
    listener._svgjsListenerId = ++SVG.listenerId

  // reference listener
  SVG.listeners[index][ev][ns][listener._svgjsListenerId] = l

  // add listener
  node.addEventListener(ev, l, options || false)
}

// Add event unbinder in the SVG namespace
SVG.off = function(node, event, listener) {
  var index = SVG.handlerMap.indexOf(node)
    , ev    = event && event.split('.')[0]
    , ns    = event && event.split('.')[1]
    , namespace = ''

  if(index == -1) return

  if (listener) {
    if(typeof listener == 'function') listener = listener._svgjsListenerId
    if(!listener) return

    // remove listener reference
    if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns || '*']) {
      // remove listener
      node.removeEventListener(ev, SVG.listeners[index][ev][ns || '*'][listener], false)

      delete SVG.listeners[index][ev][ns || '*'][listener]
    }

  } else if (ns && ev) {
    // remove all listeners for a namespaced event
    if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns]) {
      for (listener in SVG.listeners[index][ev][ns])
        SVG.off(node, [ev, ns].join('.'), listener)

      delete SVG.listeners[index][ev][ns]
    }

  } else if (ns){
    // remove all listeners for a specific namespace
    for(event in SVG.listeners[index]){
        for(namespace in SVG.listeners[index][event]){
            if(ns === namespace){
                SVG.off(node, [event, ns].join('.'))
            }
        }
    }

  } else if (ev) {
    // remove all listeners for the event
    if (SVG.listeners[index][ev]) {
      for (namespace in SVG.listeners[index][ev])
        SVG.off(node, [ev, namespace].join('.'))

      delete SVG.listeners[index][ev]
    }

  } else {
    // remove all listeners on a given node
    for (event in SVG.listeners[index])
      SVG.off(node, event)

    delete SVG.listeners[index]
    delete SVG.handlerMap[index]

  }
}

//
SVG.extend(SVG.Element, {
  // Bind given event to listener
  on: function(event, listener, binding, options) {
    SVG.on(this.node, event, listener, binding, options)

    return this
  }
  // Unbind event from listener
, off: function(event, listener) {
    SVG.off(this.node, event, listener)

    return this
  }
  // Fire given event
, fire: function(event, data) {

    // Dispatch event
    if(event instanceof window.Event){
        this.node.dispatchEvent(event)
    }else{
        this.node.dispatchEvent(event = new window.CustomEvent(event, {detail:data, cancelable: true}))
    }

    this._event = event
    return this
  }
, event: function() {
    return this._event
  }
})


SVG.Defs = SVG.invent({
  // Initialize node
  create: 'defs'

  // Inherit from
, inherit: SVG.Container

})
SVG.G = SVG.invent({
  // Initialize node
  create: 'g'

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Move over x-axis
    x: function(x) {
      return x == null ? this.transform('x') : this.transform({ x: x - this.x() }, true)
    }
    // Move over y-axis
  , y: function(y) {
      return y == null ? this.transform('y') : this.transform({ y: y - this.y() }, true)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.gbox().cx : this.x(x - this.gbox().width / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.gbox().cy : this.y(y - this.gbox().height / 2)
    }
  , gbox: function() {

      var bbox  = this.bbox()
        , trans = this.transform()

      bbox.x  += trans.x
      bbox.x2 += trans.x
      bbox.cx += trans.x

      bbox.y  += trans.y
      bbox.y2 += trans.y
      bbox.cy += trans.y

      return bbox
    }
  }

  // Add parent method
, construct: {
    // Create a group element
    group: function() {
      return this.put(new SVG.G)
    }
  }
})

// ### This module adds backward / forward functionality to elements.

//
SVG.extend(SVG.Element, {
  // Get all siblings, including myself
  siblings: function() {
    return this.parent().children()
  }
  // Get the curent position siblings
, position: function() {
    return this.parent().index(this)
  }
  // Get the next element (will return null if there is none)
, next: function() {
    return this.siblings()[this.position() + 1]
  }
  // Get the next element (will return null if there is none)
, previous: function() {
    return this.siblings()[this.position() - 1]
  }
  // Send given element one step forward
, forward: function() {
    var i = this.position() + 1
      , p = this.parent()

    // move node one step forward
    p.removeElement(this).add(this, i)

    // make sure defs node is always at the top
    if (p instanceof SVG.Doc)
      p.node.appendChild(p.defs().node)

    return this
  }
  // Send given element one step backward
, backward: function() {
    var i = this.position()

    if (i > 0)
      this.parent().removeElement(this).add(this, i - 1)

    return this
  }
  // Send given element all the way to the front
, front: function() {
    var p = this.parent()

    // Move node forward
    p.node.appendChild(this.node)

    // Make sure defs node is always at the top
    if (p instanceof SVG.Doc)
      p.node.appendChild(p.defs().node)

    return this
  }
  // Send given element all the way to the back
, back: function() {
    if (this.position() > 0)
      this.parent().removeElement(this).add(this, 0)

    return this
  }
  // Inserts a given element before the targeted element
, before: function(element) {
    element.remove()

    var i = this.position()

    this.parent().add(element, i)

    return this
  }
  // Insters a given element after the targeted element
, after: function(element) {
    element.remove()

    var i = this.position()

    this.parent().add(element, i + 1)

    return this
  }

})
SVG.Mask = SVG.invent({
  // Initialize node
  create: function() {
    this.constructor.call(this, SVG.create('mask'))

    // keep references to masked elements
    this.targets = []
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Unmask all masked elements and remove itself
    remove: function() {
      // unmask all targets
      for (var i = this.targets.length - 1; i >= 0; i--)
        if (this.targets[i])
          this.targets[i].unmask()
      this.targets = []

      // remove mask from parent
      this.parent().removeElement(this)

      return this
    }
  }

  // Add parent method
, construct: {
    // Create masking element
    mask: function() {
      return this.defs().put(new SVG.Mask)
    }
  }
})


SVG.extend(SVG.Element, {
  // Distribute mask to svg element
  maskWith: function(element) {
    // use given mask or create a new one
    this.masker = element instanceof SVG.Mask ? element : this.parent().mask().add(element)

    // store reverence on self in mask
    this.masker.targets.push(this)

    // apply mask
    return this.attr('mask', 'url("#' + this.masker.attr('id') + '")')
  }
  // Unmask element
, unmask: function() {
    delete this.masker
    return this.attr('mask', null)
  }

})

SVG.ClipPath = SVG.invent({
  // Initialize node
  create: function() {
    this.constructor.call(this, SVG.create('clipPath'))

    // keep references to clipped elements
    this.targets = []
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Unclip all clipped elements and remove itself
    remove: function() {
      // unclip all targets
      for (var i = this.targets.length - 1; i >= 0; i--)
        if (this.targets[i])
          this.targets[i].unclip()
      this.targets = []

      // remove clipPath from parent
      this.parent().removeElement(this)

      return this
    }
  }

  // Add parent method
, construct: {
    // Create clipping element
    clip: function() {
      return this.defs().put(new SVG.ClipPath)
    }
  }
})

//
SVG.extend(SVG.Element, {
  // Distribute clipPath to svg element
  clipWith: function(element) {
    // use given clip or create a new one
    this.clipper = element instanceof SVG.ClipPath ? element : this.parent().clip().add(element)

    // store reverence on self in mask
    this.clipper.targets.push(this)

    // apply mask
    return this.attr('clip-path', 'url("#' + this.clipper.attr('id') + '")')
  }
  // Unclip element
, unclip: function() {
    delete this.clipper
    return this.attr('clip-path', null)
  }

})
SVG.Gradient = SVG.invent({
  // Initialize node
  create: function(type) {
    this.constructor.call(this, SVG.create(type + 'Gradient'))

    // store type
    this.type = type
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Add a color stop
    at: function(offset, color, opacity) {
      return this.put(new SVG.Stop).update(offset, color, opacity)
    }
    // Update gradient
  , update: function(block) {
      // remove all stops
      this.clear()

      // invoke passed block
      if (typeof block == 'function')
        block.call(this, this)

      return this
    }
    // Return the fill id
  , fill: function() {
      return 'url(#' + this.id() + ')'
    }
    // Alias string convertion to fill
  , toString: function() {
      return this.fill()
    }
    // custom attr to handle transform
  , attr: function(a, b, c) {
      if(a == 'transform') a = 'gradientTransform'
      return SVG.Container.prototype.attr.call(this, a, b, c)
    }
  }

  // Add parent method
, construct: {
    // Create gradient element in defs
    gradient: function(type, block) {
      return this.defs().gradient(type, block)
    }
  }
})

// Add animatable methods to both gradient and fx module
SVG.extend(SVG.Gradient, SVG.FX, {
  // From position
  from: function(x, y) {
    return (this._target || this).type == 'radial' ?
      this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) :
      this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })
  }
  // To position
, to: function(x, y) {
    return (this._target || this).type == 'radial' ?
      this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) :
      this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })
  }
})

// Base gradient generation
SVG.extend(SVG.Defs, {
  // define gradient
  gradient: function(type, block) {
    return this.put(new SVG.Gradient(type)).update(block)
  }

})

SVG.Stop = SVG.invent({
  // Initialize node
  create: 'stop'

  // Inherit from
, inherit: SVG.Element

  // Add class methods
, extend: {
    // add color stops
    update: function(o) {
      if (typeof o == 'number' || o instanceof SVG.Number) {
        o = {
          offset:  arguments[0]
        , color:   arguments[1]
        , opacity: arguments[2]
        }
      }

      // set attributes
      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
      if (o.color   != null) this.attr('stop-color', o.color)
      if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))

      return this
    }
  }

})

SVG.Pattern = SVG.invent({
  // Initialize node
  create: 'pattern'

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Return the fill id
    fill: function() {
      return 'url(#' + this.id() + ')'
    }
    // Update pattern by rebuilding
  , update: function(block) {
      // remove content
      this.clear()

      // invoke passed block
      if (typeof block == 'function')
        block.call(this, this)

      return this
    }
    // Alias string convertion to fill
  , toString: function() {
      return this.fill()
    }
    // custom attr to handle transform
  , attr: function(a, b, c) {
      if(a == 'transform') a = 'patternTransform'
      return SVG.Container.prototype.attr.call(this, a, b, c)
    }

  }

  // Add parent method
, construct: {
    // Create pattern element in defs
    pattern: function(width, height, block) {
      return this.defs().pattern(width, height, block)
    }
  }
})

SVG.extend(SVG.Defs, {
  // Define gradient
  pattern: function(width, height, block) {
    return this.put(new SVG.Pattern).update(block).attr({
      x:            0
    , y:            0
    , width:        width
    , height:       height
    , patternUnits: 'userSpaceOnUse'
    })
  }

})
SVG.Doc = SVG.invent({
  // Initialize node
  create: function(element) {
    if (element) {
      // ensure the presence of a dom element
      element = typeof element == 'string' ?
        document.getElementById(element) :
        element

      // If the target is an svg element, use that element as the main wrapper.
      // This allows svg.js to work with svg documents as well.
      if (element.nodeName == 'svg') {
        this.constructor.call(this, element)
      } else {
        this.constructor.call(this, SVG.create('svg'))
        element.appendChild(this.node)
        this.size('100%', '100%')
      }

      // set svg element attributes and ensure defs node
      this.namespace().defs()
    }
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Add namespaces
    namespace: function() {
      return this
        .attr({ xmlns: SVG.ns, version: '1.1' })
        .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
        .attr('xmlns:svgjs', SVG.svgjs, SVG.xmlns)
    }
    // Creates and returns defs element
  , defs: function() {
      if (!this._defs) {
        var defs

        // Find or create a defs element in this instance
        if (defs = this.node.getElementsByTagName('defs')[0])
          this._defs = SVG.adopt(defs)
        else
          this._defs = new SVG.Defs

        // Make sure the defs node is at the end of the stack
        this.node.appendChild(this._defs.node)
      }

      return this._defs
    }
    // custom parent method
  , parent: function() {
      return this.node.parentNode.nodeName == '#document' ? null : this.node.parentNode
    }
    // Fix for possible sub-pixel offset. See:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
  , spof: function() {
      var pos = this.node.getScreenCTM()

      if (pos)
        this
          .style('left', (-pos.e % 1) + 'px')
          .style('top',  (-pos.f % 1) + 'px')

      return this
    }

      // Removes the doc from the DOM
  , remove: function() {
      if(this.parent()) {
        this.parent().removeChild(this.node)
      }

      return this
    }
  , clear: function() {
      // remove children
      while(this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild)

      // remove defs reference
      delete this._defs

      // add back parser
      if(!SVG.parser.draw.parentNode)
        this.node.appendChild(SVG.parser.draw)

      return this
    }
  }

})

SVG.Shape = SVG.invent({
  // Initialize node
  create: function(element) {
    this.constructor.call(this, element)
  }

  // Inherit from
, inherit: SVG.Element

})

SVG.Bare = SVG.invent({
  // Initialize
  create: function(element, inherit) {
    // construct element
    this.constructor.call(this, SVG.create(element))

    // inherit custom methods
    if (inherit)
      for (var method in inherit.prototype)
        if (typeof inherit.prototype[method] === 'function')
          this[method] = inherit.prototype[method]
  }

  // Inherit from
, inherit: SVG.Element

  // Add methods
, extend: {
    // Insert some plain text
    words: function(text) {
      // remove contents
      while (this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild)

      // create text node
      this.node.appendChild(document.createTextNode(text))

      return this
    }
  }
})


SVG.extend(SVG.Parent, {
  // Create an element that is not described by SVG.js
  element: function(element, inherit) {
    return this.put(new SVG.Bare(element, inherit))
  }
})

SVG.Symbol = SVG.invent({
  // Initialize node
  create: 'symbol'

  // Inherit from
, inherit: SVG.Container

, construct: {
    // create symbol
    symbol: function() {
      return this.put(new SVG.Symbol)
    }
  }
})

SVG.Use = SVG.invent({
  // Initialize node
  create: 'use'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Use element as a reference
    element: function(element, file) {
      // Set lined element
      return this.attr('href', (file || '') + '#' + element, SVG.xlink)
    }
  }

  // Add parent method
, construct: {
    // Create a use element
    use: function(element, file) {
      return this.put(new SVG.Use).element(element, file)
    }
  }
})
SVG.Rect = SVG.invent({
  // Initialize node
  create: 'rect'

  // Inherit from
, inherit: SVG.Shape

  // Add parent method
, construct: {
    // Create a rect element
    rect: function(width, height) {
      return this.put(new SVG.Rect()).size(width, height)
    }
  }
})
SVG.Circle = SVG.invent({
  // Initialize node
  create: 'circle'

  // Inherit from
, inherit: SVG.Shape

  // Add parent method
, construct: {
    // Create circle element, based on ellipse
    circle: function(size) {
      return this.put(new SVG.Circle).rx(new SVG.Number(size).divide(2)).move(0, 0)
    }
  }
})

SVG.extend(SVG.Circle, SVG.FX, {
  // Radius x value
  rx: function(rx) {
    return this.attr('r', rx)
  }
  // Alias radius x value
, ry: function(ry) {
    return this.rx(ry)
  }
})

SVG.Ellipse = SVG.invent({
  // Initialize node
  create: 'ellipse'

  // Inherit from
, inherit: SVG.Shape

  // Add parent method
, construct: {
    // Create an ellipse
    ellipse: function(width, height) {
      return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
    }
  }
})

SVG.extend(SVG.Ellipse, SVG.Rect, SVG.FX, {
  // Radius x value
  rx: function(rx) {
    return this.attr('rx', rx)
  }
  // Radius y value
, ry: function(ry) {
    return this.attr('ry', ry)
  }
})

// Add common method
SVG.extend(SVG.Circle, SVG.Ellipse, {
    // Move over x-axis
    x: function(x) {
      return x == null ? this.cx() - this.rx() : this.cx(x + this.rx())
    }
    // Move over y-axis
  , y: function(y) {
      return y == null ? this.cy() - this.ry() : this.cy(y + this.ry())
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.attr('cx') : this.attr('cx', x)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.attr('cy') : this.attr('cy', y)
    }
    // Set width of element
  , width: function(width) {
      return width == null ? this.rx() * 2 : this.rx(new SVG.Number(width).divide(2))
    }
    // Set height of element
  , height: function(height) {
      return height == null ? this.ry() * 2 : this.ry(new SVG.Number(height).divide(2))
    }
    // Custom size function
  , size: function(width, height) {
      var p = proportionalSize(this, width, height)

      return this
        .rx(new SVG.Number(p.width).divide(2))
        .ry(new SVG.Number(p.height).divide(2))
    }
})
SVG.Line = SVG.invent({
  // Initialize node
  create: 'line'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Get array
    array: function() {
      return new SVG.PointArray([
        [ this.attr('x1'), this.attr('y1') ]
      , [ this.attr('x2'), this.attr('y2') ]
      ])
    }
    // Overwrite native plot() method
  , plot: function(x1, y1, x2, y2) {
      if (x1 == null)
        return this.array()
      else if (typeof y1 !== 'undefined')
        x1 = { x1: x1, y1: y1, x2: x2, y2: y2 }
      else
        x1 = new SVG.PointArray(x1).toLine()

      return this.attr(x1)
    }
    // Move by left top corner
  , move: function(x, y) {
      return this.attr(this.array().move(x, y).toLine())
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = proportionalSize(this, width, height)

      return this.attr(this.array().size(p.width, p.height).toLine())
    }
  }

  // Add parent method
, construct: {
    // Create a line element
    line: function(x1, y1, x2, y2) {
      // make sure plot is called as a setter
      // x1 is not necessarily a number, it can also be an array, a string and a SVG.PointArray
      return SVG.Line.prototype.plot.apply(
        this.put(new SVG.Line)
      , x1 != null ? [x1, y1, x2, y2] : [0, 0, 0, 0]
      )
    }
  }
})

SVG.Polyline = SVG.invent({
  // Initialize node
  create: 'polyline'

  // Inherit from
, inherit: SVG.Shape

  // Add parent method
, construct: {
    // Create a wrapped polyline element
    polyline: function(p) {
      // make sure plot is called as a setter
      return this.put(new SVG.Polyline).plot(p || new SVG.PointArray)
    }
  }
})

SVG.Polygon = SVG.invent({
  // Initialize node
  create: 'polygon'

  // Inherit from
, inherit: SVG.Shape

  // Add parent method
, construct: {
    // Create a wrapped polygon element
    polygon: function(p) {
      // make sure plot is called as a setter
      return this.put(new SVG.Polygon).plot(p || new SVG.PointArray)
    }
  }
})

// Add polygon-specific functions
SVG.extend(SVG.Polyline, SVG.Polygon, {
  // Get array
  array: function() {
    return this._array || (this._array = new SVG.PointArray(this.attr('points')))
  }
  // Plot new path
, plot: function(p) {
    return (p == null) ?
      this.array() :
      this.clear().attr('points', typeof p == 'string' ? p : (this._array = new SVG.PointArray(p)))
  }
  // Clear array cache
, clear: function() {
    delete this._array
    return this
  }
  // Move by left top corner
, move: function(x, y) {
    return this.attr('points', this.array().move(x, y))
  }
  // Set element size to given width and height
, size: function(width, height) {
    var p = proportionalSize(this, width, height)

    return this.attr('points', this.array().size(p.width, p.height))
  }

})

// unify all point to point elements
SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, {
  // Define morphable array
  morphArray:  SVG.PointArray
  // Move by left top corner over x-axis
, x: function(x) {
    return x == null ? this.bbox().x : this.move(x, this.bbox().y)
  }
  // Move by left top corner over y-axis
, y: function(y) {
    return y == null ? this.bbox().y : this.move(this.bbox().x, y)
  }
  // Set width of element
, width: function(width) {
    var b = this.bbox()

    return width == null ? b.width : this.size(width, b.height)
  }
  // Set height of element
, height: function(height) {
    var b = this.bbox()

    return height == null ? b.height : this.size(b.width, height)
  }
})
SVG.Path = SVG.invent({
  // Initialize node
  create: 'path'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Define morphable array
    morphArray:  SVG.PathArray
    // Get array
  , array: function() {
      return this._array || (this._array = new SVG.PathArray(this.attr('d')))
    }
    // Plot new path
  , plot: function(d) {
      return (d == null) ?
        this.array() :
        this.clear().attr('d', typeof d == 'string' ? d : (this._array = new SVG.PathArray(d)))
    }
    // Clear array cache
  , clear: function() {
      delete this._array
      return this
    }
    // Move by left top corner
  , move: function(x, y) {
      return this.attr('d', this.array().move(x, y))
    }
    // Move by left top corner over x-axis
  , x: function(x) {
      return x == null ? this.bbox().x : this.move(x, this.bbox().y)
    }
    // Move by left top corner over y-axis
  , y: function(y) {
      return y == null ? this.bbox().y : this.move(this.bbox().x, y)
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = proportionalSize(this, width, height)

      return this.attr('d', this.array().size(p.width, p.height))
    }
    // Set width of element
  , width: function(width) {
      return width == null ? this.bbox().width : this.size(width, this.bbox().height)
    }
    // Set height of element
  , height: function(height) {
      return height == null ? this.bbox().height : this.size(this.bbox().width, height)
    }

  }

  // Add parent method
, construct: {
    // Create a wrapped path element
    path: function(d) {
      // make sure plot is called as a setter
      return this.put(new SVG.Path).plot(d || new SVG.PathArray)
    }
  }
})

SVG.Image = SVG.invent({
  // Initialize node
  create: 'image'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // (re)load image
    load: function(url) {
      if (!url) return this

      var self = this
        , img  = new window.Image()

      // preload image
      SVG.on(img, 'load', function() {
        var p = self.parent(SVG.Pattern)

        if(p === null) return

        // ensure image size
        if (self.width() == 0 && self.height() == 0)
          self.size(img.width, img.height)

        // ensure pattern size if not set
        if (p && p.width() == 0 && p.height() == 0)
          p.size(self.width(), self.height())

        // callback
        if (typeof self._loaded === 'function')
          self._loaded.call(self, {
            width:  img.width
          , height: img.height
          , ratio:  img.width / img.height
          , url:    url
          })
      })

      SVG.on(img, 'error', function(e){
        if (typeof self._error === 'function'){
            self._error.call(self, e)
        }
      })

      return this.attr('href', (img.src = this.src = url), SVG.xlink)
    }
    // Add loaded callback
  , loaded: function(loaded) {
      this._loaded = loaded
      return this
    }

  , error: function(error) {
      this._error = error
      return this
    }
  }

  // Add parent method
, construct: {
    // create image element, load image and set its size
    image: function(source, width, height) {
      return this.put(new SVG.Image).load(source).size(width || 0, height || width || 0)
    }
  }

})
SVG.Text = SVG.invent({
  // Initialize node
  create: function() {
    this.constructor.call(this, SVG.create('text'))

    this.dom.leading = new SVG.Number(1.3)    // store leading value for rebuilding
    this._rebuild = true                      // enable automatic updating of dy values
    this._build   = false                     // disable build mode for adding multiple lines

    // set default font
    this.attr('font-family', SVG.defaults.attrs['font-family'])
  }

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Move over x-axis
    x: function(x) {
      // act as getter
      if (x == null)
        return this.attr('x')

      return this.attr('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      var oy = this.attr('y')
        , o  = typeof oy === 'number' ? oy - this.bbox().y : 0

      // act as getter
      if (y == null)
        return typeof oy === 'number' ? oy - o : oy

      return this.attr('y', typeof y === 'number' ? y + o : y)
    }
    // Move center over x-axis
  , cx: function(x) {
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
    }
    // Move center over y-axis
  , cy: function(y) {
      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
    }
    // Set the text content
  , text: function(text) {
      // act as getter
      if (typeof text === 'undefined'){
        var text = ''
        var children = this.node.childNodes
        for(var i = 0, len = children.length; i < len; ++i){

          // add newline if its not the first child and newLined is set to true
          if(i != 0 && children[i].nodeType != 3 && SVG.adopt(children[i]).dom.newLined == true){
            text += '\n'
          }

          // add content of this node
          text += children[i].textContent
        }

        return text
      }

      // remove existing content
      this.clear().build(true)

      if (typeof text === 'function') {
        // call block
        text.call(this, this)

      } else {
        // store text and make sure text is not blank
        text = text.split('\n')

        // build new lines
        for (var i = 0, il = text.length; i < il; i++)
          this.tspan(text[i]).newLine()
      }

      // disable build mode and rebuild lines
      return this.build(false).rebuild()
    }
    // Set font size
  , size: function(size) {
      return this.attr('font-size', size).rebuild()
    }
    // Set / get leading
  , leading: function(value) {
      // act as getter
      if (value == null)
        return this.dom.leading

      // act as setter
      this.dom.leading = new SVG.Number(value)

      return this.rebuild()
    }
    // Get all the first level lines
  , lines: function() {
      var node = (this.textPath && this.textPath() || this).node

      // filter tspans and map them to SVG.js instances
      var lines = SVG.utils.map(SVG.utils.filterSVGElements(node.childNodes), function(el){
        return SVG.adopt(el)
      })

      // return an instance of SVG.set
      return new SVG.Set(lines)
    }
    // Rebuild appearance type
  , rebuild: function(rebuild) {
      // store new rebuild flag if given
      if (typeof rebuild == 'boolean')
        this._rebuild = rebuild

      // define position of all lines
      if (this._rebuild) {
        var self = this
          , blankLineOffset = 0
          , dy = this.dom.leading * new SVG.Number(this.attr('font-size'))

        this.lines().each(function() {
          if (this.dom.newLined) {
            if (!self.textPath())
              this.attr('x', self.attr('x'))
            if(this.text() == '\n') {
              blankLineOffset += dy
            }else{
              this.attr('dy', dy + blankLineOffset)
              blankLineOffset = 0
            }
          }
        })

        this.fire('rebuild')
      }

      return this
    }
    // Enable / disable build mode
  , build: function(build) {
      this._build = !!build
      return this
    }
    // overwrite method from parent to set data properly
  , setData: function(o){
      this.dom = o
      this.dom.leading = new SVG.Number(o.leading || 1.3)
      return this
    }
  }

  // Add parent method
, construct: {
    // Create text element
    text: function(text) {
      return this.put(new SVG.Text).text(text)
    }
    // Create plain text element
  , plain: function(text) {
      return this.put(new SVG.Text).plain(text)
    }
  }

})

SVG.Tspan = SVG.invent({
  // Initialize node
  create: 'tspan'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Set text content
    text: function(text) {
      if(text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '')

      typeof text === 'function' ? text.call(this, this) : this.plain(text)

      return this
    }
    // Shortcut dx
  , dx: function(dx) {
      return this.attr('dx', dx)
    }
    // Shortcut dy
  , dy: function(dy) {
      return this.attr('dy', dy)
    }
    // Create new line
  , newLine: function() {
      // fetch text parent
      var t = this.parent(SVG.Text)

      // mark new line
      this.dom.newLined = true

      // apply new hy¡n
      return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x())
    }
  }

})

SVG.extend(SVG.Text, SVG.Tspan, {
  // Create plain text node
  plain: function(text) {
    // clear if build mode is disabled
    if (this._build === false)
      this.clear()

    // create text node
    this.node.appendChild(document.createTextNode(text))

    return this
  }
  // Create a tspan
, tspan: function(text) {
    var node  = (this.textPath && this.textPath() || this).node
      , tspan = new SVG.Tspan

    // clear if build mode is disabled
    if (this._build === false)
      this.clear()

    // add new tspan
    node.appendChild(tspan.node)

    return tspan.text(text)
  }
  // Clear all lines
, clear: function() {
    var node = (this.textPath && this.textPath() || this).node

    // remove existing child nodes
    while (node.hasChildNodes())
      node.removeChild(node.lastChild)

    return this
  }
  // Get length of text element
, length: function() {
    return this.node.getComputedTextLength()
  }
})

SVG.TextPath = SVG.invent({
  // Initialize node
  create: 'textPath'

  // Inherit from
, inherit: SVG.Parent

  // Define parent class
, parent: SVG.Text

  // Add parent method
, construct: {
    morphArray: SVG.PathArray
    // Create path for text to run on
  , path: function(d) {
      // create textPath element
      var path  = new SVG.TextPath
        , track = this.doc().defs().path(d)

      // move lines to textpath
      while (this.node.hasChildNodes())
        path.node.appendChild(this.node.firstChild)

      // add textPath element as child node
      this.node.appendChild(path.node)

      // link textPath to path and add content
      path.attr('href', '#' + track, SVG.xlink)

      return this
    }
    // return the array of the path track element
  , array: function() {
      var track = this.track()

      return track ? track.array() : null
    }
    // Plot path if any
  , plot: function(d) {
      var track = this.track()
        , pathArray = null

      if (track) {
        pathArray = track.plot(d)
      }

      return (d == null) ? pathArray : this
    }
    // Get the path track element
  , track: function() {
      var path = this.textPath()

      if (path)
        return path.reference('href')
    }
    // Get the textPath child
  , textPath: function() {
      if (this.node.firstChild && this.node.firstChild.nodeName == 'textPath')
        return SVG.adopt(this.node.firstChild)
    }
  }
})

SVG.Nested = SVG.invent({
  // Initialize node
  create: function() {
    this.constructor.call(this, SVG.create('svg'))

    this.style('overflow', 'visible')
  }

  // Inherit from
, inherit: SVG.Container

  // Add parent method
, construct: {
    // Create nested svg document
    nested: function() {
      return this.put(new SVG.Nested)
    }
  }
})
SVG.A = SVG.invent({
  // Initialize node
  create: 'a'

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Link url
    to: function(url) {
      return this.attr('href', url, SVG.xlink)
    }
    // Link show attribute
  , show: function(target) {
      return this.attr('show', target, SVG.xlink)
    }
    // Link target attribute
  , target: function(target) {
      return this.attr('target', target)
    }
  }

  // Add parent method
, construct: {
    // Create a hyperlink element
    link: function(url) {
      return this.put(new SVG.A).to(url)
    }
  }
})

SVG.extend(SVG.Element, {
  // Create a hyperlink element
  linkTo: function(url) {
    var link = new SVG.A

    if (typeof url == 'function')
      url.call(link, link)
    else
      link.to(url)

    return this.parent().put(link).put(this)
  }

})
SVG.Marker = SVG.invent({
  // Initialize node
  create: 'marker'

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Set width of element
    width: function(width) {
      return this.attr('markerWidth', width)
    }
    // Set height of element
  , height: function(height) {
      return this.attr('markerHeight', height)
    }
    // Set marker refX and refY
  , ref: function(x, y) {
      return this.attr('refX', x).attr('refY', y)
    }
    // Update marker
  , update: function(block) {
      // remove all content
      this.clear()

      // invoke passed block
      if (typeof block == 'function')
        block.call(this, this)

      return this
    }
    // Return the fill id
  , toString: function() {
      return 'url(#' + this.id() + ')'
    }
  }

  // Add parent method
, construct: {
    marker: function(width, height, block) {
      // Create marker element in defs
      return this.defs().marker(width, height, block)
    }
  }

})

SVG.extend(SVG.Defs, {
  // Create marker
  marker: function(width, height, block) {
    // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
    return this.put(new SVG.Marker)
      .size(width, height)
      .ref(width / 2, height / 2)
      .viewbox(0, 0, width, height)
      .attr('orient', 'auto')
      .update(block)
  }

})

SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Path, {
  // Create and attach markers
  marker: function(marker, width, height, block) {
    var attr = ['marker']

    // Build attribute name
    if (marker != 'all') attr.push(marker)
    attr = attr.join('-')

    // Set marker attribute
    marker = arguments[1] instanceof SVG.Marker ?
      arguments[1] :
      this.doc().marker(width, height, block)

    return this.attr(attr, marker)
  }

})
// Define list of available attributes for stroke and fill
var sugar = {
  stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
, fill:   ['color', 'opacity', 'rule']
, prefix: function(t, a) {
    return a == 'color' ? t : t + '-' + a
  }
}

// Add sugar for fill and stroke
;['fill', 'stroke'].forEach(function(m) {
  var i, extension = {}

  extension[m] = function(o) {
    if (typeof o == 'undefined')
      return this
    if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
      this.attr(m, o)

    else
      // set all attributes from sugar.fill and sugar.stroke list
      for (i = sugar[m].length - 1; i >= 0; i--)
        if (o[sugar[m][i]] != null)
          this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])

    return this
  }

  SVG.extend(SVG.Element, SVG.FX, extension)

})

SVG.extend(SVG.Element, SVG.FX, {
  // Map rotation to transform
  rotate: function(d, cx, cy) {
    return this.transform({ rotation: d, cx: cx, cy: cy })
  }
  // Map skew to transform
, skew: function(x, y, cx, cy) {
    return arguments.length == 1  || arguments.length == 3 ?
      this.transform({ skew: x, cx: y, cy: cx }) :
      this.transform({ skewX: x, skewY: y, cx: cx, cy: cy })
  }
  // Map scale to transform
, scale: function(x, y, cx, cy) {
    return arguments.length == 1  || arguments.length == 3 ?
      this.transform({ scale: x, cx: y, cy: cx }) :
      this.transform({ scaleX: x, scaleY: y, cx: cx, cy: cy })
  }
  // Map translate to transform
, translate: function(x, y) {
    return this.transform({ x: x, y: y })
  }
  // Map flip to transform
, flip: function(a, o) {
    o = typeof a == 'number' ? a : o
    return this.transform({ flip: a || 'both', offset: o })
  }
  // Map matrix to transform
, matrix: function(m) {
    return this.attr('transform', new SVG.Matrix(arguments.length == 6 ? [].slice.call(arguments) : m))
  }
  // Opacity
, opacity: function(value) {
    return this.attr('opacity', value)
  }
  // Relative move over x axis
, dx: function(x) {
    return this.x(new SVG.Number(x).plus(this instanceof SVG.FX ? 0 : this.x()), true)
  }
  // Relative move over y axis
, dy: function(y) {
    return this.y(new SVG.Number(y).plus(this instanceof SVG.FX ? 0 : this.y()), true)
  }
  // Relative move over x and y axes
, dmove: function(x, y) {
    return this.dx(x).dy(y)
  }
})

SVG.extend(SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.FX, {
  // Add x and y radius
  radius: function(x, y) {
    var type = (this._target || this).type;
    return type == 'radial' || type == 'circle' ?
      this.attr('r', new SVG.Number(x)) :
      this.rx(x).ry(y == null ? x : y)
  }
})

SVG.extend(SVG.Path, {
  // Get path length
  length: function() {
    return this.node.getTotalLength()
  }
  // Get point at length
, pointAt: function(length) {
    return this.node.getPointAtLength(length)
  }
})

SVG.extend(SVG.Parent, SVG.Text, SVG.Tspan, SVG.FX, {
  // Set font
  font: function(a, v) {
    if (typeof a == 'object') {
      for (v in a) this.font(v, a[v])
    }

    return a == 'leading' ?
        this.leading(v) :
      a == 'anchor' ?
        this.attr('text-anchor', v) :
      a == 'size' || a == 'family' || a == 'weight' || a == 'stretch' || a == 'variant' || a == 'style' ?
        this.attr('font-'+ a, v) :
        this.attr(a, v)
  }
})

SVG.Set = SVG.invent({
  // Initialize
  create: function(members) {
    // Set initial state
    Array.isArray(members) ? this.members = members : this.clear()
  }

  // Add class methods
, extend: {
    // Add element to set
    add: function() {
      var i, il, elements = [].slice.call(arguments)

      for (i = 0, il = elements.length; i < il; i++)
        this.members.push(elements[i])

      return this
    }
    // Remove element from set
  , remove: function(element) {
      var i = this.index(element)

      // remove given child
      if (i > -1)
        this.members.splice(i, 1)

      return this
    }
    // Iterate over all members
  , each: function(block) {
      for (var i = 0, il = this.members.length; i < il; i++)
        block.apply(this.members[i], [i, this.members])

      return this
    }
    // Restore to defaults
  , clear: function() {
      // initialize store
      this.members = []

      return this
    }
    // Get the length of a set
  , length: function() {
      return this.members.length
    }
    // Checks if a given element is present in set
  , has: function(element) {
      return this.index(element) >= 0
    }
    // retuns index of given element in set
  , index: function(element) {
      return this.members.indexOf(element)
    }
    // Get member at given index
  , get: function(i) {
      return this.members[i]
    }
    // Get first member
  , first: function() {
      return this.get(0)
    }
    // Get last member
  , last: function() {
      return this.get(this.members.length - 1)
    }
    // Default value
  , valueOf: function() {
      return this.members
    }
    // Get the bounding box of all members included or empty box if set has no items
  , bbox: function(){
      // return an empty box of there are no members
      if (this.members.length == 0)
        return new SVG.RBox()

      // get the first rbox and update the target bbox
      var rbox = this.members[0].rbox(this.members[0].doc())

      this.each(function() {
        // user rbox for correct position and visual representation
        rbox = rbox.merge(this.rbox(this.doc()))
      })

      return rbox
    }
  }

  // Add parent method
, construct: {
    // Create a new set
    set: function(members) {
      return new SVG.Set(members)
    }
  }
})

SVG.FX.Set = SVG.invent({
  // Initialize node
  create: function(set) {
    // store reference to set
    this.set = set
  }

})

// Alias methods
SVG.Set.inherit = function() {
  var m
    , methods = []

  // gather shape methods
  for(var m in SVG.Shape.prototype)
    if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')
      methods.push(m)

  // apply shape aliasses
  methods.forEach(function(method) {
    SVG.Set.prototype[method] = function() {
      for (var i = 0, il = this.members.length; i < il; i++)
        if (this.members[i] && typeof this.members[i][method] == 'function')
          this.members[i][method].apply(this.members[i], arguments)

      return method == 'animate' ? (this.fx || (this.fx = new SVG.FX.Set(this))) : this
    }
  })

  // clear methods for the next round
  methods = []

  // gather fx methods
  for(var m in SVG.FX.prototype)
    if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.FX.Set.prototype[m] != 'function')
      methods.push(m)

  // apply fx aliasses
  methods.forEach(function(method) {
    SVG.FX.Set.prototype[method] = function() {
      for (var i = 0, il = this.set.members.length; i < il; i++)
        this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments)

      return this
    }
  })
}




SVG.extend(SVG.Element, {
  // Store data values on svg nodes
  data: function(a, v, r) {
    if (typeof a == 'object') {
      for (v in a)
        this.data(v, a[v])

    } else if (arguments.length < 2) {
      try {
        return JSON.parse(this.attr('data-' + a))
      } catch(e) {
        return this.attr('data-' + a)
      }

    } else {
      this.attr(
        'data-' + a
      , v === null ?
          null :
        r === true || typeof v === 'string' || typeof v === 'number' ?
          v :
          JSON.stringify(v)
      )
    }

    return this
  }
})
SVG.extend(SVG.Element, {
  // Remember arbitrary data
  remember: function(k, v) {
    // remember every item in an object individually
    if (typeof arguments[0] == 'object')
      for (var v in k)
        this.remember(v, k[v])

    // retrieve memory
    else if (arguments.length == 1)
      return this.memory()[k]

    // store memory
    else
      this.memory()[k] = v

    return this
  }

  // Erase a given memory
, forget: function() {
    if (arguments.length == 0)
      this._memory = {}
    else
      for (var i = arguments.length - 1; i >= 0; i--)
        delete this.memory()[arguments[i]]

    return this
  }

  // Initialize or return local memory object
, memory: function() {
    return this._memory || (this._memory = {})
  }

})
// Method for getting an element by id
SVG.get = function(id) {
  var node = document.getElementById(idFromReference(id) || id)
  return SVG.adopt(node)
}

// Select elements by query string
SVG.select = function(query, parent) {
  return new SVG.Set(
    SVG.utils.map((parent || document).querySelectorAll(query), function(node) {
      return SVG.adopt(node)
    })
  )
}

SVG.extend(SVG.Parent, {
  // Scoped select method
  select: function(query) {
    return SVG.select(query, this.node)
  }

})
function pathRegReplace(a, b, c, d) {
  return c + d.replace(SVG.regex.dots, ' .')
}

// creates deep clone of array
function array_clone(arr){
  var clone = arr.slice(0)
  for(var i = clone.length; i--;){
    if(Array.isArray(clone[i])){
      clone[i] = array_clone(clone[i])
    }
  }
  return clone
}

// tests if a given element is instance of an object
function is(el, obj){
  return el instanceof obj
}

// tests if a given selector matches an element
function matches(el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
}

// Convert dash-separated-string to camelCase
function camelCase(s) {
  return s.toLowerCase().replace(/-(.)/g, function(m, g) {
    return g.toUpperCase()
  })
}

// Capitalize first letter of a string
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Ensure to six-based hex
function fullHex(hex) {
  return hex.length == 4 ?
    [ '#',
      hex.substring(1, 2), hex.substring(1, 2)
    , hex.substring(2, 3), hex.substring(2, 3)
    , hex.substring(3, 4), hex.substring(3, 4)
    ].join('') : hex
}

// Component to hex value
function compToHex(comp) {
  var hex = comp.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

// Calculate proportional width and height values when necessary
function proportionalSize(element, width, height) {
  if (width == null || height == null) {
    var box = element.bbox()

    if (width == null)
      width = box.width / box.height * height
    else if (height == null)
      height = box.height / box.width * width
  }

  return {
    width:  width
  , height: height
  }
}

// Delta transform point
function deltaTransformPoint(matrix, x, y) {
  return {
    x: x * matrix.a + y * matrix.c + 0
  , y: x * matrix.b + y * matrix.d + 0
  }
}

// Map matrix array to object
function arrayToMatrix(a) {
  return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
}

// Parse matrix if required
function parseMatrix(matrix) {
  if (!(matrix instanceof SVG.Matrix))
    matrix = new SVG.Matrix(matrix)

  return matrix
}

// Add centre point to transform object
function ensureCentre(o, target) {
  o.cx = o.cx == null ? target.bbox().cx : o.cx
  o.cy = o.cy == null ? target.bbox().cy : o.cy
}

// PathArray Helpers
function arrayToString(a) {
  for (var i = 0, il = a.length, s = ''; i < il; i++) {
    s += a[i][0]

    if (a[i][1] != null) {
      s += a[i][1]

      if (a[i][2] != null) {
        s += ' '
        s += a[i][2]

        if (a[i][3] != null) {
          s += ' '
          s += a[i][3]
          s += ' '
          s += a[i][4]

          if (a[i][5] != null) {
            s += ' '
            s += a[i][5]
            s += ' '
            s += a[i][6]

            if (a[i][7] != null) {
              s += ' '
              s += a[i][7]
            }
          }
        }
      }
    }
  }

  return s + ' '
}

// Deep new id assignment
function assignNewId(node) {
  // do the same for SVG child nodes as well
  for (var i = node.childNodes.length - 1; i >= 0; i--)
    if (node.childNodes[i] instanceof window.SVGElement)
      assignNewId(node.childNodes[i])

  return SVG.adopt(node).id(SVG.eid(node.nodeName))
}

// Add more bounding box properties
function fullBox(b) {
  if (b.x == null) {
    b.x      = 0
    b.y      = 0
    b.width  = 0
    b.height = 0
  }

  b.w  = b.width
  b.h  = b.height
  b.x2 = b.x + b.width
  b.y2 = b.y + b.height
  b.cx = b.x + b.width / 2
  b.cy = b.y + b.height / 2

  return b
}

// Get id from reference string
function idFromReference(url) {
  var m = url.toString().match(SVG.regex.reference)

  if (m) return m[1]
}

// Create matrix array for looping
var abcdef = 'abcdef'.split('')
// Add CustomEvent to IE9 and IE10
if (typeof window.CustomEvent !== 'function') {
  // Code from: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
  var CustomEvent = function(event, options) {
    options = options || { bubbles: false, cancelable: false, detail: undefined }
    var e = document.createEvent('CustomEvent')
    e.initCustomEvent(event, options.bubbles, options.cancelable, options.detail)
    return e
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
}

// requestAnimationFrame / cancelAnimationFrame Polyfill with fallback based on Paul Irish
(function(w) {
  var lastTime = 0
  var vendors = ['moz', 'webkit']

  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame']
    w.cancelAnimationFrame  = w[vendors[x] + 'CancelAnimationFrame'] ||
                              w[vendors[x] + 'CancelRequestAnimationFrame']
  }

  w.requestAnimationFrame = w.requestAnimationFrame ||
    function(callback) {
      var currTime = new Date().getTime()
      var timeToCall = Math.max(0, 16 - (currTime - lastTime))

      var id = w.setTimeout(function() {
        callback(currTime + timeToCall)
      }, timeToCall)

      lastTime = currTime + timeToCall
      return id
    }

  w.cancelAnimationFrame = w.cancelAnimationFrame || w.clearTimeout;

}(window))

return SVG

}));

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GCGraph; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return drawGCGraph; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper__ = __webpack_require__(3);


const GCGraph = id => {
  const element = document.createElement('div')
  element.innerHTML = 'Contributions'
  element.id = id

  return element
}

const drawGCGraph = (draw, { font, currentYear, currentMonth, boxSize, boxes, limit, padding, tooltip, monthNames }) => {
  // Global
  const boxSizePadding = boxSize + padding
  const monthHeight = 24
  let offsetX = 0
  let offsetY = 0

  // Days
  const dayOffsetX = offsetX
  const dayOffsetY = offsetY + monthHeight
  let dayY = boxSizePadding // Start at Sunday
  const drawDays = ['Mon', 'Wed', 'Fri']
  drawDays.map((day, index) => {
    const text = draw.text(day)
    text.font(font).move(dayOffsetX, dayOffsetY + dayY)
    dayY += boxSizePadding * 2
  })
  offsetX += 26

  // Months
  const monthOffsetX = offsetX
  const monthOffsetY = offsetY + 6
  const months = monthNames.map((name, i) => ({ name, days: Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* daysInMonth */])(i, currentYear) }))

  const slideMonths = months.slice(currentMonth, 12).concat(months.slice(0, currentMonth))

  let daysInMonthSum = 0
  slideMonths.map((month, index) => {
    const monthX = Math.floor(daysInMonthSum / 7) * boxSizePadding
    let text = draw.text(slideMonths[index].name)
    text.font(font).move(monthOffsetX + monthX, monthOffsetY)

    // next
    daysInMonthSum += month.days
  })
  offsetY += monthHeight

  // Boxes
  const boxOffsetX = offsetX
  const boxOffsetY = offsetY
  boxes.map((box, index) => {
    // Positions
    const i = boxOffsetX + boxSizePadding * Math.floor(index / limit)
    const j = boxOffsetY + boxSizePadding * (index % limit)

    // Shape
    const element = draw.rect(boxSize, boxSize).move(i, j).fill(box.color)
    element.id = box.id
    element.data = box.data
    element.addClass('tooltip')
    const position = { x: i + boxSize - padding / 2, y: j }
    element.mouseover(() => tooltip.show(box.id, position, element.data))
    element.click(() => tooltip.toggle(box.id, position, element.data))
    element.mouseout(() => tooltip.hide())
  })
}




/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return daysInMonth; });
const daysInMonth = (month, year) => new Date(year, month, 0).getDate()




/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GCTooltip; });
const GCTooltip = bubbleWidth => {
  const element = document.createElement('span')
  element.id = 'tooltiptext'
  element.className = 'tooltiptext'
  element.innerHTML = 'Hi@!'

  element.show = (id, position, data) => {
    element.style.visibility = 'visible'
    element.firstChild.data = data
    element.style.left = `${position.x - bubbleWidth / 2}px`
    element.style.top = `${position.y}px`
    element.target = id
  }

  element.hide = () => {
    element.style.visibility = 'hidden'
    element.target = null
  }

  element.toggle = (id, position, data) => {
    console.log()
    if (element.style.visibility === 'hidden' && element.target !== id) element.show(id, position, data)
    else element.hide()
  }

  addStyle(bubbleWidth)

  return element
}

const addStyle = bubbleWidth => {
  const css = `
.tooltiptext {
    visibility: hidden;
    font-family:'Helvetica';
    font-size: 0.8em;
    width: ${bubbleWidth}px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 4px;
    border-radius: 6px;
 
    position: absolute;
    z-index: 1;
    pointer-events: none;
}

.tooltiptext::after {
    content: " ";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
}
`
  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')

  style.type = 'text/css'
  if (style.styleSheet) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }

  head.appendChild(style)
}



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return config; });
const config = {
  id: 'gcg',
  w: '100%',
  h: '100%',
  font: {
    family: 'Helvetica',
    size: 9
  },
  limit: 7,
  padding: 2,
  boxSize: 10,
  bubbleWidth: 220,
  monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
}



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getBoxes; });
// This is mock data for testing purpose
const getBoxes = currentYear => {
  const contributeOrNot = (count, at) => (count === 0 ? 'No contributions' : `${count} contributions`)
  const MAX_DAY = 365
  let boxes = []
  for (let i = 0; i < MAX_DAY; i++) {
    boxes.push({
      id: `b${i}`,
      color: ['#ecf0f1', '#2ecc71', '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#e74c3c'][Math.floor(Math.random() * 7)],
      data: `${contributeOrNot(Math.floor(10 * Math.random()))} on ${new Date(currentYear, 0, i).toDateString()}`
    })
  }

  return boxes
}




/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGFjMzViMGJlYTUxODVhZDdhMzciLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdmcuanMvZGlzdC9zdmcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dyYXBoLmpzIiwid2VicGFjazovLy8uL3NyYy9oZWxwZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Rvb2x0aXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VlZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQTJEO0FBQzNEO0FBQ0E7QUFDQSxXQUFHOztBQUVILG9EQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3REFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBO0FBQ0Esb0NBQTRCO0FBQzVCLHFDQUE2QjtBQUM3Qix5Q0FBaUM7O0FBRWpDLCtDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBc0M7QUFDdEM7QUFDQTtBQUNBLHFDQUE2QjtBQUM3QixxQ0FBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQWlCLDhCQUE4QjtBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxnQkFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBYSx3Q0FBd0M7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0EsOENBQXNDLHVCQUF1Qjs7QUFFN0Q7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDanRCQTtBQUMrQjtBQUNYO0FBQ0g7QUFDRTs7QUFFbkI7QUFDQSxPQUFPLHdCQUF3QjtBQUMvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUFBO0FBQ0wsR0FBRztBQUNILGdGQUFnRjtBQUNoRixHQUFHO0FBQ0g7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDhCQUE4QixRQUFRO0FBQ3RDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUVBQW1FOztBQUVuRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLGtCQUFrQixXQUFXLFVBQVU7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlDQUFpQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUU7O0FBRTNEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0MsSUFBSTs7QUFFcEM7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QixHQUFHOztBQUVqQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWUsUUFBUTtBQUN2Qjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZDQUE2Qyx5Q0FBeUM7QUFDdEY7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxRQUFRO0FBQzlEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1REFBdUQsUUFBUTtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsUUFBUTtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1REFBdUQsUUFBUTtBQUMvRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssT0FBTztBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQ0FBc0MsU0FBUztBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUNBQXlDLFFBQVE7QUFDakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQyxRQUFRO0FBQzNDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFDQUFxQyxRQUFRO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxRQUFRO0FBQzdDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDLFFBQVE7QUFDcEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVDs7QUFFQSxTQUFTO0FBQ1Q7O0FBRUEsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUMsUUFBUTtBQUMzQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTztBQUNQOztBQUVBLE9BQU87QUFDUDs7QUFFQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esc0NBQXNDLHlCQUF5QjtBQUMvRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0NBQXdDLFFBQVE7QUFDaEQ7QUFDQSw0Q0FBNEMsUUFBUTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjs7QUFFcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7O0FBR0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrREFBK0QsUUFBUTtBQUN2RTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQSxxQkFBcUI7QUFDckIscUJBQXFCO0FBQ3JCLHFCQUFxQjtBQUNyQixxQkFBcUI7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxDQUFDOzs7QUFHRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLGNBQWM7QUFDbEY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDhCQUE4QixLQUFLO0FBQ25DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9EQUFvRCxpRUFBaUU7O0FBRXJIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx3Q0FBd0MsbUNBQW1DOztBQUUzRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZDQUE2QyxTQUFTOztBQUV0RDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsYUFBYTtBQUN6QztBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixJQUFJO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsSUFBSTtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrQkFBK0IsUUFBUTtBQUN2QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUNBQXFDLFFBQVE7QUFDN0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQSxPQUFPLGVBQWU7QUFDdEI7QUFDQSxPQUFPLGFBQWE7QUFDcEI7QUFDQSxPQUFPLDJCQUEyQjs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixRQUFRO0FBQ3BDOztBQUVBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBFQUEwRSx5QkFBeUI7QUFDbkcsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxPQUFPOztBQUVQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpREFBaUQsU0FBUztBQUMxRDtBQUNBO0FBQ0EsS0FBSztBQUNMLGlEQUFpRCxTQUFTO0FBQzFEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxpREFBaUQsU0FBUztBQUMxRDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsaURBQWlELFNBQVM7QUFDMUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1A7QUFDQSx5QkFBeUI7QUFDekIsZ0NBQWdDO0FBQ2hDLCtCQUErQixhQUFhO0FBQzVDLDJCQUEyQiw0QkFBNEI7O0FBRXZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSwyQ0FBMkMsd0JBQXdCO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQztBQUNEO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsdUVBQXVFLDhCQUE4QjtBQUNyRzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7QUFHRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Qsa0JBQWtCO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLCtEQUErRCxrQkFBa0I7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLFFBQVE7QUFDbkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7O0FBR0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLFFBQVE7QUFDbkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsK0NBQStDO0FBQ2hFLGlCQUFpQiwrQ0FBK0M7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsK0NBQStDO0FBQ2hFLGlCQUFpQiwrQ0FBK0M7QUFDaEU7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGdDQUFnQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7QUFHRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsU0FBUzs7QUFFdEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSx5Q0FBeUMsUUFBUTtBQUNqRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1DQUFtQyxRQUFRO0FBQzNDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQiw4QkFBOEI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IseUJBQXlCO0FBQy9DLHNCQUFzQixxQ0FBcUM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsMEJBQTBCO0FBQ2hELHNCQUFzQix1Q0FBdUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGFBQWE7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsK0JBQStCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUNBQXVDLFFBQVE7QUFDL0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELFFBQVE7QUFDM0Q7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsUUFBUTtBQUNoRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7O0FBRUEsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsS0FBSztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0MsUUFBUTtBQUNoRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLHFEQUFxRDtBQUNyRTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQSxDQUFDLEk7Ozs7Ozs7Ozs7QUMvNktxQjs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw0QkFBNEIsdUZBQXVGO0FBQ25IO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxtR0FBMEM7O0FBRXpGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFUTs7Ozs7Ozs7QUNuRVI7QUFBQTs7QUFFUTs7Ozs7Ozs7QUNGUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLDZCQUE2QjtBQUN6RCwyQkFBMkIsV0FBVztBQUN0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFlBQVk7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ1E7Ozs7Ozs7O0FDdkVSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1E7Ozs7Ozs7O0FDZFI7QUFBQTtBQUNBO0FBQ0EsZ0ZBQWdGLE1BQU07QUFDdEY7QUFDQTtBQUNBLGlCQUFpQixhQUFhO0FBQzlCO0FBQ0EsY0FBYyxFQUFFO0FBQ2hCO0FBQ0EsZUFBZSxnREFBZ0QsTUFBTSwyQ0FBMkM7QUFDaEgsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRVEiLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG4gXHR2YXIgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2sgPSB0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdID0gXHJcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHRcdGlmKHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKSBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdH0gO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuIFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XHJcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcclxuIFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QocmVxdWVzdFRpbWVvdXQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHJlcXVlc3RUaW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQgfHwgMTAwMDA7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0aWYodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcclxuIFx0XHRcdFx0cmVxdWVzdC5vcGVuKFwiR0VUXCIsIHJlcXVlc3RQYXRoLCB0cnVlKTtcclxuIFx0XHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQ7XHJcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkgcmV0dXJuO1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdC8vIHRpbWVvdXRcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyA9PT0gNDA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxyXG4gXHRcdFx0XHRcdHJlc29sdmUoKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG90aGVyIGZhaWx1cmVcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlKSB7XHJcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm47XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdFxyXG4gXHRcclxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xyXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcIjhhYzM1YjBiZWE1MTg1YWQ3YTM3XCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XHJcbiBcdFx0fTtcclxuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xyXG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInJlYWR5XCIpXHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdH0pO1xyXG4gXHRcclxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoIXVwZGF0ZSkge1xyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XHJcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XHJcbiBcdFxyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xyXG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXHJcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0aG90VXBkYXRlID0ge307XHJcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IDA7XHJcbiBcdFx0XHR7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbG9uZS1ibG9ja3NcclxuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cclxuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcclxuIFx0XHRcdHJldHVybjtcclxuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xyXG4gXHRcdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGlmKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcclxuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xyXG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XHJcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XHJcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xyXG4gXHRcdGlmKCFkZWZlcnJlZCkgcmV0dXJuO1xyXG4gXHRcdGlmKGhvdEFwcGx5T25VcGRhdGUpIHtcclxuIFx0XHRcdC8vIFdyYXAgZGVmZXJyZWQgb2JqZWN0IGluIFByb21pc2UgdG8gbWFyayBpdCBhcyBhIHdlbGwtaGFuZGxlZCBQcm9taXNlIHRvXHJcbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cclxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcclxuIFx0XHRcdFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcclxuIFx0XHRcdH0pLnRoZW4oXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdCk7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XHJcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiBcdFxyXG4gXHRcdHZhciBjYjtcclxuIFx0XHR2YXIgaTtcclxuIFx0XHR2YXIgajtcclxuIFx0XHR2YXIgbW9kdWxlO1xyXG4gXHRcdHZhciBtb2R1bGVJZDtcclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcclxuIFx0XHRcdFx0XHRpZDogaWRcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcclxuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fbWFpbikge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdGlmKCFwYXJlbnQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcclxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xyXG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFxyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXHJcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxyXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcclxuIFx0XHRcdH07XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XHJcbiBcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XHJcbiBcdFx0XHRcdGlmKGEuaW5kZXhPZihpdGVtKSA8IDApXHJcbiBcdFx0XHRcdFx0YS5wdXNoKGl0ZW0pO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcclxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XHJcbiBcdFxyXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XHJcbiBcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCIpO1xyXG4gXHRcdH07XHJcbiBcdFxyXG4gXHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcclxuIFx0XHRcdFx0dmFyIHJlc3VsdDtcclxuIFx0XHRcdFx0aWYoaG90VXBkYXRlW2lkXSkge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcclxuIFx0XHRcdFx0aWYocmVzdWx0LmNoYWluKSB7XHJcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHN3aXRjaChyZXN1bHQudHlwZSkge1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiIGluIFwiICsgcmVzdWx0LnBhcmVudElkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGlzcG9zZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGRlZmF1bHQ6XHJcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGFib3J0RXJyb3IpIHtcclxuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcclxuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9BcHBseSkge1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdFx0XHRcdGZvcihtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0Rpc3Bvc2UpIHtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxyXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiYgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcclxuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcclxuIFx0XHRcdFx0fSk7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xyXG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xyXG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdHZhciBpZHg7XHJcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XHJcbiBcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0aWYoIW1vZHVsZSkgY29udGludWU7XHJcbiBcdFxyXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcclxuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XHJcbiBcdFx0XHRcdGNiKGRhdGEpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcclxuIFx0XHJcbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxyXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcclxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXHJcbiBcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkge1xyXG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIGRlcGVuZGVuY3k7XHJcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XHJcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRcdGlmKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXHJcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XHJcbiBcdFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XHJcbiBcdFx0XHRcdFx0XHRpZihjYikge1xyXG4gXHRcdFx0XHRcdFx0XHRpZihjYWxsYmFja3MuaW5kZXhPZihjYikgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcclxuIFx0XHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XHJcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIyKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JnaW5hbEVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXHJcbiBcdFx0aWYoZXJyb3IpIHtcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XHJcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xyXG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDApKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDhhYzM1YjBiZWE1MTg1YWQ3YTM3IiwiaW1wb3J0IFNWRyBmcm9tICdzdmcuanMnXG5pbXBvcnQgeyBHQ0dyYXBoLCBkcmF3R0NHcmFwaCB9IGZyb20gJy4vZ3JhcGgnXG5pbXBvcnQgeyBHQ1Rvb2x0aXAgfSBmcm9tICcuL3Rvb2x0aXAnXG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZydcbmltcG9ydCB7IGdldEJveGVzIH0gZnJvbSAnLi9zZWVkZXInXG5cbi8vIENvbmZpZ1xuY29uc3QgeyBpZCwgdywgaCwgYnViYmxlV2lkdGggfSA9IGNvbmZpZ1xuY29uc3Qgbm93ID0gbmV3IERhdGUoKVxuY29uc3QgY3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuY29uc3QgY3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKClcblxuLy8gRGF0YVxuY29uc3QgYm94ZXMgPSBnZXRCb3hlcyhjdXJyZW50WWVhcilcblxuLy8gR3JhcGhcbmNvbnN0IGdyYXBoID0gR0NHcmFwaChpZClcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZ3JhcGgpXG5cbi8vIFRvb2x0aXBcbmNvbnN0IHRvb2x0aXAgPSBHQ1Rvb2x0aXAoYnViYmxlV2lkdGgpXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApXG5cbi8vIEluamVjdFxuZHJhd0dDR3JhcGgoXG4gIFNWRyhpZCkuc2l6ZSh3LCBoKSxcbiAgT2JqZWN0LmFzc2lnbihjb25maWcsIHtcbiAgICB0b29sdGlwLFxuICAgIGJveGVzLFxuICAgIGN1cnJlbnRZZWFyLFxuICAgIGN1cnJlbnRNb250aFxuICB9KVxuKVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyohXG4qIHN2Zy5qcyAtIEEgbGlnaHR3ZWlnaHQgbGlicmFyeSBmb3IgbWFuaXB1bGF0aW5nIGFuZCBhbmltYXRpbmcgU1ZHLlxuKiBAdmVyc2lvbiAyLjYuM1xuKiBodHRwczovL3N2Z2RvdGpzLmdpdGh1Yi5pby9cbipcbiogQGNvcHlyaWdodCBXb3V0IEZpZXJlbnMgPHdvdXRAbWljay13b3V0LmNvbT5cbiogQGxpY2Vuc2UgTUlUXG4qXG4qIEJVSUxUOiBGcmkgSnVsIDIxIDIwMTcgMTQ6NTA6MzcgR01UKzAyMDAgKE1pdHRlbGV1cm9ww6Rpc2NoZSBTb21tZXJ6ZWl0KVxuKi87XG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiBmYWN0b3J5KHJvb3QsIHJvb3QuZG9jdW1lbnQpXHJcbiAgICB9KVxyXG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJvb3QuZG9jdW1lbnQgPyBmYWN0b3J5KHJvb3QsIHJvb3QuZG9jdW1lbnQpIDogZnVuY3Rpb24odyl7IHJldHVybiBmYWN0b3J5KHcsIHcuZG9jdW1lbnQpIH1cclxuICB9IGVsc2Uge1xyXG4gICAgcm9vdC5TVkcgPSBmYWN0b3J5KHJvb3QsIHJvb3QuZG9jdW1lbnQpXHJcbiAgfVxyXG59KHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB0aGlzLCBmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50KSB7XHJcblxyXG4vLyBUaGUgbWFpbiB3cmFwcGluZyBlbGVtZW50XHJcbnZhciBTVkcgPSB0aGlzLlNWRyA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICBpZiAoU1ZHLnN1cHBvcnRlZCkge1xyXG4gICAgZWxlbWVudCA9IG5ldyBTVkcuRG9jKGVsZW1lbnQpXHJcblxyXG4gICAgaWYoIVNWRy5wYXJzZXIuZHJhdylcclxuICAgICAgU1ZHLnByZXBhcmUoKVxyXG5cclxuICAgIHJldHVybiBlbGVtZW50XHJcbiAgfVxyXG59XHJcblxyXG4vLyBEZWZhdWx0IG5hbWVzcGFjZXNcclxuU1ZHLm5zICAgID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJ1xyXG5TVkcueG1sbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nXHJcblNWRy54bGluayA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJ1xyXG5TVkcuc3ZnanMgPSAnaHR0cDovL3N2Z2pzLmNvbS9zdmdqcydcclxuXHJcbi8vIFN2ZyBzdXBwb3J0IHRlc3RcclxuU1ZHLnN1cHBvcnRlZCA9IChmdW5jdGlvbigpIHtcclxuICByZXR1cm4gISEgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmXHJcbiAgICAgICAgICEhIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkcubnMsJ3N2ZycpLmNyZWF0ZVNWR1JlY3RcclxufSkoKVxyXG5cclxuLy8gRG9uJ3QgYm90aGVyIHRvIGNvbnRpbnVlIGlmIFNWRyBpcyBub3Qgc3VwcG9ydGVkXHJcbmlmICghU1ZHLnN1cHBvcnRlZCkgcmV0dXJuIGZhbHNlXHJcblxyXG4vLyBFbGVtZW50IGlkIHNlcXVlbmNlXHJcblNWRy5kaWQgID0gMTAwMFxyXG5cclxuLy8gR2V0IG5leHQgbmFtZWQgZWxlbWVudCBpZFxyXG5TVkcuZWlkID0gZnVuY3Rpb24obmFtZSkge1xyXG4gIHJldHVybiAnU3ZnanMnICsgY2FwaXRhbGl6ZShuYW1lKSArIChTVkcuZGlkKyspXHJcbn1cclxuXHJcbi8vIE1ldGhvZCBmb3IgZWxlbWVudCBjcmVhdGlvblxyXG5TVkcuY3JlYXRlID0gZnVuY3Rpb24obmFtZSkge1xyXG4gIC8vIGNyZWF0ZSBlbGVtZW50XHJcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgbmFtZSlcclxuXHJcbiAgLy8gYXBwbHkgdW5pcXVlIGlkXHJcbiAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5laWQobmFtZSkpXHJcblxyXG4gIHJldHVybiBlbGVtZW50XHJcbn1cclxuXHJcbi8vIE1ldGhvZCBmb3IgZXh0ZW5kaW5nIG9iamVjdHNcclxuU1ZHLmV4dGVuZCA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBtb2R1bGVzLCBtZXRob2RzLCBrZXksIGlcclxuXHJcbiAgLy8gR2V0IGxpc3Qgb2YgbW9kdWxlc1xyXG4gIG1vZHVsZXMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcclxuXHJcbiAgLy8gR2V0IG9iamVjdCB3aXRoIGV4dGVuc2lvbnNcclxuICBtZXRob2RzID0gbW9kdWxlcy5wb3AoKVxyXG5cclxuICBmb3IgKGkgPSBtb2R1bGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxyXG4gICAgaWYgKG1vZHVsZXNbaV0pXHJcbiAgICAgIGZvciAoa2V5IGluIG1ldGhvZHMpXHJcbiAgICAgICAgbW9kdWxlc1tpXS5wcm90b3R5cGVba2V5XSA9IG1ldGhvZHNba2V5XVxyXG5cclxuICAvLyBNYWtlIHN1cmUgU1ZHLlNldCBpbmhlcml0cyBhbnkgbmV3bHkgYWRkZWQgbWV0aG9kc1xyXG4gIGlmIChTVkcuU2V0ICYmIFNWRy5TZXQuaW5oZXJpdClcclxuICAgIFNWRy5TZXQuaW5oZXJpdCgpXHJcbn1cclxuXHJcbi8vIEludmVudCBuZXcgZWxlbWVudFxyXG5TVkcuaW52ZW50ID0gZnVuY3Rpb24oY29uZmlnKSB7XHJcbiAgLy8gQ3JlYXRlIGVsZW1lbnQgaW5pdGlhbGl6ZXJcclxuICB2YXIgaW5pdGlhbGl6ZXIgPSB0eXBlb2YgY29uZmlnLmNyZWF0ZSA9PSAnZnVuY3Rpb24nID9cclxuICAgIGNvbmZpZy5jcmVhdGUgOlxyXG4gICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBTVkcuY3JlYXRlKGNvbmZpZy5jcmVhdGUpKVxyXG4gICAgfVxyXG5cclxuICAvLyBJbmhlcml0IHByb3RvdHlwZVxyXG4gIGlmIChjb25maWcuaW5oZXJpdClcclxuICAgIGluaXRpYWxpemVyLnByb3RvdHlwZSA9IG5ldyBjb25maWcuaW5oZXJpdFxyXG5cclxuICAvLyBFeHRlbmQgd2l0aCBtZXRob2RzXHJcbiAgaWYgKGNvbmZpZy5leHRlbmQpXHJcbiAgICBTVkcuZXh0ZW5kKGluaXRpYWxpemVyLCBjb25maWcuZXh0ZW5kKVxyXG5cclxuICAvLyBBdHRhY2ggY29uc3RydWN0IG1ldGhvZCB0byBwYXJlbnRcclxuICBpZiAoY29uZmlnLmNvbnN0cnVjdClcclxuICAgIFNWRy5leHRlbmQoY29uZmlnLnBhcmVudCB8fCBTVkcuQ29udGFpbmVyLCBjb25maWcuY29uc3RydWN0KVxyXG5cclxuICByZXR1cm4gaW5pdGlhbGl6ZXJcclxufVxyXG5cclxuLy8gQWRvcHQgZXhpc3Rpbmcgc3ZnIGVsZW1lbnRzXHJcblNWRy5hZG9wdCA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuICAvLyBjaGVjayBmb3IgcHJlc2VuY2Ugb2Ygbm9kZVxyXG4gIGlmICghbm9kZSkgcmV0dXJuIG51bGxcclxuXHJcbiAgLy8gbWFrZSBzdXJlIGEgbm9kZSBpc24ndCBhbHJlYWR5IGFkb3B0ZWRcclxuICBpZiAobm9kZS5pbnN0YW5jZSkgcmV0dXJuIG5vZGUuaW5zdGFuY2VcclxuXHJcbiAgLy8gaW5pdGlhbGl6ZSB2YXJpYWJsZXNcclxuICB2YXIgZWxlbWVudFxyXG5cclxuICAvLyBhZG9wdCB3aXRoIGVsZW1lbnQtc3BlY2lmaWMgc2V0dGluZ3NcclxuICBpZiAobm9kZS5ub2RlTmFtZSA9PSAnc3ZnJylcclxuICAgIGVsZW1lbnQgPSBub2RlLnBhcmVudE5vZGUgaW5zdGFuY2VvZiB3aW5kb3cuU1ZHRWxlbWVudCA/IG5ldyBTVkcuTmVzdGVkIDogbmV3IFNWRy5Eb2NcclxuICBlbHNlIGlmIChub2RlLm5vZGVOYW1lID09ICdsaW5lYXJHcmFkaWVudCcpXHJcbiAgICBlbGVtZW50ID0gbmV3IFNWRy5HcmFkaWVudCgnbGluZWFyJylcclxuICBlbHNlIGlmIChub2RlLm5vZGVOYW1lID09ICdyYWRpYWxHcmFkaWVudCcpXHJcbiAgICBlbGVtZW50ID0gbmV3IFNWRy5HcmFkaWVudCgncmFkaWFsJylcclxuICBlbHNlIGlmIChTVkdbY2FwaXRhbGl6ZShub2RlLm5vZGVOYW1lKV0pXHJcbiAgICBlbGVtZW50ID0gbmV3IFNWR1tjYXBpdGFsaXplKG5vZGUubm9kZU5hbWUpXVxyXG4gIGVsc2VcclxuICAgIGVsZW1lbnQgPSBuZXcgU1ZHLkVsZW1lbnQobm9kZSlcclxuXHJcbiAgLy8gZW5zdXJlIHJlZmVyZW5jZXNcclxuICBlbGVtZW50LnR5cGUgID0gbm9kZS5ub2RlTmFtZVxyXG4gIGVsZW1lbnQubm9kZSAgPSBub2RlXHJcbiAgbm9kZS5pbnN0YW5jZSA9IGVsZW1lbnRcclxuXHJcbiAgLy8gU1ZHLkNsYXNzIHNwZWNpZmljIHByZXBhcmF0aW9uc1xyXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgU1ZHLkRvYylcclxuICAgIGVsZW1lbnQubmFtZXNwYWNlKCkuZGVmcygpXHJcblxyXG4gIC8vIHB1bGwgc3ZnanMgZGF0YSBmcm9tIHRoZSBkb20gKGdldEF0dHJpYnV0ZU5TIGRvZXNuJ3Qgd29yayBpbiBodG1sNSlcclxuICBlbGVtZW50LnNldERhdGEoSlNPTi5wYXJzZShub2RlLmdldEF0dHJpYnV0ZSgnc3ZnanM6ZGF0YScpKSB8fCB7fSlcclxuXHJcbiAgcmV0dXJuIGVsZW1lbnRcclxufVxyXG5cclxuLy8gSW5pdGlhbGl6ZSBwYXJzaW5nIGVsZW1lbnRcclxuU1ZHLnByZXBhcmUgPSBmdW5jdGlvbigpIHtcclxuICAvLyBTZWxlY3QgZG9jdW1lbnQgYm9keSBhbmQgY3JlYXRlIGludmlzaWJsZSBzdmcgZWxlbWVudFxyXG4gIHZhciBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXVxyXG4gICAgLCBkcmF3ID0gKGJvZHkgPyBuZXcgU1ZHLkRvYyhib2R5KSA6IFNWRy5hZG9wdChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLm5lc3RlZCgpKS5zaXplKDIsIDApXHJcblxyXG4gIC8vIENyZWF0ZSBwYXJzZXIgb2JqZWN0XHJcbiAgU1ZHLnBhcnNlciA9IHtcclxuICAgIGJvZHk6IGJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XHJcbiAgLCBkcmF3OiBkcmF3LnN0eWxlKCdvcGFjaXR5OjA7cG9zaXRpb246YWJzb2x1dGU7bGVmdDotMTAwJTt0b3A6LTEwMCU7b3ZlcmZsb3c6aGlkZGVuJykubm9kZVxyXG4gICwgcG9seTogZHJhdy5wb2x5bGluZSgpLm5vZGVcclxuICAsIHBhdGg6IGRyYXcucGF0aCgpLm5vZGVcclxuICAsIG5hdGl2ZTogU1ZHLmNyZWF0ZSgnc3ZnJylcclxuICB9XHJcbn1cclxuXHJcblNWRy5wYXJzZXIgPSB7XHJcbiAgbmF0aXZlOiBTVkcuY3JlYXRlKCdzdmcnKVxyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgaWYoIVNWRy5wYXJzZXIuZHJhdylcclxuICAgIFNWRy5wcmVwYXJlKClcclxufSwgZmFsc2UpXHJcblxuLy8gU3RvcmFnZSBmb3IgcmVndWxhciBleHByZXNzaW9uc1xyXG5TVkcucmVnZXggPSB7XHJcbiAgLy8gUGFyc2UgdW5pdCB2YWx1ZVxyXG4gIG51bWJlckFuZFVuaXQ6ICAgIC9eKFsrLV0/KFxcZCsoXFwuXFxkKik/fFxcLlxcZCspKGVbKy1dP1xcZCspPykoW2EteiVdKikkL2lcclxuXHJcbiAgLy8gUGFyc2UgaGV4IHZhbHVlXHJcbiwgaGV4OiAgICAgICAgICAgICAgL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaVxyXG5cclxuICAvLyBQYXJzZSByZ2IgdmFsdWVcclxuLCByZ2I6ICAgICAgICAgICAgICAvcmdiXFwoKFxcZCspLChcXGQrKSwoXFxkKylcXCkvXHJcblxyXG4gIC8vIFBhcnNlIHJlZmVyZW5jZSBpZFxyXG4sIHJlZmVyZW5jZTogICAgICAgIC8jKFthLXowLTlcXC1fXSspL2lcclxuXHJcbiAgLy8gc3BsaXRzIGEgdHJhbnNmb3JtYXRpb24gY2hhaW5cclxuLCB0cmFuc2Zvcm1zOiAgICAgICAvXFwpXFxzKiw/XFxzKi9cclxuXHJcbiAgLy8gV2hpdGVzcGFjZVxyXG4sIHdoaXRlc3BhY2U6ICAgICAgIC9cXHMvZ1xyXG5cclxuICAvLyBUZXN0IGhleCB2YWx1ZVxyXG4sIGlzSGV4OiAgICAgICAgICAgIC9eI1thLWYwLTldezMsNn0kL2lcclxuXHJcbiAgLy8gVGVzdCByZ2IgdmFsdWVcclxuLCBpc1JnYjogICAgICAgICAgICAvXnJnYlxcKC9cclxuXHJcbiAgLy8gVGVzdCBjc3MgZGVjbGFyYXRpb25cclxuLCBpc0NzczogICAgICAgICAgICAvW146XSs6W147XSs7Py9cclxuXHJcbiAgLy8gVGVzdCBmb3IgYmxhbmsgc3RyaW5nXHJcbiwgaXNCbGFuazogICAgICAgICAgL14oXFxzKyk/JC9cclxuXHJcbiAgLy8gVGVzdCBmb3IgbnVtZXJpYyBzdHJpbmdcclxuLCBpc051bWJlcjogICAgICAgICAvXlsrLV0/KFxcZCsoXFwuXFxkKik/fFxcLlxcZCspKGVbKy1dP1xcZCspPyQvaVxyXG5cclxuICAvLyBUZXN0IGZvciBwZXJjZW50IHZhbHVlXHJcbiwgaXNQZXJjZW50OiAgICAgICAgL14tP1tcXGRcXC5dKyUkL1xyXG5cclxuICAvLyBUZXN0IGZvciBpbWFnZSB1cmxcclxuLCBpc0ltYWdlOiAgICAgICAgICAvXFwuKGpwZ3xqcGVnfHBuZ3xnaWZ8c3ZnKShcXD9bXj1dKy4qKT8vaVxyXG5cclxuICAvLyBzcGxpdCBhdCB3aGl0ZXNwYWNlIGFuZCBjb21tYVxyXG4sIGRlbGltaXRlcjogICAgICAgIC9bXFxzLF0rL1xyXG5cclxuICAvLyBUaGUgZm9sbG93aW5nIHJlZ2V4IGFyZSB1c2VkIHRvIHBhcnNlIHRoZSBkIGF0dHJpYnV0ZSBvZiBhIHBhdGhcclxuXHJcbiAgLy8gTWF0Y2hlcyBhbGwgaHlwaGVucyB3aGljaCBhcmUgbm90IGFmdGVyIGFuIGV4cG9uZW50XHJcbiwgaHlwaGVuOiAgICAgICAgICAgLyhbXmVdKVxcLS9naVxyXG5cclxuICAvLyBSZXBsYWNlcyBhbmQgdGVzdHMgZm9yIGFsbCBwYXRoIGxldHRlcnNcclxuLCBwYXRoTGV0dGVyczogICAgICAvW01MSFZDU1FUQVpdL2dpXHJcblxyXG4gIC8vIHllcyB3ZSBuZWVkIHRoaXMgb25lLCB0b29cclxuLCBpc1BhdGhMZXR0ZXI6ICAgICAvW01MSFZDU1FUQVpdL2lcclxuXHJcbiAgLy8gbWF0Y2hlcyAwLjE1NC4yMy40NVxyXG4sIG51bWJlcnNXaXRoRG90czogIC8oKFxcZD9cXC5cXGQrKD86ZVsrLV0/XFxkKyk/KSgoPzpcXC5cXGQrKD86ZVsrLV0/XFxkKyk/KSspKSsvZ2lcclxuXHJcbiAgLy8gbWF0Y2hlcyAuXHJcbiwgZG90czogICAgICAgICAgICAgL1xcLi9nXHJcbn1cclxuXG5TVkcudXRpbHMgPSB7XHJcbiAgLy8gTWFwIGZ1bmN0aW9uXHJcbiAgbWFwOiBmdW5jdGlvbihhcnJheSwgYmxvY2spIHtcclxuICAgIHZhciBpXHJcbiAgICAgICwgaWwgPSBhcnJheS5sZW5ndGhcclxuICAgICAgLCByZXN1bHQgPSBbXVxyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICByZXN1bHQucHVzaChibG9jayhhcnJheVtpXSkpXHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLy8gRmlsdGVyIGZ1bmN0aW9uXHJcbiwgZmlsdGVyOiBmdW5jdGlvbihhcnJheSwgYmxvY2spIHtcclxuICAgIHZhciBpXHJcbiAgICAgICwgaWwgPSBhcnJheS5sZW5ndGhcclxuICAgICAgLCByZXN1bHQgPSBbXVxyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICBpZiAoYmxvY2soYXJyYXlbaV0pKVxyXG4gICAgICAgIHJlc3VsdC5wdXNoKGFycmF5W2ldKVxyXG5cclxuICAgIHJldHVybiByZXN1bHRcclxuICB9XHJcblxyXG4gIC8vIERlZ3JlZXMgdG8gcmFkaWFuc1xyXG4sIHJhZGlhbnM6IGZ1bmN0aW9uKGQpIHtcclxuICAgIHJldHVybiBkICUgMzYwICogTWF0aC5QSSAvIDE4MFxyXG4gIH1cclxuXHJcbiAgLy8gUmFkaWFucyB0byBkZWdyZWVzXHJcbiwgZGVncmVlczogZnVuY3Rpb24ocikge1xyXG4gICAgcmV0dXJuIHIgKiAxODAgLyBNYXRoLlBJICUgMzYwXHJcbiAgfVxyXG5cclxuLCBmaWx0ZXJTVkdFbGVtZW50czogZnVuY3Rpb24obm9kZXMpIHtcclxuICAgIHJldHVybiB0aGlzLmZpbHRlciggbm9kZXMsIGZ1bmN0aW9uKGVsKSB7IHJldHVybiBlbCBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50IH0pXHJcbiAgfVxyXG5cclxufVxuXHJcblNWRy5kZWZhdWx0cyA9IHtcclxuICAvLyBEZWZhdWx0IGF0dHJpYnV0ZSB2YWx1ZXNcclxuICBhdHRyczoge1xyXG4gICAgLy8gZmlsbCBhbmQgc3Ryb2tlXHJcbiAgICAnZmlsbC1vcGFjaXR5JzogICAgIDFcclxuICAsICdzdHJva2Utb3BhY2l0eSc6ICAgMVxyXG4gICwgJ3N0cm9rZS13aWR0aCc6ICAgICAwXHJcbiAgLCAnc3Ryb2tlLWxpbmVqb2luJzogICdtaXRlcidcclxuICAsICdzdHJva2UtbGluZWNhcCc6ICAgJ2J1dHQnXHJcbiAgLCBmaWxsOiAgICAgICAgICAgICAgICcjMDAwMDAwJ1xyXG4gICwgc3Ryb2tlOiAgICAgICAgICAgICAnIzAwMDAwMCdcclxuICAsIG9wYWNpdHk6ICAgICAgICAgICAgMVxyXG4gICAgLy8gcG9zaXRpb25cclxuICAsIHg6ICAgICAgICAgICAgICAgICAgMFxyXG4gICwgeTogICAgICAgICAgICAgICAgICAwXHJcbiAgLCBjeDogICAgICAgICAgICAgICAgIDBcclxuICAsIGN5OiAgICAgICAgICAgICAgICAgMFxyXG4gICAgLy8gc2l6ZVxyXG4gICwgd2lkdGg6ICAgICAgICAgICAgICAwXHJcbiAgLCBoZWlnaHQ6ICAgICAgICAgICAgIDBcclxuICAgIC8vIHJhZGl1c1xyXG4gICwgcjogICAgICAgICAgICAgICAgICAwXHJcbiAgLCByeDogICAgICAgICAgICAgICAgIDBcclxuICAsIHJ5OiAgICAgICAgICAgICAgICAgMFxyXG4gICAgLy8gZ3JhZGllbnRcclxuICAsIG9mZnNldDogICAgICAgICAgICAgMFxyXG4gICwgJ3N0b3Atb3BhY2l0eSc6ICAgICAxXHJcbiAgLCAnc3RvcC1jb2xvcic6ICAgICAgICcjMDAwMDAwJ1xyXG4gICAgLy8gdGV4dFxyXG4gICwgJ2ZvbnQtc2l6ZSc6ICAgICAgICAxNlxyXG4gICwgJ2ZvbnQtZmFtaWx5JzogICAgICAnSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcclxuICAsICd0ZXh0LWFuY2hvcic6ICAgICAgJ3N0YXJ0J1xyXG4gIH1cclxuXHJcbn1cbi8vIE1vZHVsZSBmb3IgY29sb3IgY29udmVydGlvbnNcclxuU1ZHLkNvbG9yID0gZnVuY3Rpb24oY29sb3IpIHtcclxuICB2YXIgbWF0Y2hcclxuXHJcbiAgLy8gaW5pdGlhbGl6ZSBkZWZhdWx0c1xyXG4gIHRoaXMuciA9IDBcclxuICB0aGlzLmcgPSAwXHJcbiAgdGhpcy5iID0gMFxyXG5cclxuICBpZighY29sb3IpIHJldHVyblxyXG5cclxuICAvLyBwYXJzZSBjb2xvclxyXG4gIGlmICh0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnKSB7XHJcbiAgICBpZiAoU1ZHLnJlZ2V4LmlzUmdiLnRlc3QoY29sb3IpKSB7XHJcbiAgICAgIC8vIGdldCByZ2IgdmFsdWVzXHJcbiAgICAgIG1hdGNoID0gU1ZHLnJlZ2V4LnJnYi5leGVjKGNvbG9yLnJlcGxhY2UoU1ZHLnJlZ2V4LndoaXRlc3BhY2UsJycpKVxyXG5cclxuICAgICAgLy8gcGFyc2UgbnVtZXJpYyB2YWx1ZXNcclxuICAgICAgdGhpcy5yID0gcGFyc2VJbnQobWF0Y2hbMV0pXHJcbiAgICAgIHRoaXMuZyA9IHBhcnNlSW50KG1hdGNoWzJdKVxyXG4gICAgICB0aGlzLmIgPSBwYXJzZUludChtYXRjaFszXSlcclxuXHJcbiAgICB9IGVsc2UgaWYgKFNWRy5yZWdleC5pc0hleC50ZXN0KGNvbG9yKSkge1xyXG4gICAgICAvLyBnZXQgaGV4IHZhbHVlc1xyXG4gICAgICBtYXRjaCA9IFNWRy5yZWdleC5oZXguZXhlYyhmdWxsSGV4KGNvbG9yKSlcclxuXHJcbiAgICAgIC8vIHBhcnNlIG51bWVyaWMgdmFsdWVzXHJcbiAgICAgIHRoaXMuciA9IHBhcnNlSW50KG1hdGNoWzFdLCAxNilcclxuICAgICAgdGhpcy5nID0gcGFyc2VJbnQobWF0Y2hbMl0sIDE2KVxyXG4gICAgICB0aGlzLmIgPSBwYXJzZUludChtYXRjaFszXSwgMTYpXHJcblxyXG4gICAgfVxyXG5cclxuICB9IGVsc2UgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ29iamVjdCcpIHtcclxuICAgIHRoaXMuciA9IGNvbG9yLnJcclxuICAgIHRoaXMuZyA9IGNvbG9yLmdcclxuICAgIHRoaXMuYiA9IGNvbG9yLmJcclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuQ29sb3IsIHtcclxuICAvLyBEZWZhdWx0IHRvIGhleCBjb252ZXJzaW9uXHJcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudG9IZXgoKVxyXG4gIH1cclxuICAvLyBCdWlsZCBoZXggdmFsdWVcclxuLCB0b0hleDogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gJyMnXHJcbiAgICAgICsgY29tcFRvSGV4KHRoaXMucilcclxuICAgICAgKyBjb21wVG9IZXgodGhpcy5nKVxyXG4gICAgICArIGNvbXBUb0hleCh0aGlzLmIpXHJcbiAgfVxyXG4gIC8vIEJ1aWxkIHJnYiB2YWx1ZVxyXG4sIHRvUmdiOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiAncmdiKCcgKyBbdGhpcy5yLCB0aGlzLmcsIHRoaXMuYl0uam9pbigpICsgJyknXHJcbiAgfVxyXG4gIC8vIENhbGN1bGF0ZSB0cnVlIGJyaWdodG5lc3NcclxuLCBicmlnaHRuZXNzOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiAodGhpcy5yIC8gMjU1ICogMC4zMClcclxuICAgICAgICAgKyAodGhpcy5nIC8gMjU1ICogMC41OSlcclxuICAgICAgICAgKyAodGhpcy5iIC8gMjU1ICogMC4xMSlcclxuICB9XHJcbiAgLy8gTWFrZSBjb2xvciBtb3JwaGFibGVcclxuLCBtb3JwaDogZnVuY3Rpb24oY29sb3IpIHtcclxuICAgIHRoaXMuZGVzdGluYXRpb24gPSBuZXcgU1ZHLkNvbG9yKGNvbG9yKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIC8vIEdldCBtb3JwaGVkIGNvbG9yIGF0IGdpdmVuIHBvc2l0aW9uXHJcbiwgYXQ6IGZ1bmN0aW9uKHBvcykge1xyXG4gICAgLy8gbWFrZSBzdXJlIGEgZGVzdGluYXRpb24gaXMgZGVmaW5lZFxyXG4gICAgaWYgKCF0aGlzLmRlc3RpbmF0aW9uKSByZXR1cm4gdGhpc1xyXG5cclxuICAgIC8vIG5vcm1hbGlzZSBwb3NcclxuICAgIHBvcyA9IHBvcyA8IDAgPyAwIDogcG9zID4gMSA/IDEgOiBwb3NcclxuXHJcbiAgICAvLyBnZW5lcmF0ZSBtb3JwaGVkIGNvbG9yXHJcbiAgICByZXR1cm4gbmV3IFNWRy5Db2xvcih7XHJcbiAgICAgIHI6IH5+KHRoaXMuciArICh0aGlzLmRlc3RpbmF0aW9uLnIgLSB0aGlzLnIpICogcG9zKVxyXG4gICAgLCBnOiB+fih0aGlzLmcgKyAodGhpcy5kZXN0aW5hdGlvbi5nIC0gdGhpcy5nKSAqIHBvcylcclxuICAgICwgYjogfn4odGhpcy5iICsgKHRoaXMuZGVzdGluYXRpb24uYiAtIHRoaXMuYikgKiBwb3MpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG4vLyBUZXN0ZXJzXHJcblxyXG4vLyBUZXN0IGlmIGdpdmVuIHZhbHVlIGlzIGEgY29sb3Igc3RyaW5nXHJcblNWRy5Db2xvci50ZXN0ID0gZnVuY3Rpb24oY29sb3IpIHtcclxuICBjb2xvciArPSAnJ1xyXG4gIHJldHVybiBTVkcucmVnZXguaXNIZXgudGVzdChjb2xvcilcclxuICAgICAgfHwgU1ZHLnJlZ2V4LmlzUmdiLnRlc3QoY29sb3IpXHJcbn1cclxuXHJcbi8vIFRlc3QgaWYgZ2l2ZW4gdmFsdWUgaXMgYSByZ2Igb2JqZWN0XHJcblNWRy5Db2xvci5pc1JnYiA9IGZ1bmN0aW9uKGNvbG9yKSB7XHJcbiAgcmV0dXJuIGNvbG9yICYmIHR5cGVvZiBjb2xvci5yID09ICdudW1iZXInXHJcbiAgICAgICAgICAgICAgICYmIHR5cGVvZiBjb2xvci5nID09ICdudW1iZXInXHJcbiAgICAgICAgICAgICAgICYmIHR5cGVvZiBjb2xvci5iID09ICdudW1iZXInXHJcbn1cclxuXHJcbi8vIFRlc3QgaWYgZ2l2ZW4gdmFsdWUgaXMgYSBjb2xvclxyXG5TVkcuQ29sb3IuaXNDb2xvciA9IGZ1bmN0aW9uKGNvbG9yKSB7XHJcbiAgcmV0dXJuIFNWRy5Db2xvci5pc1JnYihjb2xvcikgfHwgU1ZHLkNvbG9yLnRlc3QoY29sb3IpXHJcbn1cbi8vIE1vZHVsZSBmb3IgYXJyYXkgY29udmVyc2lvblxyXG5TVkcuQXJyYXkgPSBmdW5jdGlvbihhcnJheSwgZmFsbGJhY2spIHtcclxuICBhcnJheSA9IChhcnJheSB8fCBbXSkudmFsdWVPZigpXHJcblxyXG4gIC8vIGlmIGFycmF5IGlzIGVtcHR5IGFuZCBmYWxsYmFjayBpcyBwcm92aWRlZCwgdXNlIGZhbGxiYWNrXHJcbiAgaWYgKGFycmF5Lmxlbmd0aCA9PSAwICYmIGZhbGxiYWNrKVxyXG4gICAgYXJyYXkgPSBmYWxsYmFjay52YWx1ZU9mKClcclxuXHJcbiAgLy8gcGFyc2UgYXJyYXlcclxuICB0aGlzLnZhbHVlID0gdGhpcy5wYXJzZShhcnJheSlcclxufVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuQXJyYXksIHtcclxuICAvLyBNYWtlIGFycmF5IG1vcnBoYWJsZVxyXG4gIG1vcnBoOiBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgdGhpcy5kZXN0aW5hdGlvbiA9IHRoaXMucGFyc2UoYXJyYXkpXHJcblxyXG4gICAgLy8gbm9ybWFsaXplIGxlbmd0aCBvZiBhcnJheXNcclxuICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCAhPSB0aGlzLmRlc3RpbmF0aW9uLmxlbmd0aCkge1xyXG4gICAgICB2YXIgbGFzdFZhbHVlICAgICAgID0gdGhpcy52YWx1ZVt0aGlzLnZhbHVlLmxlbmd0aCAtIDFdXHJcbiAgICAgICAgLCBsYXN0RGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uW3RoaXMuZGVzdGluYXRpb24ubGVuZ3RoIC0gMV1cclxuXHJcbiAgICAgIHdoaWxlKHRoaXMudmFsdWUubGVuZ3RoID4gdGhpcy5kZXN0aW5hdGlvbi5sZW5ndGgpXHJcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5wdXNoKGxhc3REZXN0aW5hdGlvbilcclxuICAgICAgd2hpbGUodGhpcy52YWx1ZS5sZW5ndGggPCB0aGlzLmRlc3RpbmF0aW9uLmxlbmd0aClcclxuICAgICAgICB0aGlzLnZhbHVlLnB1c2gobGFzdFZhbHVlKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIC8vIENsZWFuIHVwIGFueSBkdXBsaWNhdGUgcG9pbnRzXHJcbiwgc2V0dGxlOiBmdW5jdGlvbigpIHtcclxuICAgIC8vIGZpbmQgYWxsIHVuaXF1ZSB2YWx1ZXNcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMudmFsdWUubGVuZ3RoLCBzZWVuID0gW107IGkgPCBpbDsgaSsrKVxyXG4gICAgICBpZiAoc2Vlbi5pbmRleE9mKHRoaXMudmFsdWVbaV0pID09IC0xKVxyXG4gICAgICAgIHNlZW4ucHVzaCh0aGlzLnZhbHVlW2ldKVxyXG5cclxuICAgIC8vIHNldCBuZXcgdmFsdWVcclxuICAgIHJldHVybiB0aGlzLnZhbHVlID0gc2VlblxyXG4gIH1cclxuICAvLyBHZXQgbW9ycGhlZCBhcnJheSBhdCBnaXZlbiBwb3NpdGlvblxyXG4sIGF0OiBmdW5jdGlvbihwb3MpIHtcclxuICAgIC8vIG1ha2Ugc3VyZSBhIGRlc3RpbmF0aW9uIGlzIGRlZmluZWRcclxuICAgIGlmICghdGhpcy5kZXN0aW5hdGlvbikgcmV0dXJuIHRoaXNcclxuXHJcbiAgICAvLyBnZW5lcmF0ZSBtb3JwaGVkIGFycmF5XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSB0aGlzLnZhbHVlLmxlbmd0aCwgYXJyYXkgPSBbXTsgaSA8IGlsOyBpKyspXHJcbiAgICAgIGFycmF5LnB1c2godGhpcy52YWx1ZVtpXSArICh0aGlzLmRlc3RpbmF0aW9uW2ldIC0gdGhpcy52YWx1ZVtpXSkgKiBwb3MpXHJcblxyXG4gICAgcmV0dXJuIG5ldyBTVkcuQXJyYXkoYXJyYXkpXHJcbiAgfVxyXG4gIC8vIENvbnZlcnQgYXJyYXkgdG8gc3RyaW5nXHJcbiwgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWUuam9pbignICcpXHJcbiAgfVxyXG4gIC8vIFJlYWwgdmFsdWVcclxuLCB2YWx1ZU9mOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlXHJcbiAgfVxyXG4gIC8vIFBhcnNlIHdoaXRlc3BhY2Ugc2VwYXJhdGVkIHN0cmluZ1xyXG4sIHBhcnNlOiBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgYXJyYXkgPSBhcnJheS52YWx1ZU9mKClcclxuXHJcbiAgICAvLyBpZiBhbHJlYWR5IGlzIGFuIGFycmF5LCBubyBuZWVkIHRvIHBhcnNlIGl0XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcnJheSkpIHJldHVybiBhcnJheVxyXG5cclxuICAgIHJldHVybiB0aGlzLnNwbGl0KGFycmF5KVxyXG4gIH1cclxuICAvLyBTdHJpcCB1bm5lY2Vzc2FyeSB3aGl0ZXNwYWNlXHJcbiwgc3BsaXQ6IGZ1bmN0aW9uKHN0cmluZykge1xyXG4gICAgcmV0dXJuIHN0cmluZy50cmltKCkuc3BsaXQoU1ZHLnJlZ2V4LmRlbGltaXRlcikubWFwKHBhcnNlRmxvYXQpXHJcbiAgfVxyXG4gIC8vIFJldmVyc2UgYXJyYXlcclxuLCByZXZlcnNlOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMudmFsdWUucmV2ZXJzZSgpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiwgY2xvbmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGNsb25lID0gbmV3IHRoaXMuY29uc3RydWN0b3IoKVxyXG4gICAgY2xvbmUudmFsdWUgPSBhcnJheV9jbG9uZSh0aGlzLnZhbHVlKVxyXG4gICAgcmV0dXJuIGNsb25lXHJcbiAgfVxyXG59KVxuLy8gUG9seSBwb2ludHMgYXJyYXlcclxuU1ZHLlBvaW50QXJyYXkgPSBmdW5jdGlvbihhcnJheSwgZmFsbGJhY2spIHtcclxuICBTVkcuQXJyYXkuY2FsbCh0aGlzLCBhcnJheSwgZmFsbGJhY2sgfHwgW1swLDBdXSlcclxufVxyXG5cclxuLy8gSW5oZXJpdCBmcm9tIFNWRy5BcnJheVxyXG5TVkcuUG9pbnRBcnJheS5wcm90b3R5cGUgPSBuZXcgU1ZHLkFycmF5XHJcblNWRy5Qb2ludEFycmF5LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNWRy5Qb2ludEFycmF5XHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5Qb2ludEFycmF5LCB7XHJcbiAgLy8gQ29udmVydCBhcnJheSB0byBzdHJpbmdcclxuICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBjb252ZXJ0IHRvIGEgcG9seSBwb2ludCBzdHJpbmdcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMudmFsdWUubGVuZ3RoLCBhcnJheSA9IFtdOyBpIDwgaWw7IGkrKylcclxuICAgICAgYXJyYXkucHVzaCh0aGlzLnZhbHVlW2ldLmpvaW4oJywnKSlcclxuXHJcbiAgICByZXR1cm4gYXJyYXkuam9pbignICcpXHJcbiAgfVxyXG4gIC8vIENvbnZlcnQgYXJyYXkgdG8gbGluZSBvYmplY3RcclxuLCB0b0xpbmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDE6IHRoaXMudmFsdWVbMF1bMF1cclxuICAgICwgeTE6IHRoaXMudmFsdWVbMF1bMV1cclxuICAgICwgeDI6IHRoaXMudmFsdWVbMV1bMF1cclxuICAgICwgeTI6IHRoaXMudmFsdWVbMV1bMV1cclxuICAgIH1cclxuICB9XHJcbiAgLy8gR2V0IG1vcnBoZWQgYXJyYXkgYXQgZ2l2ZW4gcG9zaXRpb25cclxuLCBhdDogZnVuY3Rpb24ocG9zKSB7XHJcbiAgICAvLyBtYWtlIHN1cmUgYSBkZXN0aW5hdGlvbiBpcyBkZWZpbmVkXHJcbiAgICBpZiAoIXRoaXMuZGVzdGluYXRpb24pIHJldHVybiB0aGlzXHJcblxyXG4gICAgLy8gZ2VuZXJhdGUgbW9ycGhlZCBwb2ludCBzdHJpbmdcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMudmFsdWUubGVuZ3RoLCBhcnJheSA9IFtdOyBpIDwgaWw7IGkrKylcclxuICAgICAgYXJyYXkucHVzaChbXHJcbiAgICAgICAgdGhpcy52YWx1ZVtpXVswXSArICh0aGlzLmRlc3RpbmF0aW9uW2ldWzBdIC0gdGhpcy52YWx1ZVtpXVswXSkgKiBwb3NcclxuICAgICAgLCB0aGlzLnZhbHVlW2ldWzFdICsgKHRoaXMuZGVzdGluYXRpb25baV1bMV0gLSB0aGlzLnZhbHVlW2ldWzFdKSAqIHBvc1xyXG4gICAgICBdKVxyXG5cclxuICAgIHJldHVybiBuZXcgU1ZHLlBvaW50QXJyYXkoYXJyYXkpXHJcbiAgfVxyXG4gIC8vIFBhcnNlIHBvaW50IHN0cmluZyBhbmQgZmxhdCBhcnJheVxyXG4sIHBhcnNlOiBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgdmFyIHBvaW50cyA9IFtdXHJcblxyXG4gICAgYXJyYXkgPSBhcnJheS52YWx1ZU9mKClcclxuXHJcbiAgICAvLyBpZiBpdCBpcyBhbiBhcnJheVxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyYXkpKSB7XHJcbiAgICAgIC8vIGFuZCBpdCBpcyBub3QgZmxhdCwgdGhlcmUgaXMgbm8gbmVlZCB0byBwYXJzZSBpdFxyXG4gICAgICBpZihBcnJheS5pc0FycmF5KGFycmF5WzBdKSkge1xyXG4gICAgICAgIHJldHVybiBhcnJheVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgeyAvLyBFbHNlLCBpdCBpcyBjb25zaWRlcmVkIGFzIGEgc3RyaW5nXHJcbiAgICAgIC8vIHBhcnNlIHBvaW50c1xyXG4gICAgICBhcnJheSA9IGFycmF5LnRyaW0oKS5zcGxpdChTVkcucmVnZXguZGVsaW1pdGVyKS5tYXAocGFyc2VGbG9hdClcclxuICAgIH1cclxuXHJcbiAgICAvLyB2YWxpZGF0ZSBwb2ludHMgLSBodHRwczovL3N2Z3dnLm9yZy9zdmcyLWRyYWZ0L3NoYXBlcy5odG1sI0RhdGFUeXBlUG9pbnRzXHJcbiAgICAvLyBPZGQgbnVtYmVyIG9mIGNvb3JkaW5hdGVzIGlzIGFuIGVycm9yLiBJbiBzdWNoIGNhc2VzLCBkcm9wIHRoZSBsYXN0IG9kZCBjb29yZGluYXRlLlxyXG4gICAgaWYgKGFycmF5Lmxlbmd0aCAlIDIgIT09IDApIGFycmF5LnBvcCgpXHJcblxyXG4gICAgLy8gd3JhcCBwb2ludHMgaW4gdHdvLXR1cGxlcyBhbmQgcGFyc2UgcG9pbnRzIGFzIGZsb2F0c1xyXG4gICAgZm9yKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpID0gaSArIDIpXHJcbiAgICAgIHBvaW50cy5wdXNoKFsgYXJyYXlbaV0sIGFycmF5W2krMV0gXSlcclxuXHJcbiAgICByZXR1cm4gcG9pbnRzXHJcbiAgfVxyXG4gIC8vIE1vdmUgcG9pbnQgc3RyaW5nXHJcbiwgbW92ZTogZnVuY3Rpb24oeCwgeSkge1xyXG4gICAgdmFyIGJveCA9IHRoaXMuYmJveCgpXHJcblxyXG4gICAgLy8gZ2V0IHJlbGF0aXZlIG9mZnNldFxyXG4gICAgeCAtPSBib3gueFxyXG4gICAgeSAtPSBib3gueVxyXG5cclxuICAgIC8vIG1vdmUgZXZlcnkgcG9pbnRcclxuICAgIGlmICghaXNOYU4oeCkgJiYgIWlzTmFOKHkpKVxyXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy52YWx1ZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcclxuICAgICAgICB0aGlzLnZhbHVlW2ldID0gW3RoaXMudmFsdWVbaV1bMF0gKyB4LCB0aGlzLnZhbHVlW2ldWzFdICsgeV1cclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBSZXNpemUgcG9seSBzdHJpbmdcclxuLCBzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICB2YXIgaSwgYm94ID0gdGhpcy5iYm94KClcclxuXHJcbiAgICAvLyByZWNhbGN1bGF0ZSBwb3NpdGlvbiBvZiBhbGwgcG9pbnRzIGFjY29yZGluZyB0byBuZXcgc2l6ZVxyXG4gICAgZm9yIChpID0gdGhpcy52YWx1ZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICBpZihib3gud2lkdGgpIHRoaXMudmFsdWVbaV1bMF0gPSAoKHRoaXMudmFsdWVbaV1bMF0gLSBib3gueCkgKiB3aWR0aCkgIC8gYm94LndpZHRoICArIGJveC54XHJcbiAgICAgIGlmKGJveC5oZWlnaHQpIHRoaXMudmFsdWVbaV1bMV0gPSAoKHRoaXMudmFsdWVbaV1bMV0gLSBib3gueSkgKiBoZWlnaHQpIC8gYm94LmhlaWdodCArIGJveC55XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gR2V0IGJvdW5kaW5nIGJveCBvZiBwb2ludHNcclxuLCBiYm94OiBmdW5jdGlvbigpIHtcclxuICAgIFNWRy5wYXJzZXIucG9seS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIHRoaXMudG9TdHJpbmcoKSlcclxuXHJcbiAgICByZXR1cm4gU1ZHLnBhcnNlci5wb2x5LmdldEJCb3goKVxyXG4gIH1cclxufSlcclxuXG52YXIgcGF0aEhhbmRsZXJzID0ge1xyXG4gIE06IGZ1bmN0aW9uKGMsIHAsIHAwKSB7XHJcbiAgICBwLnggPSBwMC54ID0gY1swXVxyXG4gICAgcC55ID0gcDAueSA9IGNbMV1cclxuXHJcbiAgICByZXR1cm4gWydNJywgcC54LCBwLnldXHJcbiAgfSxcclxuICBMOiBmdW5jdGlvbihjLCBwKSB7XHJcbiAgICBwLnggPSBjWzBdXHJcbiAgICBwLnkgPSBjWzFdXHJcbiAgICByZXR1cm4gWydMJywgY1swXSwgY1sxXV1cclxuICB9LFxyXG4gIEg6IGZ1bmN0aW9uKGMsIHApIHtcclxuICAgIHAueCA9IGNbMF1cclxuICAgIHJldHVybiBbJ0gnLCBjWzBdXVxyXG4gIH0sXHJcbiAgVjogZnVuY3Rpb24oYywgcCkge1xyXG4gICAgcC55ID0gY1swXVxyXG4gICAgcmV0dXJuIFsnVicsIGNbMF1dXHJcbiAgfSxcclxuICBDOiBmdW5jdGlvbihjLCBwKSB7XHJcbiAgICBwLnggPSBjWzRdXHJcbiAgICBwLnkgPSBjWzVdXHJcbiAgICByZXR1cm4gWydDJywgY1swXSwgY1sxXSwgY1syXSwgY1szXSwgY1s0XSwgY1s1XV1cclxuICB9LFxyXG4gIFM6IGZ1bmN0aW9uKGMsIHApIHtcclxuICAgIHAueCA9IGNbMl1cclxuICAgIHAueSA9IGNbM11cclxuICAgIHJldHVybiBbJ1MnLCBjWzBdLCBjWzFdLCBjWzJdLCBjWzNdXVxyXG4gIH0sXHJcbiAgUTogZnVuY3Rpb24oYywgcCkge1xyXG4gICAgcC54ID0gY1syXVxyXG4gICAgcC55ID0gY1szXVxyXG4gICAgcmV0dXJuIFsnUScsIGNbMF0sIGNbMV0sIGNbMl0sIGNbM11dXHJcbiAgfSxcclxuICBUOiBmdW5jdGlvbihjLCBwKSB7XHJcbiAgICBwLnggPSBjWzBdXHJcbiAgICBwLnkgPSBjWzFdXHJcbiAgICByZXR1cm4gWydUJywgY1swXSwgY1sxXV1cclxuICB9LFxyXG4gIFo6IGZ1bmN0aW9uKGMsIHAsIHAwKSB7XHJcbiAgICBwLnggPSBwMC54XHJcbiAgICBwLnkgPSBwMC55XHJcbiAgICByZXR1cm4gWydaJ11cclxuICB9LFxyXG4gIEE6IGZ1bmN0aW9uKGMsIHApIHtcclxuICAgIHAueCA9IGNbNV1cclxuICAgIHAueSA9IGNbNl1cclxuICAgIHJldHVybiBbJ0EnLCBjWzBdLCBjWzFdLCBjWzJdLCBjWzNdLCBjWzRdLCBjWzVdLCBjWzZdXVxyXG4gIH1cclxufVxyXG5cclxudmFyIG1saHZxdGNzYSA9ICdtbGh2cXRjc2F6Jy5zcGxpdCgnJylcclxuXHJcbmZvcih2YXIgaSA9IDAsIGlsID0gbWxodnF0Y3NhLmxlbmd0aDsgaSA8IGlsOyArK2kpe1xyXG4gIHBhdGhIYW5kbGVyc1ttbGh2cXRjc2FbaV1dID0gKGZ1bmN0aW9uKGkpe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGMsIHAsIHAwKSB7XHJcbiAgICAgIGlmKGkgPT0gJ0gnKSBjWzBdID0gY1swXSArIHAueFxyXG4gICAgICBlbHNlIGlmKGkgPT0gJ1YnKSBjWzBdID0gY1swXSArIHAueVxyXG4gICAgICBlbHNlIGlmKGkgPT0gJ0EnKXtcclxuICAgICAgICBjWzVdID0gY1s1XSArIHAueCxcclxuICAgICAgICBjWzZdID0gY1s2XSArIHAueVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBmb3IodmFyIGogPSAwLCBqbCA9IGMubGVuZ3RoOyBqIDwgamw7ICsraikge1xyXG4gICAgICAgICAgY1tqXSA9IGNbal0gKyAoaiUyID8gcC55IDogcC54KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwYXRoSGFuZGxlcnNbaV0oYywgcCwgcDApXHJcbiAgICB9XHJcbiAgfSkobWxodnF0Y3NhW2ldLnRvVXBwZXJDYXNlKCkpXHJcbn1cclxuXHJcbi8vIFBhdGggcG9pbnRzIGFycmF5XHJcblNWRy5QYXRoQXJyYXkgPSBmdW5jdGlvbihhcnJheSwgZmFsbGJhY2spIHtcclxuICBTVkcuQXJyYXkuY2FsbCh0aGlzLCBhcnJheSwgZmFsbGJhY2sgfHwgW1snTScsIDAsIDBdXSlcclxufVxyXG5cclxuLy8gSW5oZXJpdCBmcm9tIFNWRy5BcnJheVxyXG5TVkcuUGF0aEFycmF5LnByb3RvdHlwZSA9IG5ldyBTVkcuQXJyYXlcclxuU1ZHLlBhdGhBcnJheS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTVkcuUGF0aEFycmF5XHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5QYXRoQXJyYXksIHtcclxuICAvLyBDb252ZXJ0IGFycmF5IHRvIHN0cmluZ1xyXG4gIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBhcnJheVRvU3RyaW5nKHRoaXMudmFsdWUpXHJcbiAgfVxyXG4gIC8vIE1vdmUgcGF0aCBzdHJpbmdcclxuLCBtb3ZlOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICAvLyBnZXQgYm91bmRpbmcgYm94IG9mIGN1cnJlbnQgc2l0dWF0aW9uXHJcbiAgICB2YXIgYm94ID0gdGhpcy5iYm94KClcclxuXHJcbiAgICAvLyBnZXQgcmVsYXRpdmUgb2Zmc2V0XHJcbiAgICB4IC09IGJveC54XHJcbiAgICB5IC09IGJveC55XHJcblxyXG4gICAgaWYgKCFpc05hTih4KSAmJiAhaXNOYU4oeSkpIHtcclxuICAgICAgLy8gbW92ZSBldmVyeSBwb2ludFxyXG4gICAgICBmb3IgKHZhciBsLCBpID0gdGhpcy52YWx1ZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIGwgPSB0aGlzLnZhbHVlW2ldWzBdXHJcblxyXG4gICAgICAgIGlmIChsID09ICdNJyB8fCBsID09ICdMJyB8fCBsID09ICdUJykgIHtcclxuICAgICAgICAgIHRoaXMudmFsdWVbaV1bMV0gKz0geFxyXG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVsyXSArPSB5XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAobCA9PSAnSCcpICB7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlW2ldWzFdICs9IHhcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChsID09ICdWJykgIHtcclxuICAgICAgICAgIHRoaXMudmFsdWVbaV1bMV0gKz0geVxyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKGwgPT0gJ0MnIHx8IGwgPT0gJ1MnIHx8IGwgPT0gJ1EnKSAge1xyXG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVsxXSArPSB4XHJcbiAgICAgICAgICB0aGlzLnZhbHVlW2ldWzJdICs9IHlcclxuICAgICAgICAgIHRoaXMudmFsdWVbaV1bM10gKz0geFxyXG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVs0XSArPSB5XHJcblxyXG4gICAgICAgICAgaWYgKGwgPT0gJ0MnKSAge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlW2ldWzVdICs9IHhcclxuICAgICAgICAgICAgdGhpcy52YWx1ZVtpXVs2XSArPSB5XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAobCA9PSAnQScpICB7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlW2ldWzZdICs9IHhcclxuICAgICAgICAgIHRoaXMudmFsdWVbaV1bN10gKz0geVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBSZXNpemUgcGF0aCBzdHJpbmdcclxuLCBzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAvLyBnZXQgYm91bmRpbmcgYm94IG9mIGN1cnJlbnQgc2l0dWF0aW9uXHJcbiAgICB2YXIgaSwgbCwgYm94ID0gdGhpcy5iYm94KClcclxuXHJcbiAgICAvLyByZWNhbGN1bGF0ZSBwb3NpdGlvbiBvZiBhbGwgcG9pbnRzIGFjY29yZGluZyB0byBuZXcgc2l6ZVxyXG4gICAgZm9yIChpID0gdGhpcy52YWx1ZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICBsID0gdGhpcy52YWx1ZVtpXVswXVxyXG5cclxuICAgICAgaWYgKGwgPT0gJ00nIHx8IGwgPT0gJ0wnIHx8IGwgPT0gJ1QnKSAge1xyXG4gICAgICAgIHRoaXMudmFsdWVbaV1bMV0gPSAoKHRoaXMudmFsdWVbaV1bMV0gLSBib3gueCkgKiB3aWR0aCkgIC8gYm94LndpZHRoICArIGJveC54XHJcbiAgICAgICAgdGhpcy52YWx1ZVtpXVsyXSA9ICgodGhpcy52YWx1ZVtpXVsyXSAtIGJveC55KSAqIGhlaWdodCkgLyBib3guaGVpZ2h0ICsgYm94LnlcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAobCA9PSAnSCcpICB7XHJcbiAgICAgICAgdGhpcy52YWx1ZVtpXVsxXSA9ICgodGhpcy52YWx1ZVtpXVsxXSAtIGJveC54KSAqIHdpZHRoKSAgLyBib3gud2lkdGggICsgYm94LnhcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAobCA9PSAnVicpICB7XHJcbiAgICAgICAgdGhpcy52YWx1ZVtpXVsxXSA9ICgodGhpcy52YWx1ZVtpXVsxXSAtIGJveC55KSAqIGhlaWdodCkgLyBib3guaGVpZ2h0ICsgYm94LnlcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAobCA9PSAnQycgfHwgbCA9PSAnUycgfHwgbCA9PSAnUScpICB7XHJcbiAgICAgICAgdGhpcy52YWx1ZVtpXVsxXSA9ICgodGhpcy52YWx1ZVtpXVsxXSAtIGJveC54KSAqIHdpZHRoKSAgLyBib3gud2lkdGggICsgYm94LnhcclxuICAgICAgICB0aGlzLnZhbHVlW2ldWzJdID0gKCh0aGlzLnZhbHVlW2ldWzJdIC0gYm94LnkpICogaGVpZ2h0KSAvIGJveC5oZWlnaHQgKyBib3gueVxyXG4gICAgICAgIHRoaXMudmFsdWVbaV1bM10gPSAoKHRoaXMudmFsdWVbaV1bM10gLSBib3gueCkgKiB3aWR0aCkgIC8gYm94LndpZHRoICArIGJveC54XHJcbiAgICAgICAgdGhpcy52YWx1ZVtpXVs0XSA9ICgodGhpcy52YWx1ZVtpXVs0XSAtIGJveC55KSAqIGhlaWdodCkgLyBib3guaGVpZ2h0ICsgYm94LnlcclxuXHJcbiAgICAgICAgaWYgKGwgPT0gJ0MnKSAge1xyXG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVs1XSA9ICgodGhpcy52YWx1ZVtpXVs1XSAtIGJveC54KSAqIHdpZHRoKSAgLyBib3gud2lkdGggICsgYm94LnhcclxuICAgICAgICAgIHRoaXMudmFsdWVbaV1bNl0gPSAoKHRoaXMudmFsdWVbaV1bNl0gLSBib3gueSkgKiBoZWlnaHQpIC8gYm94LmhlaWdodCArIGJveC55XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIGlmIChsID09ICdBJykgIHtcclxuICAgICAgICAvLyByZXNpemUgcmFkaWlcclxuICAgICAgICB0aGlzLnZhbHVlW2ldWzFdID0gKHRoaXMudmFsdWVbaV1bMV0gKiB3aWR0aCkgIC8gYm94LndpZHRoXHJcbiAgICAgICAgdGhpcy52YWx1ZVtpXVsyXSA9ICh0aGlzLnZhbHVlW2ldWzJdICogaGVpZ2h0KSAvIGJveC5oZWlnaHRcclxuXHJcbiAgICAgICAgLy8gbW92ZSBwb3NpdGlvbiB2YWx1ZXNcclxuICAgICAgICB0aGlzLnZhbHVlW2ldWzZdID0gKCh0aGlzLnZhbHVlW2ldWzZdIC0gYm94LngpICogd2lkdGgpICAvIGJveC53aWR0aCAgKyBib3gueFxyXG4gICAgICAgIHRoaXMudmFsdWVbaV1bN10gPSAoKHRoaXMudmFsdWVbaV1bN10gLSBib3gueSkgKiBoZWlnaHQpIC8gYm94LmhlaWdodCArIGJveC55XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gVGVzdCBpZiB0aGUgcGFzc2VkIHBhdGggYXJyYXkgdXNlIHRoZSBzYW1lIHBhdGggZGF0YSBjb21tYW5kcyBhcyB0aGlzIHBhdGggYXJyYXlcclxuLCBlcXVhbENvbW1hbmRzOiBmdW5jdGlvbihwYXRoQXJyYXkpIHtcclxuICAgIHZhciBpLCBpbCwgZXF1YWxDb21tYW5kc1xyXG5cclxuICAgIHBhdGhBcnJheSA9IG5ldyBTVkcuUGF0aEFycmF5KHBhdGhBcnJheSlcclxuXHJcbiAgICBlcXVhbENvbW1hbmRzID0gdGhpcy52YWx1ZS5sZW5ndGggPT09IHBhdGhBcnJheS52YWx1ZS5sZW5ndGhcclxuICAgIGZvcihpID0gMCwgaWwgPSB0aGlzLnZhbHVlLmxlbmd0aDsgZXF1YWxDb21tYW5kcyAmJiBpIDwgaWw7IGkrKykge1xyXG4gICAgICBlcXVhbENvbW1hbmRzID0gdGhpcy52YWx1ZVtpXVswXSA9PT0gcGF0aEFycmF5LnZhbHVlW2ldWzBdXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVxdWFsQ29tbWFuZHNcclxuICB9XHJcbiAgLy8gTWFrZSBwYXRoIGFycmF5IG1vcnBoYWJsZVxyXG4sIG1vcnBoOiBmdW5jdGlvbihwYXRoQXJyYXkpIHtcclxuICAgIHBhdGhBcnJheSA9IG5ldyBTVkcuUGF0aEFycmF5KHBhdGhBcnJheSlcclxuXHJcbiAgICBpZih0aGlzLmVxdWFsQ29tbWFuZHMocGF0aEFycmF5KSkge1xyXG4gICAgICB0aGlzLmRlc3RpbmF0aW9uID0gcGF0aEFycmF5XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIC8vIEdldCBtb3JwaGVkIHBhdGggYXJyYXkgYXQgZ2l2ZW4gcG9zaXRpb25cclxuLCBhdDogZnVuY3Rpb24ocG9zKSB7XHJcbiAgICAvLyBtYWtlIHN1cmUgYSBkZXN0aW5hdGlvbiBpcyBkZWZpbmVkXHJcbiAgICBpZiAoIXRoaXMuZGVzdGluYXRpb24pIHJldHVybiB0aGlzXHJcblxyXG4gICAgdmFyIHNvdXJjZUFycmF5ID0gdGhpcy52YWx1ZVxyXG4gICAgICAsIGRlc3RpbmF0aW9uQXJyYXkgPSB0aGlzLmRlc3RpbmF0aW9uLnZhbHVlXHJcbiAgICAgICwgYXJyYXkgPSBbXSwgcGF0aEFycmF5ID0gbmV3IFNWRy5QYXRoQXJyYXkoKVxyXG4gICAgICAsIGksIGlsLCBqLCBqbFxyXG5cclxuICAgIC8vIEFuaW1hdGUgaGFzIHNwZWNpZmllZCBpbiB0aGUgU1ZHIHNwZWNcclxuICAgIC8vIFNlZTogaHR0cHM6Ly93d3cudzMub3JnL1RSL1NWRzExL3BhdGhzLmh0bWwjUGF0aEVsZW1lbnRcclxuICAgIGZvciAoaSA9IDAsIGlsID0gc291cmNlQXJyYXkubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xyXG4gICAgICBhcnJheVtpXSA9IFtzb3VyY2VBcnJheVtpXVswXV1cclxuICAgICAgZm9yKGogPSAxLCBqbCA9IHNvdXJjZUFycmF5W2ldLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcclxuICAgICAgICBhcnJheVtpXVtqXSA9IHNvdXJjZUFycmF5W2ldW2pdICsgKGRlc3RpbmF0aW9uQXJyYXlbaV1bal0gLSBzb3VyY2VBcnJheVtpXVtqXSkgKiBwb3NcclxuICAgICAgfVxyXG4gICAgICAvLyBGb3IgdGhlIHR3byBmbGFncyBvZiB0aGUgZWxsaXB0aWNhbCBhcmMgY29tbWFuZCwgdGhlIFNWRyBzcGVjIHNheTpcclxuICAgICAgLy8gRmxhZ3MgYW5kIGJvb2xlYW5zIGFyZSBpbnRlcnBvbGF0ZWQgYXMgZnJhY3Rpb25zIGJldHdlZW4gemVybyBhbmQgb25lLCB3aXRoIGFueSBub24temVybyB2YWx1ZSBjb25zaWRlcmVkIHRvIGJlIGEgdmFsdWUgb2Ygb25lL3RydWVcclxuICAgICAgLy8gRWxsaXB0aWNhbCBhcmMgY29tbWFuZCBhcyBhbiBhcnJheSBmb2xsb3dlZCBieSBjb3JyZXNwb25kaW5nIGluZGV4ZXM6XHJcbiAgICAgIC8vIFsnQScsIHJ4LCByeSwgeC1heGlzLXJvdGF0aW9uLCBsYXJnZS1hcmMtZmxhZywgc3dlZXAtZmxhZywgeCwgeV1cclxuICAgICAgLy8gICAwICAgIDEgICAyICAgICAgICAzICAgICAgICAgICAgICAgICA0ICAgICAgICAgICAgIDUgICAgICA2ICA3XHJcbiAgICAgIGlmKGFycmF5W2ldWzBdID09PSAnQScpIHtcclxuICAgICAgICBhcnJheVtpXVs0XSA9ICsoYXJyYXlbaV1bNF0gIT0gMClcclxuICAgICAgICBhcnJheVtpXVs1XSA9ICsoYXJyYXlbaV1bNV0gIT0gMClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIERpcmVjdGx5IG1vZGlmeSB0aGUgdmFsdWUgb2YgYSBwYXRoIGFycmF5LCB0aGlzIGlzIGRvbmUgdGhpcyB3YXkgZm9yIHBlcmZvcm1hbmNlXHJcbiAgICBwYXRoQXJyYXkudmFsdWUgPSBhcnJheVxyXG4gICAgcmV0dXJuIHBhdGhBcnJheVxyXG4gIH1cclxuICAvLyBBYnNvbHV0aXplIGFuZCBwYXJzZSBwYXRoIHRvIGFycmF5XHJcbiwgcGFyc2U6IGZ1bmN0aW9uKGFycmF5KSB7XHJcbiAgICAvLyBpZiBpdCdzIGFscmVhZHkgYSBwYXRoYXJyYXksIG5vIG5lZWQgdG8gcGFyc2UgaXRcclxuICAgIGlmIChhcnJheSBpbnN0YW5jZW9mIFNWRy5QYXRoQXJyYXkpIHJldHVybiBhcnJheS52YWx1ZU9mKClcclxuXHJcbiAgICAvLyBwcmVwYXJlIGZvciBwYXJzaW5nXHJcbiAgICB2YXIgaSwgeDAsIHkwLCBzLCBzZWcsIGFyclxyXG4gICAgICAsIHggPSAwXHJcbiAgICAgICwgeSA9IDBcclxuICAgICAgLCBwYXJhbUNudCA9IHsgJ00nOjIsICdMJzoyLCAnSCc6MSwgJ1YnOjEsICdDJzo2LCAnUyc6NCwgJ1EnOjQsICdUJzoyLCAnQSc6NywgJ1onOjAgfVxyXG5cclxuICAgIGlmKHR5cGVvZiBhcnJheSA9PSAnc3RyaW5nJyl7XHJcblxyXG4gICAgICBhcnJheSA9IGFycmF5XHJcbiAgICAgICAgLnJlcGxhY2UoU1ZHLnJlZ2V4Lm51bWJlcnNXaXRoRG90cywgcGF0aFJlZ1JlcGxhY2UpIC8vIGNvbnZlcnQgNDUuMTIzLjEyMyB0byA0NS4xMjMgLjEyM1xyXG4gICAgICAgIC5yZXBsYWNlKFNWRy5yZWdleC5wYXRoTGV0dGVycywgJyAkJiAnKSAvLyBwdXQgc29tZSByb29tIGJldHdlZW4gbGV0dGVycyBhbmQgbnVtYmVyc1xyXG4gICAgICAgIC5yZXBsYWNlKFNWRy5yZWdleC5oeXBoZW4sICckMSAtJykgICAgICAvLyBhZGQgc3BhY2UgYmVmb3JlIGh5cGhlblxyXG4gICAgICAgIC50cmltKCkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cmltXHJcbiAgICAgICAgLnNwbGl0KFNWRy5yZWdleC5kZWxpbWl0ZXIpICAgLy8gc3BsaXQgaW50byBhcnJheVxyXG5cclxuICAgIH1lbHNle1xyXG4gICAgICBhcnJheSA9IGFycmF5LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXJyKXtcclxuICAgICAgICByZXR1cm4gW10uY29uY2F0LmNhbGwocHJldiwgY3VycilcclxuICAgICAgfSwgW10pXHJcbiAgICB9XHJcblxyXG4gICAgLy8gYXJyYXkgbm93IGlzIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHBhcnRzIG9mIGEgcGF0aCBlLmcuIFsnTScsICcwJywgJzAnLCAnTCcsICczMCcsICczMCcgLi4uXVxyXG4gICAgdmFyIGFyciA9IFtdXHJcbiAgICAgICwgcCA9IG5ldyBTVkcuUG9pbnQoKVxyXG4gICAgICAsIHAwID0gbmV3IFNWRy5Qb2ludCgpXHJcbiAgICAgICwgaW5kZXggPSAwXHJcbiAgICAgICwgbGVuID0gYXJyYXkubGVuZ3RoXHJcblxyXG4gICAgZG97XHJcbiAgICAgIC8vIFRlc3QgaWYgd2UgaGF2ZSBhIHBhdGggbGV0dGVyXHJcbiAgICAgIGlmKFNWRy5yZWdleC5pc1BhdGhMZXR0ZXIudGVzdChhcnJheVtpbmRleF0pKXtcclxuICAgICAgICBzID0gYXJyYXlbaW5kZXhdXHJcbiAgICAgICAgKytpbmRleFxyXG4gICAgICAvLyBJZiBsYXN0IGxldHRlciB3YXMgYSBtb3ZlIGNvbW1hbmQgYW5kIHdlIGdvdCBubyBuZXcsIGl0IGRlZmF1bHRzIHRvIFtMXWluZVxyXG4gICAgICB9ZWxzZSBpZihzID09ICdNJyl7XHJcbiAgICAgICAgcyA9ICdMJ1xyXG4gICAgICB9ZWxzZSBpZihzID09ICdtJyl7XHJcbiAgICAgICAgcyA9ICdsJ1xyXG4gICAgICB9XHJcblxyXG4gICAgICBhcnIucHVzaChwYXRoSGFuZGxlcnNbc10uY2FsbChudWxsLFxyXG4gICAgICAgICAgYXJyYXkuc2xpY2UoaW5kZXgsIChpbmRleCA9IGluZGV4ICsgcGFyYW1DbnRbcy50b1VwcGVyQ2FzZSgpXSkpLm1hcChwYXJzZUZsb2F0KSxcclxuICAgICAgICAgIHAsIHAwXHJcbiAgICAgICAgKVxyXG4gICAgICApXHJcblxyXG4gICAgfXdoaWxlKGxlbiA+IGluZGV4KVxyXG5cclxuICAgIHJldHVybiBhcnJcclxuXHJcbiAgfVxyXG4gIC8vIEdldCBib3VuZGluZyBib3ggb2YgcGF0aFxyXG4sIGJib3g6IGZ1bmN0aW9uKCkge1xyXG4gICAgU1ZHLnBhcnNlci5wYXRoLnNldEF0dHJpYnV0ZSgnZCcsIHRoaXMudG9TdHJpbmcoKSlcclxuXHJcbiAgICByZXR1cm4gU1ZHLnBhcnNlci5wYXRoLmdldEJCb3goKVxyXG4gIH1cclxuXHJcbn0pXHJcblxuLy8gTW9kdWxlIGZvciB1bml0IGNvbnZlcnRpb25zXHJcblNWRy5OdW1iZXIgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplXHJcbiAgY3JlYXRlOiBmdW5jdGlvbih2YWx1ZSwgdW5pdCkge1xyXG4gICAgLy8gaW5pdGlhbGl6ZSBkZWZhdWx0c1xyXG4gICAgdGhpcy52YWx1ZSA9IDBcclxuICAgIHRoaXMudW5pdCAgPSB1bml0IHx8ICcnXHJcblxyXG4gICAgLy8gcGFyc2UgdmFsdWVcclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XHJcbiAgICAgIC8vIGVuc3VyZSBhIHZhbGlkIG51bWVyaWMgdmFsdWVcclxuICAgICAgdGhpcy52YWx1ZSA9IGlzTmFOKHZhbHVlKSA/IDAgOiAhaXNGaW5pdGUodmFsdWUpID8gKHZhbHVlIDwgMCA/IC0zLjRlKzM4IDogKzMuNGUrMzgpIDogdmFsdWVcclxuXHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdW5pdCA9IHZhbHVlLm1hdGNoKFNWRy5yZWdleC5udW1iZXJBbmRVbml0KVxyXG5cclxuICAgICAgaWYgKHVuaXQpIHtcclxuICAgICAgICAvLyBtYWtlIHZhbHVlIG51bWVyaWNcclxuICAgICAgICB0aGlzLnZhbHVlID0gcGFyc2VGbG9hdCh1bml0WzFdKVxyXG5cclxuICAgICAgICAvLyBub3JtYWxpemVcclxuICAgICAgICBpZiAodW5pdFs1XSA9PSAnJScpXHJcbiAgICAgICAgICB0aGlzLnZhbHVlIC89IDEwMFxyXG4gICAgICAgIGVsc2UgaWYgKHVuaXRbNV0gPT0gJ3MnKVxyXG4gICAgICAgICAgdGhpcy52YWx1ZSAqPSAxMDAwXHJcblxyXG4gICAgICAgIC8vIHN0b3JlIHVuaXRcclxuICAgICAgICB0aGlzLnVuaXQgPSB1bml0WzVdXHJcbiAgICAgIH1cclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTVkcuTnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlLnZhbHVlT2YoKVxyXG4gICAgICAgIHRoaXMudW5pdCAgPSB2YWx1ZS51bml0XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG4gIC8vIEFkZCBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBTdHJpbmdhbGl6ZVxyXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMudW5pdCA9PSAnJScgP1xyXG4gICAgICAgICAgfn4odGhpcy52YWx1ZSAqIDFlOCkgLyAxZTY6XHJcbiAgICAgICAgdGhpcy51bml0ID09ICdzJyA/XHJcbiAgICAgICAgICB0aGlzLnZhbHVlIC8gMWUzIDpcclxuICAgICAgICAgIHRoaXMudmFsdWVcclxuICAgICAgKSArIHRoaXMudW5pdFxyXG4gICAgfVxyXG4gICwgdG9KU09OOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKVxyXG4gICAgfVxyXG4gICwgLy8gQ29udmVydCB0byBwcmltaXRpdmVcclxuICAgIHZhbHVlT2Y6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy52YWx1ZVxyXG4gICAgfVxyXG4gICAgLy8gQWRkIG51bWJlclxyXG4gICwgcGx1czogZnVuY3Rpb24obnVtYmVyKSB7XHJcbiAgICAgIG51bWJlciA9IG5ldyBTVkcuTnVtYmVyKG51bWJlcilcclxuICAgICAgcmV0dXJuIG5ldyBTVkcuTnVtYmVyKHRoaXMgKyBudW1iZXIsIHRoaXMudW5pdCB8fCBudW1iZXIudW5pdClcclxuICAgIH1cclxuICAgIC8vIFN1YnRyYWN0IG51bWJlclxyXG4gICwgbWludXM6IGZ1bmN0aW9uKG51bWJlcikge1xyXG4gICAgICBudW1iZXIgPSBuZXcgU1ZHLk51bWJlcihudW1iZXIpXHJcbiAgICAgIHJldHVybiBuZXcgU1ZHLk51bWJlcih0aGlzIC0gbnVtYmVyLCB0aGlzLnVuaXQgfHwgbnVtYmVyLnVuaXQpXHJcbiAgICB9XHJcbiAgICAvLyBNdWx0aXBseSBudW1iZXJcclxuICAsIHRpbWVzOiBmdW5jdGlvbihudW1iZXIpIHtcclxuICAgICAgbnVtYmVyID0gbmV3IFNWRy5OdW1iZXIobnVtYmVyKVxyXG4gICAgICByZXR1cm4gbmV3IFNWRy5OdW1iZXIodGhpcyAqIG51bWJlciwgdGhpcy51bml0IHx8IG51bWJlci51bml0KVxyXG4gICAgfVxyXG4gICAgLy8gRGl2aWRlIG51bWJlclxyXG4gICwgZGl2aWRlOiBmdW5jdGlvbihudW1iZXIpIHtcclxuICAgICAgbnVtYmVyID0gbmV3IFNWRy5OdW1iZXIobnVtYmVyKVxyXG4gICAgICByZXR1cm4gbmV3IFNWRy5OdW1iZXIodGhpcyAvIG51bWJlciwgdGhpcy51bml0IHx8IG51bWJlci51bml0KVxyXG4gICAgfVxyXG4gICAgLy8gQ29udmVydCB0byBkaWZmZXJlbnQgdW5pdFxyXG4gICwgdG86IGZ1bmN0aW9uKHVuaXQpIHtcclxuICAgICAgdmFyIG51bWJlciA9IG5ldyBTVkcuTnVtYmVyKHRoaXMpXHJcblxyXG4gICAgICBpZiAodHlwZW9mIHVuaXQgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgIG51bWJlci51bml0ID0gdW5pdFxyXG5cclxuICAgICAgcmV0dXJuIG51bWJlclxyXG4gICAgfVxyXG4gICAgLy8gTWFrZSBudW1iZXIgbW9ycGhhYmxlXHJcbiAgLCBtb3JwaDogZnVuY3Rpb24obnVtYmVyKSB7XHJcbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBuZXcgU1ZHLk51bWJlcihudW1iZXIpXHJcblxyXG4gICAgICBpZihudW1iZXIucmVsYXRpdmUpIHtcclxuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLnZhbHVlICs9IHRoaXMudmFsdWVcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIEdldCBtb3JwaGVkIG51bWJlciBhdCBnaXZlbiBwb3NpdGlvblxyXG4gICwgYXQ6IGZ1bmN0aW9uKHBvcykge1xyXG4gICAgICAvLyBNYWtlIHN1cmUgYSBkZXN0aW5hdGlvbiBpcyBkZWZpbmVkXHJcbiAgICAgIGlmICghdGhpcy5kZXN0aW5hdGlvbikgcmV0dXJuIHRoaXNcclxuXHJcbiAgICAgIC8vIEdlbmVyYXRlIG5ldyBtb3JwaGVkIG51bWJlclxyXG4gICAgICByZXR1cm4gbmV3IFNWRy5OdW1iZXIodGhpcy5kZXN0aW5hdGlvbilcclxuICAgICAgICAgIC5taW51cyh0aGlzKVxyXG4gICAgICAgICAgLnRpbWVzKHBvcylcclxuICAgICAgICAgIC5wbHVzKHRoaXMpXHJcbiAgICB9XHJcblxyXG4gIH1cclxufSlcclxuXG5cclxuU1ZHLkVsZW1lbnQgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6IGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgIC8vIG1ha2Ugc3Ryb2tlIHZhbHVlIGFjY2Vzc2libGUgZHluYW1pY2FsbHlcclxuICAgIHRoaXMuX3N0cm9rZSA9IFNWRy5kZWZhdWx0cy5hdHRycy5zdHJva2VcclxuICAgIHRoaXMuX2V2ZW50ID0gbnVsbFxyXG5cclxuICAgIC8vIGluaXRpYWxpemUgZGF0YSBvYmplY3RcclxuICAgIHRoaXMuZG9tID0ge31cclxuXHJcbiAgICAvLyBjcmVhdGUgY2lyY3VsYXIgcmVmZXJlbmNlXHJcbiAgICBpZiAodGhpcy5ub2RlID0gbm9kZSkge1xyXG4gICAgICB0aGlzLnR5cGUgPSBub2RlLm5vZGVOYW1lXHJcbiAgICAgIHRoaXMubm9kZS5pbnN0YW5jZSA9IHRoaXNcclxuXHJcbiAgICAgIC8vIHN0b3JlIGN1cnJlbnQgYXR0cmlidXRlIHZhbHVlXHJcbiAgICAgIHRoaXMuX3N0cm9rZSA9IG5vZGUuZ2V0QXR0cmlidXRlKCdzdHJva2UnKSB8fCB0aGlzLl9zdHJva2VcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBNb3ZlIG92ZXIgeC1heGlzXHJcbiAgICB4OiBmdW5jdGlvbih4KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3gnLCB4KVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBvdmVyIHktYXhpc1xyXG4gICwgeTogZnVuY3Rpb24oeSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd5JywgeSlcclxuICAgIH1cclxuICAgIC8vIE1vdmUgYnkgY2VudGVyIG92ZXIgeC1heGlzXHJcbiAgLCBjeDogZnVuY3Rpb24oeCkge1xyXG4gICAgICByZXR1cm4geCA9PSBudWxsID8gdGhpcy54KCkgKyB0aGlzLndpZHRoKCkgLyAyIDogdGhpcy54KHggLSB0aGlzLndpZHRoKCkgLyAyKVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBieSBjZW50ZXIgb3ZlciB5LWF4aXNcclxuICAsIGN5OiBmdW5jdGlvbih5KSB7XHJcbiAgICAgIHJldHVybiB5ID09IG51bGwgPyB0aGlzLnkoKSArIHRoaXMuaGVpZ2h0KCkgLyAyIDogdGhpcy55KHkgLSB0aGlzLmhlaWdodCgpIC8gMilcclxuICAgIH1cclxuICAgIC8vIE1vdmUgZWxlbWVudCB0byBnaXZlbiB4IGFuZCB5IHZhbHVlc1xyXG4gICwgbW92ZTogZnVuY3Rpb24oeCwgeSkge1xyXG4gICAgICByZXR1cm4gdGhpcy54KHgpLnkoeSlcclxuICAgIH1cclxuICAgIC8vIE1vdmUgZWxlbWVudCBieSBpdHMgY2VudGVyXHJcbiAgLCBjZW50ZXI6IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY3goeCkuY3koeSlcclxuICAgIH1cclxuICAgIC8vIFNldCB3aWR0aCBvZiBlbGVtZW50XHJcbiAgLCB3aWR0aDogZnVuY3Rpb24od2lkdGgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cignd2lkdGgnLCB3aWR0aClcclxuICAgIH1cclxuICAgIC8vIFNldCBoZWlnaHQgb2YgZWxlbWVudFxyXG4gICwgaGVpZ2h0OiBmdW5jdGlvbihoZWlnaHQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxyXG4gICAgfVxyXG4gICAgLy8gU2V0IGVsZW1lbnQgc2l6ZSB0byBnaXZlbiB3aWR0aCBhbmQgaGVpZ2h0XHJcbiAgLCBzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgIHZhciBwID0gcHJvcG9ydGlvbmFsU2l6ZSh0aGlzLCB3aWR0aCwgaGVpZ2h0KVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICAud2lkdGgobmV3IFNWRy5OdW1iZXIocC53aWR0aCkpXHJcbiAgICAgICAgLmhlaWdodChuZXcgU1ZHLk51bWJlcihwLmhlaWdodCkpXHJcbiAgICB9XHJcbiAgICAvLyBDbG9uZSBlbGVtZW50XHJcbiAgLCBjbG9uZTogZnVuY3Rpb24ocGFyZW50LCB3aXRoRGF0YSkge1xyXG4gICAgICAvLyB3cml0ZSBkb20gZGF0YSB0byB0aGUgZG9tIHNvIHRoZSBjbG9uZSBjYW4gcGlja3VwIHRoZSBkYXRhXHJcbiAgICAgIHRoaXMud3JpdGVEYXRhVG9Eb20oKVxyXG5cclxuICAgICAgLy8gY2xvbmUgZWxlbWVudCBhbmQgYXNzaWduIG5ldyBpZFxyXG4gICAgICB2YXIgY2xvbmUgPSBhc3NpZ25OZXdJZCh0aGlzLm5vZGUuY2xvbmVOb2RlKHRydWUpKVxyXG5cclxuICAgICAgLy8gaW5zZXJ0IHRoZSBjbG9uZSBpbiB0aGUgZ2l2ZW4gcGFyZW50IG9yIGFmdGVyIG15c2VsZlxyXG4gICAgICBpZihwYXJlbnQpIHBhcmVudC5hZGQoY2xvbmUpXHJcbiAgICAgIGVsc2UgdGhpcy5hZnRlcihjbG9uZSlcclxuXHJcbiAgICAgIHJldHVybiBjbG9uZVxyXG4gICAgfVxyXG4gICAgLy8gUmVtb3ZlIGVsZW1lbnRcclxuICAsIHJlbW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLnBhcmVudCgpKVxyXG4gICAgICAgIHRoaXMucGFyZW50KCkucmVtb3ZlRWxlbWVudCh0aGlzKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIFJlcGxhY2UgZWxlbWVudFxyXG4gICwgcmVwbGFjZTogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICB0aGlzLmFmdGVyKGVsZW1lbnQpLnJlbW92ZSgpXHJcblxyXG4gICAgICByZXR1cm4gZWxlbWVudFxyXG4gICAgfVxyXG4gICAgLy8gQWRkIGVsZW1lbnQgdG8gZ2l2ZW4gY29udGFpbmVyIGFuZCByZXR1cm4gc2VsZlxyXG4gICwgYWRkVG86IGZ1bmN0aW9uKHBhcmVudCkge1xyXG4gICAgICByZXR1cm4gcGFyZW50LnB1dCh0aGlzKVxyXG4gICAgfVxyXG4gICAgLy8gQWRkIGVsZW1lbnQgdG8gZ2l2ZW4gY29udGFpbmVyIGFuZCByZXR1cm4gY29udGFpbmVyXHJcbiAgLCBwdXRJbjogZnVuY3Rpb24ocGFyZW50KSB7XHJcbiAgICAgIHJldHVybiBwYXJlbnQuYWRkKHRoaXMpXHJcbiAgICB9XHJcbiAgICAvLyBHZXQgLyBzZXQgaWRcclxuICAsIGlkOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdpZCcsIGlkKVxyXG4gICAgfVxyXG4gICAgLy8gQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIHBvaW50IGluc2lkZSB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBlbGVtZW50XHJcbiAgLCBpbnNpZGU6IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgICAgdmFyIGJveCA9IHRoaXMuYmJveCgpXHJcblxyXG4gICAgICByZXR1cm4geCA+IGJveC54XHJcbiAgICAgICAgICAmJiB5ID4gYm94LnlcclxuICAgICAgICAgICYmIHggPCBib3gueCArIGJveC53aWR0aFxyXG4gICAgICAgICAgJiYgeSA8IGJveC55ICsgYm94LmhlaWdodFxyXG4gICAgfVxyXG4gICAgLy8gU2hvdyBlbGVtZW50XHJcbiAgLCBzaG93OiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3R5bGUoJ2Rpc3BsYXknLCAnJylcclxuICAgIH1cclxuICAgIC8vIEhpZGUgZWxlbWVudFxyXG4gICwgaGlkZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKVxyXG4gICAgfVxyXG4gICAgLy8gSXMgZWxlbWVudCB2aXNpYmxlP1xyXG4gICwgdmlzaWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnN0eWxlKCdkaXNwbGF5JykgIT0gJ25vbmUnXHJcbiAgICB9XHJcbiAgICAvLyBSZXR1cm4gaWQgb24gc3RyaW5nIGNvbnZlcnNpb25cclxuICAsIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cignaWQnKVxyXG4gICAgfVxyXG4gICAgLy8gUmV0dXJuIGFycmF5IG9mIGNsYXNzZXMgb24gdGhlIG5vZGVcclxuICAsIGNsYXNzZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgYXR0ciA9IHRoaXMuYXR0cignY2xhc3MnKVxyXG5cclxuICAgICAgcmV0dXJuIGF0dHIgPT0gbnVsbCA/IFtdIDogYXR0ci50cmltKCkuc3BsaXQoU1ZHLnJlZ2V4LmRlbGltaXRlcilcclxuICAgIH1cclxuICAgIC8vIFJldHVybiB0cnVlIGlmIGNsYXNzIGV4aXN0cyBvbiB0aGUgbm9kZSwgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAgLCBoYXNDbGFzczogZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jbGFzc2VzKCkuaW5kZXhPZihuYW1lKSAhPSAtMVxyXG4gICAgfVxyXG4gICAgLy8gQWRkIGNsYXNzIHRvIHRoZSBub2RlXHJcbiAgLCBhZGRDbGFzczogZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzQ2xhc3MobmFtZSkpIHtcclxuICAgICAgICB2YXIgYXJyYXkgPSB0aGlzLmNsYXNzZXMoKVxyXG4gICAgICAgIGFycmF5LnB1c2gobmFtZSlcclxuICAgICAgICB0aGlzLmF0dHIoJ2NsYXNzJywgYXJyYXkuam9pbignICcpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gUmVtb3ZlIGNsYXNzIGZyb20gdGhlIG5vZGVcclxuICAsIHJlbW92ZUNsYXNzOiBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc0NsYXNzKG5hbWUpKSB7XHJcbiAgICAgICAgdGhpcy5hdHRyKCdjbGFzcycsIHRoaXMuY2xhc3NlcygpLmZpbHRlcihmdW5jdGlvbihjKSB7XHJcbiAgICAgICAgICByZXR1cm4gYyAhPSBuYW1lXHJcbiAgICAgICAgfSkuam9pbignICcpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gVG9nZ2xlIHRoZSBwcmVzZW5jZSBvZiBhIGNsYXNzIG9uIHRoZSBub2RlXHJcbiAgLCB0b2dnbGVDbGFzczogZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYXNDbGFzcyhuYW1lKSA/IHRoaXMucmVtb3ZlQ2xhc3MobmFtZSkgOiB0aGlzLmFkZENsYXNzKG5hbWUpXHJcbiAgICB9XHJcbiAgICAvLyBHZXQgcmVmZXJlbmNlZCBlbGVtZW50IGZvcm0gYXR0cmlidXRlIHZhbHVlXHJcbiAgLCByZWZlcmVuY2U6IGZ1bmN0aW9uKGF0dHIpIHtcclxuICAgICAgcmV0dXJuIFNWRy5nZXQodGhpcy5hdHRyKGF0dHIpKVxyXG4gICAgfVxyXG4gICAgLy8gUmV0dXJucyB0aGUgcGFyZW50IGVsZW1lbnQgaW5zdGFuY2VcclxuICAsIHBhcmVudDogZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICB2YXIgcGFyZW50ID0gdGhpc1xyXG5cclxuICAgICAgLy8gY2hlY2sgZm9yIHBhcmVudFxyXG4gICAgICBpZighcGFyZW50Lm5vZGUucGFyZW50Tm9kZSkgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIC8vIGdldCBwYXJlbnQgZWxlbWVudFxyXG4gICAgICBwYXJlbnQgPSBTVkcuYWRvcHQocGFyZW50Lm5vZGUucGFyZW50Tm9kZSlcclxuXHJcbiAgICAgIGlmKCF0eXBlKSByZXR1cm4gcGFyZW50XHJcblxyXG4gICAgICAvLyBsb29wIHRyb3VnaCBhbmNlc3RvcnMgaWYgdHlwZSBpcyBnaXZlblxyXG4gICAgICB3aGlsZShwYXJlbnQgJiYgcGFyZW50Lm5vZGUgaW5zdGFuY2VvZiB3aW5kb3cuU1ZHRWxlbWVudCl7XHJcbiAgICAgICAgaWYodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnID8gcGFyZW50Lm1hdGNoZXModHlwZSkgOiBwYXJlbnQgaW5zdGFuY2VvZiB0eXBlKSByZXR1cm4gcGFyZW50XHJcbiAgICAgICAgaWYocGFyZW50Lm5vZGUucGFyZW50Tm9kZS5ub2RlTmFtZSA9PSAnI2RvY3VtZW50JykgcmV0dXJuIG51bGwgLy8gIzcyMFxyXG4gICAgICAgIHBhcmVudCA9IFNWRy5hZG9wdChwYXJlbnQubm9kZS5wYXJlbnROb2RlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBHZXQgcGFyZW50IGRvY3VtZW50XHJcbiAgLCBkb2M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIFNWRy5Eb2MgPyB0aGlzIDogdGhpcy5wYXJlbnQoU1ZHLkRvYylcclxuICAgIH1cclxuICAgIC8vIHJldHVybiBhcnJheSBvZiBhbGwgYW5jZXN0b3JzIG9mIGdpdmVuIHR5cGUgdXAgdG8gdGhlIHJvb3Qgc3ZnXHJcbiAgLCBwYXJlbnRzOiBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgIHZhciBwYXJlbnRzID0gW10sIHBhcmVudCA9IHRoaXNcclxuXHJcbiAgICAgIGRve1xyXG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQodHlwZSlcclxuICAgICAgICBpZighcGFyZW50IHx8ICFwYXJlbnQubm9kZSkgYnJlYWtcclxuXHJcbiAgICAgICAgcGFyZW50cy5wdXNoKHBhcmVudClcclxuICAgICAgfSB3aGlsZShwYXJlbnQucGFyZW50KVxyXG5cclxuICAgICAgcmV0dXJuIHBhcmVudHNcclxuICAgIH1cclxuICAgIC8vIG1hdGNoZXMgdGhlIGVsZW1lbnQgdnMgYSBjc3Mgc2VsZWN0b3JcclxuICAsIG1hdGNoZXM6IGZ1bmN0aW9uKHNlbGVjdG9yKXtcclxuICAgICAgcmV0dXJuIG1hdGNoZXModGhpcy5ub2RlLCBzZWxlY3RvcilcclxuICAgIH1cclxuICAgIC8vIFJldHVybnMgdGhlIHN2ZyBub2RlIHRvIGNhbGwgbmF0aXZlIHN2ZyBtZXRob2RzIG9uIGl0XHJcbiAgLCBuYXRpdmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5ub2RlXHJcbiAgICB9XHJcbiAgICAvLyBJbXBvcnQgcmF3IHN2Z1xyXG4gICwgc3ZnOiBmdW5jdGlvbihzdmcpIHtcclxuICAgICAgLy8gY3JlYXRlIHRlbXBvcmFyeSBob2xkZXJcclxuICAgICAgdmFyIHdlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdmcnKVxyXG5cclxuICAgICAgLy8gYWN0IGFzIGEgc2V0dGVyIGlmIHN2ZyBpcyBnaXZlblxyXG4gICAgICBpZiAoc3ZnICYmIHRoaXMgaW5zdGFuY2VvZiBTVkcuUGFyZW50KSB7XHJcbiAgICAgICAgLy8gZHVtcCByYXcgc3ZnXHJcbiAgICAgICAgd2VsbC5pbm5lckhUTUwgPSAnPHN2Zz4nICsgc3ZnLnJlcGxhY2UoL1xcbi8sICcnKS5yZXBsYWNlKC88KFxcdyspKFtePF0rPylcXC8+L2csICc8JDEkMj48LyQxPicpICsgJzwvc3ZnPidcclxuXHJcbiAgICAgICAgLy8gdHJhbnNwbGFudCBub2Rlc1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHdlbGwuZmlyc3RDaGlsZC5jaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQod2VsbC5maXJzdENoaWxkLmZpcnN0Q2hpbGQpXHJcblxyXG4gICAgICAvLyBvdGhlcndpc2UgYWN0IGFzIGEgZ2V0dGVyXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gY3JlYXRlIGEgd3JhcHBpbmcgc3ZnIGVsZW1lbnQgaW4gY2FzZSBvZiBwYXJ0aWFsIGNvbnRlbnRcclxuICAgICAgICB3ZWxsLmFwcGVuZENoaWxkKHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N2ZycpKVxyXG5cclxuICAgICAgICAvLyB3cml0ZSBzdmdqcyBkYXRhIHRvIHRoZSBkb21cclxuICAgICAgICB0aGlzLndyaXRlRGF0YVRvRG9tKClcclxuXHJcbiAgICAgICAgLy8gaW5zZXJ0IGEgY29weSBvZiB0aGlzIG5vZGVcclxuICAgICAgICBzdmcuYXBwZW5kQ2hpbGQodGhpcy5ub2RlLmNsb25lTm9kZSh0cnVlKSlcclxuXHJcbiAgICAgICAgLy8gcmV0dXJuIHRhcmdldCBlbGVtZW50XHJcbiAgICAgICAgcmV0dXJuIHdlbGwuaW5uZXJIVE1MLnJlcGxhY2UoL148c3ZnPi8sICcnKS5yZXBsYWNlKC88XFwvc3ZnPiQvLCAnJylcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAvLyB3cml0ZSBzdmdqcyBkYXRhIHRvIHRoZSBkb21cclxuICAsIHdyaXRlRGF0YVRvRG9tOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgIC8vIGR1bXAgdmFyaWFibGVzIHJlY3Vyc2l2ZWx5XHJcbiAgICAgIGlmKHRoaXMuZWFjaCB8fCB0aGlzLmxpbmVzKXtcclxuICAgICAgICB2YXIgZm4gPSB0aGlzLmVhY2ggPyB0aGlzIDogdGhpcy5saW5lcygpO1xyXG4gICAgICAgIGZuLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHRoaXMud3JpdGVEYXRhVG9Eb20oKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHJlbW92ZSBwcmV2aW91c2x5IHNldCBkYXRhXHJcbiAgICAgIHRoaXMubm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ3N2Z2pzOmRhdGEnKVxyXG5cclxuICAgICAgaWYoT2JqZWN0LmtleXModGhpcy5kb20pLmxlbmd0aClcclxuICAgICAgICB0aGlzLm5vZGUuc2V0QXR0cmlidXRlKCdzdmdqczpkYXRhJywgSlNPTi5zdHJpbmdpZnkodGhpcy5kb20pKSAvLyBzZWUgIzQyOFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAvLyBzZXQgZ2l2ZW4gZGF0YSB0byB0aGUgZWxlbWVudHMgZGF0YSBwcm9wZXJ0eVxyXG4gICwgc2V0RGF0YTogZnVuY3Rpb24obyl7XHJcbiAgICAgIHRoaXMuZG9tID0gb1xyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICwgaXM6IGZ1bmN0aW9uKG9iail7XHJcbiAgICAgIHJldHVybiBpcyh0aGlzLCBvYmopXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cblNWRy5lYXNpbmcgPSB7XHJcbiAgJy0nOiBmdW5jdGlvbihwb3Mpe3JldHVybiBwb3N9XHJcbiwgJzw+JzpmdW5jdGlvbihwb3Mpe3JldHVybiAtTWF0aC5jb3MocG9zICogTWF0aC5QSSkgLyAyICsgMC41fVxyXG4sICc+JzogZnVuY3Rpb24ocG9zKXtyZXR1cm4gIE1hdGguc2luKHBvcyAqIE1hdGguUEkgLyAyKX1cclxuLCAnPCc6IGZ1bmN0aW9uKHBvcyl7cmV0dXJuIC1NYXRoLmNvcyhwb3MgKiBNYXRoLlBJIC8gMikgKyAxfVxyXG59XHJcblxyXG5TVkcubW9ycGggPSBmdW5jdGlvbihwb3Mpe1xyXG4gIHJldHVybiBmdW5jdGlvbihmcm9tLCB0bykge1xyXG4gICAgcmV0dXJuIG5ldyBTVkcuTW9ycGhPYmooZnJvbSwgdG8pLmF0KHBvcylcclxuICB9XHJcbn1cclxuXHJcblNWRy5TaXR1YXRpb24gPSBTVkcuaW52ZW50KHtcclxuXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihvKXtcclxuICAgIHRoaXMuaW5pdCA9IGZhbHNlXHJcbiAgICB0aGlzLnJldmVyc2VkID0gZmFsc2VcclxuICAgIHRoaXMucmV2ZXJzaW5nID0gZmFsc2VcclxuXHJcbiAgICB0aGlzLmR1cmF0aW9uID0gbmV3IFNWRy5OdW1iZXIoby5kdXJhdGlvbikudmFsdWVPZigpXHJcbiAgICB0aGlzLmRlbGF5ID0gbmV3IFNWRy5OdW1iZXIoby5kZWxheSkudmFsdWVPZigpXHJcblxyXG4gICAgdGhpcy5zdGFydCA9ICtuZXcgRGF0ZSgpICsgdGhpcy5kZWxheVxyXG4gICAgdGhpcy5maW5pc2ggPSB0aGlzLnN0YXJ0ICsgdGhpcy5kdXJhdGlvblxyXG4gICAgdGhpcy5lYXNlID0gby5lYXNlXHJcblxyXG4gICAgLy8gdGhpcy5sb29wIGlzIGluY3JlbWVudGVkIGZyb20gMCB0byB0aGlzLmxvb3BzXHJcbiAgICAvLyBpdCBpcyBhbHNvIGluY3JlbWVudGVkIHdoZW4gaW4gYW4gaW5maW5pdGUgbG9vcCAod2hlbiB0aGlzLmxvb3BzIGlzIHRydWUpXHJcbiAgICB0aGlzLmxvb3AgPSAwXHJcbiAgICB0aGlzLmxvb3BzID0gZmFsc2VcclxuXHJcbiAgICB0aGlzLmFuaW1hdGlvbnMgPSB7XHJcbiAgICAgIC8vIGZ1bmN0aW9uVG9DYWxsOiBbbGlzdCBvZiBtb3JwaGFibGUgb2JqZWN0c11cclxuICAgICAgLy8gZS5nLiBtb3ZlOiBbU1ZHLk51bWJlciwgU1ZHLk51bWJlcl1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmF0dHJzID0ge1xyXG4gICAgICAvLyBob2xkcyBhbGwgYXR0cmlidXRlcyB3aGljaCBhcmUgbm90IHJlcHJlc2VudGVkIGZyb20gYSBmdW5jdGlvbiBzdmcuanMgcHJvdmlkZXNcclxuICAgICAgLy8gZS5nLiBzb21lQXR0cjogU1ZHLk51bWJlclxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3R5bGVzID0ge1xyXG4gICAgICAvLyBob2xkcyBhbGwgc3R5bGVzIHdoaWNoIHNob3VsZCBiZSBhbmltYXRlZFxyXG4gICAgICAvLyBlLmcuIGZpbGwtY29sb3I6IFNWRy5Db2xvclxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudHJhbnNmb3JtcyA9IFtcclxuICAgICAgLy8gaG9sZHMgYWxsIHRyYW5zZm9ybWF0aW9ucyBhcyB0cmFuc2Zvcm1hdGlvbiBvYmplY3RzXHJcbiAgICAgIC8vIGUuZy4gW1NWRy5Sb3RhdGUsIFNWRy5UcmFuc2xhdGUsIFNWRy5NYXRyaXhdXHJcbiAgICBdXHJcblxyXG4gICAgdGhpcy5vbmNlID0ge1xyXG4gICAgICAvLyBmdW5jdGlvbnMgdG8gZmlyZSBhdCBhIHNwZWNpZmljIHBvc2l0aW9uXHJcbiAgICAgIC8vIGUuZy4gXCIwLjVcIjogZnVuY3Rpb24gZm9vKCl7fVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG59KVxyXG5cclxuXHJcblNWRy5GWCA9IFNWRy5pbnZlbnQoe1xyXG5cclxuICBjcmVhdGU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgIHRoaXMuX3RhcmdldCA9IGVsZW1lbnRcclxuICAgIHRoaXMuc2l0dWF0aW9ucyA9IFtdXHJcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICB0aGlzLnNpdHVhdGlvbiA9IG51bGxcclxuICAgIHRoaXMucGF1c2VkID0gZmFsc2VcclxuICAgIHRoaXMubGFzdFBvcyA9IDBcclxuICAgIHRoaXMucG9zID0gMFxyXG4gICAgLy8gVGhlIGFic29sdXRlIHBvc2l0aW9uIG9mIGFuIGFuaW1hdGlvbiBpcyBpdHMgcG9zaXRpb24gaW4gdGhlIGNvbnRleHQgb2YgaXRzIGNvbXBsZXRlIGR1cmF0aW9uIChpbmNsdWRpbmcgZGVsYXkgYW5kIGxvb3BzKVxyXG4gICAgLy8gV2hlbiBwZXJmb3JtaW5nIGEgZGVsYXksIGFic1BvcyBpcyBiZWxvdyAwIGFuZCB3aGVuIHBlcmZvcm1pbmcgYSBsb29wLCBpdHMgdmFsdWUgaXMgYWJvdmUgMVxyXG4gICAgdGhpcy5hYnNQb3MgPSAwXHJcbiAgICB0aGlzLl9zcGVlZCA9IDFcclxuICB9XHJcblxyXG4sIGV4dGVuZDoge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvciByZXR1cm5zIHRoZSB0YXJnZXQgb2YgdGhpcyBhbmltYXRpb25cclxuICAgICAqIEBwYXJhbSBvIG9iamVjdCB8fCBudW1iZXIgSW4gY2FzZSBvZiBPYmplY3QgaXQgaG9sZHMgYWxsIHBhcmFtZXRlcnMuIEluIGNhc2Ugb2YgbnVtYmVyIGl0cyB0aGUgZHVyYXRpb24gb2YgdGhlIGFuaW1hdGlvblxyXG4gICAgICogQHBhcmFtIGVhc2UgZnVuY3Rpb24gfHwgc3RyaW5nIEZ1bmN0aW9uIHdoaWNoIHNob3VsZCBiZSB1c2VkIGZvciBlYXNpbmcgb3IgZWFzaW5nIGtleXdvcmRcclxuICAgICAqIEBwYXJhbSBkZWxheSBOdW1iZXIgaW5kaWNhdGluZyB0aGUgZGVsYXkgYmVmb3JlIHRoZSBhbmltYXRpb24gc3RhcnRzXHJcbiAgICAgKiBAcmV0dXJuIHRhcmdldCB8fCB0aGlzXHJcbiAgICAgKi9cclxuICAgIGFuaW1hdGU6IGZ1bmN0aW9uKG8sIGVhc2UsIGRlbGF5KXtcclxuXHJcbiAgICAgIGlmKHR5cGVvZiBvID09ICdvYmplY3QnKXtcclxuICAgICAgICBlYXNlID0gby5lYXNlXHJcbiAgICAgICAgZGVsYXkgPSBvLmRlbGF5XHJcbiAgICAgICAgbyA9IG8uZHVyYXRpb25cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHNpdHVhdGlvbiA9IG5ldyBTVkcuU2l0dWF0aW9uKHtcclxuICAgICAgICBkdXJhdGlvbjogbyB8fCAxMDAwLFxyXG4gICAgICAgIGRlbGF5OiBkZWxheSB8fCAwLFxyXG4gICAgICAgIGVhc2U6IFNWRy5lYXNpbmdbZWFzZSB8fCAnLSddIHx8IGVhc2VcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHRoaXMucXVldWUoc2l0dWF0aW9uKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldHMgYSBkZWxheSBiZWZvcmUgdGhlIG5leHQgZWxlbWVudCBvZiB0aGUgcXVldWUgaXMgY2FsbGVkXHJcbiAgICAgKiBAcGFyYW0gZGVsYXkgRHVyYXRpb24gb2YgZGVsYXkgaW4gbWlsbGlzZWNvbmRzXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMudGFyZ2V0KClcclxuICAgICAqL1xyXG4gICwgZGVsYXk6IGZ1bmN0aW9uKGRlbGF5KXtcclxuICAgICAgLy8gVGhlIGRlbGF5IGlzIHBlcmZvcm1lZCBieSBhbiBlbXB0eSBzaXR1YXRpb24gd2l0aCBpdHMgZHVyYXRpb25cclxuICAgICAgLy8gYXR0cmlidXRlIHNldCB0byB0aGUgZHVyYXRpb24gb2YgdGhlIGRlbGF5XHJcbiAgICAgIHZhciBzaXR1YXRpb24gPSBuZXcgU1ZHLlNpdHVhdGlvbih7XHJcbiAgICAgICAgZHVyYXRpb246IGRlbGF5LFxyXG4gICAgICAgIGRlbGF5OiAwLFxyXG4gICAgICAgIGVhc2U6IFNWRy5lYXNpbmdbJy0nXVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMucXVldWUoc2l0dWF0aW9uKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0cyBvciByZXR1cm5zIHRoZSB0YXJnZXQgb2YgdGhpcyBhbmltYXRpb25cclxuICAgICAqIEBwYXJhbSBudWxsIHx8IHRhcmdldCBTVkcuRWxlbWVudCB3aGljaCBzaG91bGQgYmUgc2V0IGFzIG5ldyB0YXJnZXRcclxuICAgICAqIEByZXR1cm4gdGFyZ2V0IHx8IHRoaXNcclxuICAgICAqL1xyXG4gICwgdGFyZ2V0OiBmdW5jdGlvbih0YXJnZXQpe1xyXG4gICAgICBpZih0YXJnZXQgJiYgdGFyZ2V0IGluc3RhbmNlb2YgU1ZHLkVsZW1lbnQpe1xyXG4gICAgICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldFxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLl90YXJnZXRcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm5zIHRoZSBhYnNvbHV0ZSBwb3NpdGlvbiBhdCBhIGdpdmVuIHRpbWVcclxuICAsIHRpbWVUb0Fic1BvczogZnVuY3Rpb24odGltZXN0YW1wKXtcclxuICAgICAgcmV0dXJuICh0aW1lc3RhbXAgLSB0aGlzLnNpdHVhdGlvbi5zdGFydCkgLyAodGhpcy5zaXR1YXRpb24uZHVyYXRpb24vdGhpcy5fc3BlZWQpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmV0dXJucyB0aGUgdGltZXN0YW1wIGZyb20gYSBnaXZlbiBhYnNvbHV0ZSBwb3NpdG9uXHJcbiAgLCBhYnNQb3NUb1RpbWU6IGZ1bmN0aW9uKGFic1Bvcyl7XHJcbiAgICAgIHJldHVybiB0aGlzLnNpdHVhdGlvbi5kdXJhdGlvbi90aGlzLl9zcGVlZCAqIGFic1BvcyArIHRoaXMuc2l0dWF0aW9uLnN0YXJ0XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc3RhcnRzIHRoZSBhbmltYXRpb25sb29wXHJcbiAgLCBzdGFydEFuaW1GcmFtZTogZnVuY3Rpb24oKXtcclxuICAgICAgdGhpcy5zdG9wQW5pbUZyYW1lKClcclxuICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXsgdGhpcy5zdGVwKCkgfS5iaW5kKHRoaXMpKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNhbmNlbHMgdGhlIGFuaW1hdGlvbmZyYW1lXHJcbiAgLCBzdG9wQW5pbUZyYW1lOiBmdW5jdGlvbigpe1xyXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBraWNrcyBvZmYgdGhlIGFuaW1hdGlvbiAtIG9ubHkgZG9lcyBzb21ldGhpbmcgd2hlbiB0aGUgcXVldWUgaXMgY3VycmVudGx5IG5vdCBhY3RpdmUgYW5kIGF0IGxlYXN0IG9uZSBzaXR1YXRpb24gaXMgc2V0XHJcbiAgLCBzdGFydDogZnVuY3Rpb24oKXtcclxuICAgICAgLy8gZG9udCBzdGFydCBpZiBhbHJlYWR5IHN0YXJ0ZWRcclxuICAgICAgaWYoIXRoaXMuYWN0aXZlICYmIHRoaXMuc2l0dWF0aW9uKXtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWVcclxuICAgICAgICB0aGlzLnN0YXJ0Q3VycmVudCgpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLy8gc3RhcnQgdGhlIGN1cnJlbnQgc2l0dWF0aW9uXHJcbiAgLCBzdGFydEN1cnJlbnQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHRoaXMuc2l0dWF0aW9uLnN0YXJ0ID0gK25ldyBEYXRlICsgdGhpcy5zaXR1YXRpb24uZGVsYXkvdGhpcy5fc3BlZWRcclxuICAgICAgdGhpcy5zaXR1YXRpb24uZmluaXNoID0gdGhpcy5zaXR1YXRpb24uc3RhcnQgKyB0aGlzLnNpdHVhdGlvbi5kdXJhdGlvbi90aGlzLl9zcGVlZFxyXG4gICAgICByZXR1cm4gdGhpcy5pbml0QW5pbWF0aW9ucygpLnN0ZXAoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogYWRkcyBhIGZ1bmN0aW9uIC8gU2l0dWF0aW9uIHRvIHRoZSBhbmltYXRpb24gcXVldWVcclxuICAgICAqIEBwYXJhbSBmbiBmdW5jdGlvbiAvIHNpdHVhdGlvbiB0byBhZGRcclxuICAgICAqIEByZXR1cm4gdGhpc1xyXG4gICAgICovXHJcbiAgLCBxdWV1ZTogZnVuY3Rpb24oZm4pe1xyXG4gICAgICBpZih0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyB8fCBmbiBpbnN0YW5jZW9mIFNWRy5TaXR1YXRpb24pXHJcbiAgICAgICAgdGhpcy5zaXR1YXRpb25zLnB1c2goZm4pXHJcblxyXG4gICAgICBpZighdGhpcy5zaXR1YXRpb24pIHRoaXMuc2l0dWF0aW9uID0gdGhpcy5zaXR1YXRpb25zLnNoaWZ0KClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBwdWxscyBuZXh0IGVsZW1lbnQgZnJvbSB0aGUgcXVldWUgYW5kIGV4ZWN1dGUgaXRcclxuICAgICAqIEByZXR1cm4gdGhpc1xyXG4gICAgICovXHJcbiAgLCBkZXF1ZXVlOiBmdW5jdGlvbigpe1xyXG4gICAgICAvLyBzdG9wIGN1cnJlbnQgYW5pbWF0aW9uXHJcbiAgICAgIHRoaXMuc3RvcCgpXHJcblxyXG4gICAgICAvLyBnZXQgbmV4dCBhbmltYXRpb24gZnJvbSBxdWV1ZVxyXG4gICAgICB0aGlzLnNpdHVhdGlvbiA9IHRoaXMuc2l0dWF0aW9ucy5zaGlmdCgpXHJcblxyXG4gICAgICBpZih0aGlzLnNpdHVhdGlvbil7XHJcbiAgICAgICAgaWYodGhpcy5zaXR1YXRpb24gaW5zdGFuY2VvZiBTVkcuU2l0dWF0aW9uKSB7XHJcbiAgICAgICAgICB0aGlzLnN0YXJ0KClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gSWYgaXQgaXMgbm90IGEgU1ZHLlNpdHVhdGlvbiwgdGhlbiBpdCBpcyBhIGZ1bmN0aW9uLCB3ZSBleGVjdXRlIGl0XHJcbiAgICAgICAgICB0aGlzLnNpdHVhdGlvbi5jYWxsKHRoaXMpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZXMgYWxsIGFuaW1hdGlvbnMgdG8gdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGVsZW1lbnRcclxuICAgIC8vIHRoaXMgaXMgaW1wb3J0YW50IHdoZW4gb25lIHByb3BlcnR5IGNvdWxkIGJlIGNoYW5nZWQgZnJvbSBhbm90aGVyIHByb3BlcnR5XHJcbiAgLCBpbml0QW5pbWF0aW9uczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBpLCBqLCBzb3VyY2VcclxuICAgICAgdmFyIHMgPSB0aGlzLnNpdHVhdGlvblxyXG5cclxuICAgICAgaWYocy5pbml0KSByZXR1cm4gdGhpc1xyXG5cclxuICAgICAgZm9yKGkgaW4gcy5hbmltYXRpb25zKXtcclxuICAgICAgICBzb3VyY2UgPSB0aGlzLnRhcmdldCgpW2ldKClcclxuXHJcbiAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkoc291cmNlKSkge1xyXG4gICAgICAgICAgc291cmNlID0gW3NvdXJjZV1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFBcnJheS5pc0FycmF5KHMuYW5pbWF0aW9uc1tpXSkpIHtcclxuICAgICAgICAgIHMuYW5pbWF0aW9uc1tpXSA9IFtzLmFuaW1hdGlvbnNbaV1dXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2lmKHMuYW5pbWF0aW9uc1tpXS5sZW5ndGggPiBzb3VyY2UubGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gIHNvdXJjZS5jb25jYXQgPSBzb3VyY2UuY29uY2F0KHMuYW5pbWF0aW9uc1tpXS5zbGljZShzb3VyY2UubGVuZ3RoLCBzLmFuaW1hdGlvbnNbaV0ubGVuZ3RoKSlcclxuICAgICAgICAvL31cclxuXHJcbiAgICAgICAgZm9yKGogPSBzb3VyY2UubGVuZ3RoOyBqLS07KSB7XHJcbiAgICAgICAgICAvLyBUaGUgY29uZGl0aW9uIGlzIGJlY2F1c2Ugc29tZSBtZXRob2RzIHJldHVybiBhIG5vcm1hbCBudW1iZXIgaW5zdGVhZFxyXG4gICAgICAgICAgLy8gb2YgYSBTVkcuTnVtYmVyXHJcbiAgICAgICAgICBpZihzLmFuaW1hdGlvbnNbaV1bal0gaW5zdGFuY2VvZiBTVkcuTnVtYmVyKVxyXG4gICAgICAgICAgICBzb3VyY2Vbal0gPSBuZXcgU1ZHLk51bWJlcihzb3VyY2Vbal0pXHJcblxyXG4gICAgICAgICAgcy5hbmltYXRpb25zW2ldW2pdID0gc291cmNlW2pdLm1vcnBoKHMuYW5pbWF0aW9uc1tpXVtqXSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvcihpIGluIHMuYXR0cnMpe1xyXG4gICAgICAgIHMuYXR0cnNbaV0gPSBuZXcgU1ZHLk1vcnBoT2JqKHRoaXMudGFyZ2V0KCkuYXR0cihpKSwgcy5hdHRyc1tpXSlcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yKGkgaW4gcy5zdHlsZXMpe1xyXG4gICAgICAgIHMuc3R5bGVzW2ldID0gbmV3IFNWRy5Nb3JwaE9iaih0aGlzLnRhcmdldCgpLnN0eWxlKGkpLCBzLnN0eWxlc1tpXSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcy5pbml0aWFsVHJhbnNmb3JtYXRpb24gPSB0aGlzLnRhcmdldCgpLm1hdHJpeGlmeSgpXHJcblxyXG4gICAgICBzLmluaXQgPSB0cnVlXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgLCBjbGVhclF1ZXVlOiBmdW5jdGlvbigpe1xyXG4gICAgICB0aGlzLnNpdHVhdGlvbnMgPSBbXVxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICwgY2xlYXJDdXJyZW50OiBmdW5jdGlvbigpe1xyXG4gICAgICB0aGlzLnNpdHVhdGlvbiA9IG51bGxcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8qKiBzdG9wcyB0aGUgYW5pbWF0aW9uIGltbWVkaWF0ZWx5XHJcbiAgICAgKiBAcGFyYW0ganVtcFRvRW5kIEEgQm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdG8gY29tcGxldGUgdGhlIGN1cnJlbnQgYW5pbWF0aW9uIGltbWVkaWF0ZWx5LlxyXG4gICAgICogQHBhcmFtIGNsZWFyUXVldWUgQSBCb29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0byByZW1vdmUgcXVldWVkIGFuaW1hdGlvbiBhcyB3ZWxsLlxyXG4gICAgICogQHJldHVybiB0aGlzXHJcbiAgICAgKi9cclxuICAsIHN0b3A6IGZ1bmN0aW9uKGp1bXBUb0VuZCwgY2xlYXJRdWV1ZSl7XHJcbiAgICAgIHZhciBhY3RpdmUgPSB0aGlzLmFjdGl2ZVxyXG4gICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXHJcblxyXG4gICAgICBpZihjbGVhclF1ZXVlKXtcclxuICAgICAgICB0aGlzLmNsZWFyUXVldWUoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZihqdW1wVG9FbmQgJiYgdGhpcy5zaXR1YXRpb24pe1xyXG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIHNpdHVhdGlvbiBpZiBpdCB3YXMgbm90XHJcbiAgICAgICAgIWFjdGl2ZSAmJiB0aGlzLnN0YXJ0Q3VycmVudCgpXHJcbiAgICAgICAgdGhpcy5hdEVuZCgpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RvcEFuaW1GcmFtZSgpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5jbGVhckN1cnJlbnQoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiByZXNldHMgdGhlIGVsZW1lbnQgdG8gdGhlIHN0YXRlIHdoZXJlIHRoZSBjdXJyZW50IGVsZW1lbnQgaGFzIHN0YXJ0ZWRcclxuICAgICAqIEByZXR1cm4gdGhpc1xyXG4gICAgICovXHJcbiAgLCByZXNldDogZnVuY3Rpb24oKXtcclxuICAgICAgaWYodGhpcy5zaXR1YXRpb24pe1xyXG4gICAgICAgIHZhciB0ZW1wID0gdGhpcy5zaXR1YXRpb25cclxuICAgICAgICB0aGlzLnN0b3AoKVxyXG4gICAgICAgIHRoaXMuc2l0dWF0aW9uID0gdGVtcFxyXG4gICAgICAgIHRoaXMuYXRTdGFydCgpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvLyBTdG9wIHRoZSBjdXJyZW50bHktcnVubmluZyBhbmltYXRpb24sIHJlbW92ZSBhbGwgcXVldWVkIGFuaW1hdGlvbnMsIGFuZCBjb21wbGV0ZSBhbGwgYW5pbWF0aW9ucyBmb3IgdGhlIGVsZW1lbnQuXHJcbiAgLCBmaW5pc2g6IGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICB0aGlzLnN0b3AodHJ1ZSwgZmFsc2UpXHJcblxyXG4gICAgICB3aGlsZSh0aGlzLmRlcXVldWUoKS5zaXR1YXRpb24gJiYgdGhpcy5zdG9wKHRydWUsIGZhbHNlKSk7XHJcblxyXG4gICAgICB0aGlzLmNsZWFyUXVldWUoKS5jbGVhckN1cnJlbnQoKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvLyBzZXQgdGhlIGludGVybmFsIGFuaW1hdGlvbiBwb2ludGVyIGF0IHRoZSBzdGFydCBwb3NpdGlvbiwgYmVmb3JlIGFueSBsb29wcywgYW5kIHVwZGF0ZXMgdGhlIHZpc3VhbGlzYXRpb25cclxuICAsIGF0U3RhcnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdCgwLCB0cnVlKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHNldCB0aGUgaW50ZXJuYWwgYW5pbWF0aW9uIHBvaW50ZXIgYXQgdGhlIGVuZCBwb3NpdGlvbiwgYWZ0ZXIgYWxsIHRoZSBsb29wcywgYW5kIHVwZGF0ZXMgdGhlIHZpc3VhbGlzYXRpb25cclxuICAsIGF0RW5kOiBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHRoaXMuc2l0dWF0aW9uLmxvb3BzID09PSB0cnVlKSB7XHJcbiAgICAgICAgLy8gSWYgaW4gYSBpbmZpbml0ZSBsb29wLCB3ZSBlbmQgdGhlIGN1cnJlbnQgaXRlcmF0aW9uXHJcbiAgICAgICAgdGhpcy5zaXR1YXRpb24ubG9vcHMgPSB0aGlzLnNpdHVhdGlvbi5sb29wICsgMVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZih0eXBlb2YgdGhpcy5zaXR1YXRpb24ubG9vcHMgPT0gJ251bWJlcicpIHtcclxuICAgICAgICAvLyBJZiBwZXJmb3JtaW5nIGEgZmluaXRlIG51bWJlciBvZiBsb29wcywgd2UgZ28gYWZ0ZXIgYWxsIHRoZSBsb29wc1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF0KHRoaXMuc2l0dWF0aW9uLmxvb3BzLCB0cnVlKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIElmIG5vIGxvb3BzLCB3ZSBqdXN0IGdvIGF0IHRoZSBlbmRcclxuICAgICAgICByZXR1cm4gdGhpcy5hdCgxLCB0cnVlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2V0IHRoZSBpbnRlcm5hbCBhbmltYXRpb24gcG9pbnRlciB0byB0aGUgc3BlY2lmaWVkIHBvc2l0aW9uIGFuZCB1cGRhdGVzIHRoZSB2aXN1YWxpc2F0aW9uXHJcbiAgICAvLyBpZiBpc0Fic1BvcyBpcyB0cnVlLCBwb3MgaXMgdHJlYXRlZCBhcyBhbiBhYnNvbHV0ZSBwb3NpdGlvblxyXG4gICwgYXQ6IGZ1bmN0aW9uKHBvcywgaXNBYnNQb3Mpe1xyXG4gICAgICB2YXIgZHVyRGl2U3BkID0gdGhpcy5zaXR1YXRpb24uZHVyYXRpb24vdGhpcy5fc3BlZWRcclxuXHJcbiAgICAgIHRoaXMuYWJzUG9zID0gcG9zXHJcbiAgICAgIC8vIElmIHBvcyBpcyBub3QgYW4gYWJzb2x1dGUgcG9zaXRpb24sIHdlIGNvbnZlcnQgaXQgaW50byBvbmVcclxuICAgICAgaWYgKCFpc0Fic1Bvcykge1xyXG4gICAgICAgIGlmICh0aGlzLnNpdHVhdGlvbi5yZXZlcnNlZCkgdGhpcy5hYnNQb3MgPSAxIC0gdGhpcy5hYnNQb3NcclxuICAgICAgICB0aGlzLmFic1BvcyArPSB0aGlzLnNpdHVhdGlvbi5sb29wXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2l0dWF0aW9uLnN0YXJ0ID0gK25ldyBEYXRlIC0gdGhpcy5hYnNQb3MgKiBkdXJEaXZTcGRcclxuICAgICAgdGhpcy5zaXR1YXRpb24uZmluaXNoID0gdGhpcy5zaXR1YXRpb24uc3RhcnQgKyBkdXJEaXZTcGRcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLnN0ZXAodHJ1ZSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldHMgb3IgcmV0dXJucyB0aGUgc3BlZWQgb2YgdGhlIGFuaW1hdGlvbnNcclxuICAgICAqIEBwYXJhbSBzcGVlZCBudWxsIHx8IE51bWJlciBUaGUgbmV3IHNwZWVkIG9mIHRoZSBhbmltYXRpb25zXHJcbiAgICAgKiBAcmV0dXJuIE51bWJlciB8fCB0aGlzXHJcbiAgICAgKi9cclxuICAsIHNwZWVkOiBmdW5jdGlvbihzcGVlZCl7XHJcbiAgICAgIGlmIChzcGVlZCA9PT0gMCkgcmV0dXJuIHRoaXMucGF1c2UoKVxyXG5cclxuICAgICAgaWYgKHNwZWVkKSB7XHJcbiAgICAgICAgdGhpcy5fc3BlZWQgPSBzcGVlZFxyXG4gICAgICAgIC8vIFdlIHVzZSBhbiBhYnNvbHV0ZSBwb3NpdGlvbiBoZXJlIHNvIHRoYXQgc3BlZWQgY2FuIGFmZmVjdCB0aGUgZGVsYXkgYmVmb3JlIHRoZSBhbmltYXRpb25cclxuICAgICAgICByZXR1cm4gdGhpcy5hdCh0aGlzLmFic1BvcywgdHJ1ZSlcclxuICAgICAgfSBlbHNlIHJldHVybiB0aGlzLl9zcGVlZFxyXG4gICAgfVxyXG5cclxuICAgIC8vIE1ha2UgbG9vcGFibGVcclxuICAsIGxvb3A6IGZ1bmN0aW9uKHRpbWVzLCByZXZlcnNlKSB7XHJcbiAgICAgIHZhciBjID0gdGhpcy5sYXN0KClcclxuXHJcbiAgICAgIC8vIHN0b3JlIHRvdGFsIGxvb3BzXHJcbiAgICAgIGMubG9vcHMgPSAodGltZXMgIT0gbnVsbCkgPyB0aW1lcyA6IHRydWVcclxuICAgICAgYy5sb29wID0gMFxyXG5cclxuICAgICAgaWYocmV2ZXJzZSkgYy5yZXZlcnNpbmcgPSB0cnVlXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGF1c2VzIHRoZSBhbmltYXRpb25cclxuICAsIHBhdXNlOiBmdW5jdGlvbigpe1xyXG4gICAgICB0aGlzLnBhdXNlZCA9IHRydWVcclxuICAgICAgdGhpcy5zdG9wQW5pbUZyYW1lKClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLy8gdW5wYXVzZSB0aGUgYW5pbWF0aW9uXHJcbiAgLCBwbGF5OiBmdW5jdGlvbigpe1xyXG4gICAgICBpZighdGhpcy5wYXVzZWQpIHJldHVybiB0aGlzXHJcbiAgICAgIHRoaXMucGF1c2VkID0gZmFsc2VcclxuICAgICAgLy8gV2UgdXNlIGFuIGFic29sdXRlIHBvc2l0aW9uIGhlcmUgc28gdGhhdCB0aGUgZGVsYXkgYmVmb3JlIHRoZSBhbmltYXRpb24gY2FuIGJlIHBhdXNlZFxyXG4gICAgICByZXR1cm4gdGhpcy5hdCh0aGlzLmFic1BvcywgdHJ1ZSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRvZ2dsZSBvciBzZXQgdGhlIGRpcmVjdGlvbiBvZiB0aGUgYW5pbWF0aW9uXHJcbiAgICAgKiB0cnVlIHNldHMgZGlyZWN0aW9uIHRvIGJhY2t3YXJkcyB3aGlsZSBmYWxzZSBzZXRzIGl0IHRvIGZvcndhcmRzXHJcbiAgICAgKiBAcGFyYW0gcmV2ZXJzZWQgQm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdG8gcmV2ZXJzZSB0aGUgYW5pbWF0aW9uIG9yIG5vdCAoZGVmYXVsdDogdG9nZ2xlIHRoZSByZXZlcnNlIHN0YXR1cylcclxuICAgICAqIEByZXR1cm4gdGhpc1xyXG4gICAgICovXHJcbiAgLCByZXZlcnNlOiBmdW5jdGlvbihyZXZlcnNlZCl7XHJcbiAgICAgIHZhciBjID0gdGhpcy5sYXN0KClcclxuXHJcbiAgICAgIGlmKHR5cGVvZiByZXZlcnNlZCA9PSAndW5kZWZpbmVkJykgYy5yZXZlcnNlZCA9ICFjLnJldmVyc2VkXHJcbiAgICAgIGVsc2UgYy5yZXZlcnNlZCA9IHJldmVyc2VkXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJldHVybnMgYSBmbG9hdCBmcm9tIDAtMSBpbmRpY2F0aW5nIHRoZSBwcm9ncmVzcyBvZiB0aGUgY3VycmVudCBhbmltYXRpb25cclxuICAgICAqIEBwYXJhbSBlYXNlZCBCb29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0aGUgcmV0dXJuZWQgcG9zaXRpb24gc2hvdWxkIGJlIGVhc2VkIG9yIG5vdFxyXG4gICAgICogQHJldHVybiBudW1iZXJcclxuICAgICAqL1xyXG4gICwgcHJvZ3Jlc3M6IGZ1bmN0aW9uKGVhc2VJdCl7XHJcbiAgICAgIHJldHVybiBlYXNlSXQgPyB0aGlzLnNpdHVhdGlvbi5lYXNlKHRoaXMucG9zKSA6IHRoaXMucG9zXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGRzIGEgY2FsbGJhY2sgZnVuY3Rpb24gd2hpY2ggaXMgY2FsbGVkIHdoZW4gdGhlIGN1cnJlbnQgYW5pbWF0aW9uIGlzIGZpbmlzaGVkXHJcbiAgICAgKiBAcGFyYW0gZm4gRnVuY3Rpb24gd2hpY2ggc2hvdWxkIGJlIGV4ZWN1dGVkIGFzIGNhbGxiYWNrXHJcbiAgICAgKiBAcmV0dXJuIG51bWJlclxyXG4gICAgICovXHJcbiAgLCBhZnRlcjogZnVuY3Rpb24oZm4pe1xyXG4gICAgICB2YXIgYyA9IHRoaXMubGFzdCgpXHJcbiAgICAgICAgLCB3cmFwcGVyID0gZnVuY3Rpb24gd3JhcHBlcihlKXtcclxuICAgICAgICAgICAgaWYoZS5kZXRhaWwuc2l0dWF0aW9uID09IGMpe1xyXG4gICAgICAgICAgICAgIGZuLmNhbGwodGhpcywgYylcclxuICAgICAgICAgICAgICB0aGlzLm9mZignZmluaXNoZWQuZngnLCB3cmFwcGVyKSAvLyBwcmV2ZW50IG1lbW9yeSBsZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMudGFyZ2V0KCkub24oJ2ZpbmlzaGVkLmZ4Jywgd3JhcHBlcilcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLl9jYWxsU3RhcnQoKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGFkZHMgYSBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgd2hlbmV2ZXIgb25lIGFuaW1hdGlvbiBzdGVwIGlzIHBlcmZvcm1lZFxyXG4gICwgZHVyaW5nOiBmdW5jdGlvbihmbil7XHJcbiAgICAgIHZhciBjID0gdGhpcy5sYXN0KClcclxuICAgICAgICAsIHdyYXBwZXIgPSBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgaWYoZS5kZXRhaWwuc2l0dWF0aW9uID09IGMpe1xyXG4gICAgICAgICAgICAgIGZuLmNhbGwodGhpcywgZS5kZXRhaWwucG9zLCBTVkcubW9ycGgoZS5kZXRhaWwucG9zKSwgZS5kZXRhaWwuZWFzZWQsIGMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgIC8vIHNlZSBhYm92ZVxyXG4gICAgICB0aGlzLnRhcmdldCgpLm9mZignZHVyaW5nLmZ4Jywgd3JhcHBlcikub24oJ2R1cmluZy5meCcsIHdyYXBwZXIpXHJcblxyXG4gICAgICB0aGlzLmFmdGVyKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5vZmYoJ2R1cmluZy5meCcsIHdyYXBwZXIpXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5fY2FsbFN0YXJ0KClcclxuICAgIH1cclxuXHJcbiAgICAvLyBjYWxscyBhZnRlciBBTEwgYW5pbWF0aW9ucyBpbiB0aGUgcXVldWUgYXJlIGZpbmlzaGVkXHJcbiAgLCBhZnRlckFsbDogZnVuY3Rpb24oZm4pe1xyXG4gICAgICB2YXIgd3JhcHBlciA9IGZ1bmN0aW9uIHdyYXBwZXIoZSl7XHJcbiAgICAgICAgICAgIGZuLmNhbGwodGhpcylcclxuICAgICAgICAgICAgdGhpcy5vZmYoJ2FsbGZpbmlzaGVkLmZ4Jywgd3JhcHBlcilcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgIC8vIHNlZSBhYm92ZVxyXG4gICAgICB0aGlzLnRhcmdldCgpLm9mZignYWxsZmluaXNoZWQuZngnLCB3cmFwcGVyKS5vbignYWxsZmluaXNoZWQuZngnLCB3cmFwcGVyKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuX2NhbGxTdGFydCgpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2FsbHMgb24gZXZlcnkgYW5pbWF0aW9uIHN0ZXAgZm9yIGFsbCBhbmltYXRpb25zXHJcbiAgLCBkdXJpbmdBbGw6IGZ1bmN0aW9uKGZuKXtcclxuICAgICAgdmFyIHdyYXBwZXIgPSBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgZm4uY2FsbCh0aGlzLCBlLmRldGFpbC5wb3MsIFNWRy5tb3JwaChlLmRldGFpbC5wb3MpLCBlLmRldGFpbC5lYXNlZCwgZS5kZXRhaWwuc2l0dWF0aW9uKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgdGhpcy50YXJnZXQoKS5vZmYoJ2R1cmluZy5meCcsIHdyYXBwZXIpLm9uKCdkdXJpbmcuZngnLCB3cmFwcGVyKVxyXG5cclxuICAgICAgdGhpcy5hZnRlckFsbChmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMub2ZmKCdkdXJpbmcuZngnLCB3cmFwcGVyKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuX2NhbGxTdGFydCgpXHJcbiAgICB9XHJcblxyXG4gICwgbGFzdDogZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIHRoaXMuc2l0dWF0aW9ucy5sZW5ndGggPyB0aGlzLnNpdHVhdGlvbnNbdGhpcy5zaXR1YXRpb25zLmxlbmd0aC0xXSA6IHRoaXMuc2l0dWF0aW9uXHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWRkcyBvbmUgcHJvcGVydHkgdG8gdGhlIGFuaW1hdGlvbnNcclxuICAsIGFkZDogZnVuY3Rpb24obWV0aG9kLCBhcmdzLCB0eXBlKXtcclxuICAgICAgdGhpcy5sYXN0KClbdHlwZSB8fCAnYW5pbWF0aW9ucyddW21ldGhvZF0gPSBhcmdzXHJcbiAgICAgIHJldHVybiB0aGlzLl9jYWxsU3RhcnQoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBwZXJmb3JtIG9uZSBzdGVwIG9mIHRoZSBhbmltYXRpb25cclxuICAgICAqICBAcGFyYW0gaWdub3JlVGltZSBCb29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0byBpZ25vcmUgdGltZSBhbmQgdXNlIHBvc2l0aW9uIGRpcmVjdGx5IG9yIHJlY2FsY3VsYXRlIHBvc2l0aW9uIGJhc2VkIG9uIHRpbWVcclxuICAgICAqICBAcmV0dXJuIHRoaXNcclxuICAgICAqL1xyXG4gICwgc3RlcDogZnVuY3Rpb24oaWdub3JlVGltZSl7XHJcblxyXG4gICAgICAvLyBjb252ZXJ0IGN1cnJlbnQgdGltZSB0byBhbiBhYnNvbHV0ZSBwb3NpdGlvblxyXG4gICAgICBpZighaWdub3JlVGltZSkgdGhpcy5hYnNQb3MgPSB0aGlzLnRpbWVUb0Fic1BvcygrbmV3IERhdGUpXHJcblxyXG4gICAgICAvLyBUaGlzIHBhcnQgY29udmVydCBhbiBhYnNvbHV0ZSBwb3NpdGlvbiB0byBhIHBvc2l0aW9uXHJcbiAgICAgIGlmKHRoaXMuc2l0dWF0aW9uLmxvb3BzICE9PSBmYWxzZSkge1xyXG4gICAgICAgIHZhciBhYnNQb3MsIGFic1Bvc0ludCwgbGFzdExvb3BcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIGFic29sdXRlIHBvc2l0aW9uIGlzIGJlbG93IDAsIHdlIGp1c3QgdHJlYXQgaXQgYXMgaWYgaXQgd2FzIDBcclxuICAgICAgICBhYnNQb3MgPSBNYXRoLm1heCh0aGlzLmFic1BvcywgMClcclxuICAgICAgICBhYnNQb3NJbnQgPSBNYXRoLmZsb29yKGFic1BvcylcclxuXHJcbiAgICAgICAgaWYodGhpcy5zaXR1YXRpb24ubG9vcHMgPT09IHRydWUgfHwgYWJzUG9zSW50IDwgdGhpcy5zaXR1YXRpb24ubG9vcHMpIHtcclxuICAgICAgICAgIHRoaXMucG9zID0gYWJzUG9zIC0gYWJzUG9zSW50XHJcbiAgICAgICAgICBsYXN0TG9vcCA9IHRoaXMuc2l0dWF0aW9uLmxvb3BcclxuICAgICAgICAgIHRoaXMuc2l0dWF0aW9uLmxvb3AgPSBhYnNQb3NJbnRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5hYnNQb3MgPSB0aGlzLnNpdHVhdGlvbi5sb29wc1xyXG4gICAgICAgICAgdGhpcy5wb3MgPSAxXHJcbiAgICAgICAgICAvLyBUaGUgLTEgaGVyZSBpcyBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG8gdG9nZ2xlIHJldmVyc2VkIHdoZW4gYWxsIHRoZSBsb29wcyBoYXZlIGJlZW4gY29tcGxldGVkXHJcbiAgICAgICAgICBsYXN0TG9vcCA9IHRoaXMuc2l0dWF0aW9uLmxvb3AgLSAxXHJcbiAgICAgICAgICB0aGlzLnNpdHVhdGlvbi5sb29wID0gdGhpcy5zaXR1YXRpb24ubG9vcHNcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuc2l0dWF0aW9uLnJldmVyc2luZykge1xyXG4gICAgICAgICAgLy8gVG9nZ2xlIHJldmVyc2VkIGlmIGFuIG9kZCBudW1iZXIgb2YgbG9vcHMgYXMgb2NjdXJlZCBzaW5jZSB0aGUgbGFzdCBjYWxsIG9mIHN0ZXBcclxuICAgICAgICAgIHRoaXMuc2l0dWF0aW9uLnJldmVyc2VkID0gdGhpcy5zaXR1YXRpb24ucmV2ZXJzZWQgIT0gQm9vbGVhbigodGhpcy5zaXR1YXRpb24ubG9vcCAtIGxhc3RMb29wKSAlIDIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbG9vcCwgdGhlIGFic29sdXRlIHBvc2l0aW9uIG11c3Qgbm90IGJlIGFib3ZlIDFcclxuICAgICAgICB0aGlzLmFic1BvcyA9IE1hdGgubWluKHRoaXMuYWJzUG9zLCAxKVxyXG4gICAgICAgIHRoaXMucG9zID0gdGhpcy5hYnNQb3NcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gd2hpbGUgdGhlIGFic29sdXRlIHBvc2l0aW9uIGNhbiBiZSBiZWxvdyAwLCB0aGUgcG9zaXRpb24gbXVzdCBub3QgYmUgYmVsb3cgMFxyXG4gICAgICBpZih0aGlzLnBvcyA8IDApIHRoaXMucG9zID0gMFxyXG5cclxuICAgICAgaWYodGhpcy5zaXR1YXRpb24ucmV2ZXJzZWQpIHRoaXMucG9zID0gMSAtIHRoaXMucG9zXHJcblxyXG5cclxuICAgICAgLy8gYXBwbHkgZWFzaW5nXHJcbiAgICAgIHZhciBlYXNlZCA9IHRoaXMuc2l0dWF0aW9uLmVhc2UodGhpcy5wb3MpXHJcblxyXG4gICAgICAvLyBjYWxsIG9uY2UtY2FsbGJhY2tzXHJcbiAgICAgIGZvcih2YXIgaSBpbiB0aGlzLnNpdHVhdGlvbi5vbmNlKXtcclxuICAgICAgICBpZihpID4gdGhpcy5sYXN0UG9zICYmIGkgPD0gZWFzZWQpe1xyXG4gICAgICAgICAgdGhpcy5zaXR1YXRpb24ub25jZVtpXS5jYWxsKHRoaXMudGFyZ2V0KCksIHRoaXMucG9zLCBlYXNlZClcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLnNpdHVhdGlvbi5vbmNlW2ldXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBmaXJlIGR1cmluZyBjYWxsYmFjayB3aXRoIHBvc2l0aW9uLCBlYXNlZCBwb3NpdGlvbiBhbmQgY3VycmVudCBzaXR1YXRpb24gYXMgcGFyYW1ldGVyXHJcbiAgICAgIGlmKHRoaXMuYWN0aXZlKSB0aGlzLnRhcmdldCgpLmZpcmUoJ2R1cmluZycsIHtwb3M6IHRoaXMucG9zLCBlYXNlZDogZWFzZWQsIGZ4OiB0aGlzLCBzaXR1YXRpb246IHRoaXMuc2l0dWF0aW9ufSlcclxuXHJcbiAgICAgIC8vIHRoZSB1c2VyIG1heSBjYWxsIHN0b3Agb3IgZmluaXNoIGluIHRoZSBkdXJpbmcgY2FsbGJhY2tcclxuICAgICAgLy8gc28gbWFrZSBzdXJlIHRoYXQgd2Ugc3RpbGwgaGF2ZSBhIHZhbGlkIHNpdHVhdGlvblxyXG4gICAgICBpZighdGhpcy5zaXR1YXRpb24pe1xyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGFwcGx5IHRoZSBhY3R1YWwgYW5pbWF0aW9uIHRvIGV2ZXJ5IHByb3BlcnR5XHJcbiAgICAgIHRoaXMuZWFjaEF0KClcclxuXHJcbiAgICAgIC8vIGRvIGZpbmFsIGNvZGUgd2hlbiBzaXR1YXRpb24gaXMgZmluaXNoZWRcclxuICAgICAgaWYoKHRoaXMucG9zID09IDEgJiYgIXRoaXMuc2l0dWF0aW9uLnJldmVyc2VkKSB8fCAodGhpcy5zaXR1YXRpb24ucmV2ZXJzZWQgJiYgdGhpcy5wb3MgPT0gMCkpe1xyXG5cclxuICAgICAgICAvLyBzdG9wIGFuaW1hdGlvbiBjYWxsYmFja1xyXG4gICAgICAgIHRoaXMuc3RvcEFuaW1GcmFtZSgpXHJcblxyXG4gICAgICAgIC8vIGZpcmUgZmluaXNoZWQgY2FsbGJhY2sgd2l0aCBjdXJyZW50IHNpdHVhdGlvbiBhcyBwYXJhbWV0ZXJcclxuICAgICAgICB0aGlzLnRhcmdldCgpLmZpcmUoJ2ZpbmlzaGVkJywge2Z4OnRoaXMsIHNpdHVhdGlvbjogdGhpcy5zaXR1YXRpb259KVxyXG5cclxuICAgICAgICBpZighdGhpcy5zaXR1YXRpb25zLmxlbmd0aCl7XHJcbiAgICAgICAgICB0aGlzLnRhcmdldCgpLmZpcmUoJ2FsbGZpbmlzaGVkJylcclxuXHJcbiAgICAgICAgICAvLyBSZWNoZWNrIHRoZSBsZW5ndGggc2luY2UgdGhlIHVzZXIgbWF5IGNhbGwgYW5pbWF0ZSBpbiB0aGUgYWZ0ZXJBbGwgY2FsbGJhY2tcclxuICAgICAgICAgIGlmKCF0aGlzLnNpdHVhdGlvbnMubGVuZ3RoKXtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXQoKS5vZmYoJy5meCcpIC8vIHRoZXJlIHNob3VsZG50IGJlIGFueSBiaW5kaW5nIGxlZnQsIGJ1dCB0byBtYWtlIHN1cmUuLi5cclxuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc3RhcnQgbmV4dCBhbmltYXRpb25cclxuICAgICAgICBpZih0aGlzLmFjdGl2ZSkgdGhpcy5kZXF1ZXVlKClcclxuICAgICAgICBlbHNlIHRoaXMuY2xlYXJDdXJyZW50KClcclxuXHJcbiAgICAgIH1lbHNlIGlmKCF0aGlzLnBhdXNlZCAmJiB0aGlzLmFjdGl2ZSl7XHJcbiAgICAgICAgLy8gd2UgY29udGludWUgYW5pbWF0aW5nIHdoZW4gd2UgYXJlIG5vdCBhdCB0aGUgZW5kXHJcbiAgICAgICAgdGhpcy5zdGFydEFuaW1GcmFtZSgpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHNhdmUgbGFzdCBlYXNlZCBwb3NpdGlvbiBmb3Igb25jZSBjYWxsYmFjayB0cmlnZ2VyaW5nXHJcbiAgICAgIHRoaXMubGFzdFBvcyA9IGVhc2VkXHJcbiAgICAgIHJldHVybiB0aGlzXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNhbGN1bGF0ZXMgdGhlIHN0ZXAgZm9yIGV2ZXJ5IHByb3BlcnR5IGFuZCBjYWxscyBibG9jayB3aXRoIGl0XHJcbiAgLCBlYWNoQXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBpLCBsZW4sIGF0LCBzZWxmID0gdGhpcywgdGFyZ2V0ID0gdGhpcy50YXJnZXQoKSwgcyA9IHRoaXMuc2l0dWF0aW9uXHJcblxyXG4gICAgICAvLyBhcHBseSBhbmltYXRpb25zIHdoaWNoIGNhbiBiZSBjYWxsZWQgdHJvdWdoIGEgbWV0aG9kXHJcbiAgICAgIGZvcihpIGluIHMuYW5pbWF0aW9ucyl7XHJcblxyXG4gICAgICAgIGF0ID0gW10uY29uY2F0KHMuYW5pbWF0aW9uc1tpXSkubWFwKGZ1bmN0aW9uKGVsKXtcclxuICAgICAgICAgIHJldHVybiB0eXBlb2YgZWwgIT09ICdzdHJpbmcnICYmIGVsLmF0ID8gZWwuYXQocy5lYXNlKHNlbGYucG9zKSwgc2VsZi5wb3MpIDogZWxcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0YXJnZXRbaV0uYXBwbHkodGFyZ2V0LCBhdClcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGFwcGx5IGFuaW1hdGlvbiB3aGljaCBoYXMgdG8gYmUgYXBwbGllZCB3aXRoIGF0dHIoKVxyXG4gICAgICBmb3IoaSBpbiBzLmF0dHJzKXtcclxuXHJcbiAgICAgICAgYXQgPSBbaV0uY29uY2F0KHMuYXR0cnNbaV0pLm1hcChmdW5jdGlvbihlbCl7XHJcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIGVsICE9PSAnc3RyaW5nJyAmJiBlbC5hdCA/IGVsLmF0KHMuZWFzZShzZWxmLnBvcyksIHNlbGYucG9zKSA6IGVsXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGFyZ2V0LmF0dHIuYXBwbHkodGFyZ2V0LCBhdClcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGFwcGx5IGFuaW1hdGlvbiB3aGljaCBoYXMgdG8gYmUgYXBwbGllZCB3aXRoIHN0eWxlKClcclxuICAgICAgZm9yKGkgaW4gcy5zdHlsZXMpe1xyXG5cclxuICAgICAgICBhdCA9IFtpXS5jb25jYXQocy5zdHlsZXNbaV0pLm1hcChmdW5jdGlvbihlbCl7XHJcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIGVsICE9PSAnc3RyaW5nJyAmJiBlbC5hdCA/IGVsLmF0KHMuZWFzZShzZWxmLnBvcyksIHNlbGYucG9zKSA6IGVsXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGFyZ2V0LnN0eWxlLmFwcGx5KHRhcmdldCwgYXQpXHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBhbmltYXRlIGluaXRpYWxUcmFuc2Zvcm1hdGlvbiB3aGljaCBoYXMgdG8gYmUgY2hhaW5lZFxyXG4gICAgICBpZihzLnRyYW5zZm9ybXMubGVuZ3RoKXtcclxuXHJcbiAgICAgICAgLy8gZ2V0IGluaXRpYWwgaW5pdGlhbFRyYW5zZm9ybWF0aW9uXHJcbiAgICAgICAgYXQgPSBzLmluaXRpYWxUcmFuc2Zvcm1hdGlvblxyXG4gICAgICAgIGZvcihpID0gMCwgbGVuID0gcy50cmFuc2Zvcm1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcclxuXHJcbiAgICAgICAgICAvLyBnZXQgbmV4dCB0cmFuc2Zvcm1hdGlvbiBpbiBjaGFpblxyXG4gICAgICAgICAgdmFyIGEgPSBzLnRyYW5zZm9ybXNbaV1cclxuXHJcbiAgICAgICAgICAvLyBtdWx0aXBseSBtYXRyaXggZGlyZWN0bHlcclxuICAgICAgICAgIGlmKGEgaW5zdGFuY2VvZiBTVkcuTWF0cml4KXtcclxuXHJcbiAgICAgICAgICAgIGlmKGEucmVsYXRpdmUpe1xyXG4gICAgICAgICAgICAgIGF0ID0gYXQubXVsdGlwbHkobmV3IFNWRy5NYXRyaXgoKS5tb3JwaChhKS5hdChzLmVhc2UodGhpcy5wb3MpKSlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgYXQgPSBhdC5tb3JwaChhKS5hdChzLmVhc2UodGhpcy5wb3MpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gd2hlbiB0cmFuc2Zvcm1hdGlvbiBpcyBhYnNvbHV0ZSB3ZSBoYXZlIHRvIHJlc2V0IHRoZSBuZWVkZWQgdHJhbnNmb3JtYXRpb24gZmlyc3RcclxuICAgICAgICAgIGlmKCFhLnJlbGF0aXZlKVxyXG4gICAgICAgICAgICBhLnVuZG8oYXQuZXh0cmFjdCgpKVxyXG5cclxuICAgICAgICAgIC8vIGFuZCByZWFwcGx5IGl0IGFmdGVyXHJcbiAgICAgICAgICBhdCA9IGF0Lm11bHRpcGx5KGEuYXQocy5lYXNlKHRoaXMucG9zKSkpXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc2V0IG5ldyBtYXRyaXggb24gZWxlbWVudFxyXG4gICAgICAgIHRhcmdldC5tYXRyaXgoYXQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBhZGRzIGFuIG9uY2UtY2FsbGJhY2sgd2hpY2ggaXMgY2FsbGVkIGF0IGEgc3BlY2lmaWMgcG9zaXRpb24gYW5kIG5ldmVyIGFnYWluXHJcbiAgLCBvbmNlOiBmdW5jdGlvbihwb3MsIGZuLCBpc0Vhc2VkKXtcclxuICAgICAgdmFyIGMgPSB0aGlzLmxhc3QoKVxyXG4gICAgICBpZighaXNFYXNlZCkgcG9zID0gYy5lYXNlKHBvcylcclxuXHJcbiAgICAgIGMub25jZVtwb3NdID0gZm5cclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICwgX2NhbGxTdGFydDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGlzLnN0YXJ0KCl9LmJpbmQodGhpcyksIDApXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiwgcGFyZW50OiBTVkcuRWxlbWVudFxyXG5cclxuICAvLyBBZGQgbWV0aG9kIHRvIHBhcmVudCBlbGVtZW50c1xyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gR2V0IGZ4IG1vZHVsZSBvciBjcmVhdGUgYSBuZXcgb25lLCB0aGVuIGFuaW1hdGUgd2l0aCBnaXZlbiBkdXJhdGlvbiBhbmQgZWFzZVxyXG4gICAgYW5pbWF0ZTogZnVuY3Rpb24obywgZWFzZSwgZGVsYXkpIHtcclxuICAgICAgcmV0dXJuICh0aGlzLmZ4IHx8ICh0aGlzLmZ4ID0gbmV3IFNWRy5GWCh0aGlzKSkpLmFuaW1hdGUobywgZWFzZSwgZGVsYXkpXHJcbiAgICB9XHJcbiAgLCBkZWxheTogZnVuY3Rpb24oZGVsYXkpe1xyXG4gICAgICByZXR1cm4gKHRoaXMuZnggfHwgKHRoaXMuZnggPSBuZXcgU1ZHLkZYKHRoaXMpKSkuZGVsYXkoZGVsYXkpXHJcbiAgICB9XHJcbiAgLCBzdG9wOiBmdW5jdGlvbihqdW1wVG9FbmQsIGNsZWFyUXVldWUpIHtcclxuICAgICAgaWYgKHRoaXMuZngpXHJcbiAgICAgICAgdGhpcy5meC5zdG9wKGp1bXBUb0VuZCwgY2xlYXJRdWV1ZSlcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgLCBmaW5pc2g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAodGhpcy5meClcclxuICAgICAgICB0aGlzLmZ4LmZpbmlzaCgpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gUGF1c2UgY3VycmVudCBhbmltYXRpb25cclxuICAsIHBhdXNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHRoaXMuZngpXHJcbiAgICAgICAgdGhpcy5meC5wYXVzZSgpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gUGxheSBwYXVzZWQgY3VycmVudCBhbmltYXRpb25cclxuICAsIHBsYXk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAodGhpcy5meClcclxuICAgICAgICB0aGlzLmZ4LnBsYXkoKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIFNldC9HZXQgdGhlIHNwZWVkIG9mIHRoZSBhbmltYXRpb25zXHJcbiAgLCBzcGVlZDogZnVuY3Rpb24oc3BlZWQpIHtcclxuICAgICAgaWYgKHRoaXMuZngpXHJcbiAgICAgICAgaWYgKHNwZWVkID09IG51bGwpXHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5meC5zcGVlZCgpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgdGhpcy5meC5zcGVlZChzcGVlZClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSlcclxuXHJcbi8vIE1vcnBoT2JqIGlzIHVzZWQgd2hlbmV2ZXIgbm8gbW9ycGhhYmxlIG9iamVjdCBpcyBnaXZlblxyXG5TVkcuTW9ycGhPYmogPSBTVkcuaW52ZW50KHtcclxuXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihmcm9tLCB0byl7XHJcbiAgICAvLyBwcmVwYXJlIGNvbG9yIGZvciBtb3JwaGluZ1xyXG4gICAgaWYoU1ZHLkNvbG9yLmlzQ29sb3IodG8pKSByZXR1cm4gbmV3IFNWRy5Db2xvcihmcm9tKS5tb3JwaCh0bylcclxuICAgIC8vIHByZXBhcmUgdmFsdWUgbGlzdCBmb3IgbW9ycGhpbmdcclxuICAgIGlmKFNWRy5yZWdleC5kZWxpbWl0ZXIudGVzdChmcm9tKSkgcmV0dXJuIG5ldyBTVkcuQXJyYXkoZnJvbSkubW9ycGgodG8pXHJcbiAgICAvLyBwcmVwYXJlIG51bWJlciBmb3IgbW9ycGhpbmdcclxuICAgIGlmKFNWRy5yZWdleC5udW1iZXJBbmRVbml0LnRlc3QodG8pKSByZXR1cm4gbmV3IFNWRy5OdW1iZXIoZnJvbSkubW9ycGgodG8pXHJcblxyXG4gICAgLy8gcHJlcGFyZSBmb3IgcGxhaW4gbW9ycGhpbmdcclxuICAgIHRoaXMudmFsdWUgPSBmcm9tXHJcbiAgICB0aGlzLmRlc3RpbmF0aW9uID0gdG9cclxuICB9XHJcblxyXG4sIGV4dGVuZDoge1xyXG4gICAgYXQ6IGZ1bmN0aW9uKHBvcywgcmVhbCl7XHJcbiAgICAgIHJldHVybiByZWFsIDwgMSA/IHRoaXMudmFsdWUgOiB0aGlzLmRlc3RpbmF0aW9uXHJcbiAgICB9LFxyXG5cclxuICAgIHZhbHVlT2Y6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSlcclxuXHJcblNWRy5leHRlbmQoU1ZHLkZYLCB7XHJcbiAgLy8gQWRkIGFuaW1hdGFibGUgYXR0cmlidXRlc1xyXG4gIGF0dHI6IGZ1bmN0aW9uKGEsIHYsIHJlbGF0aXZlKSB7XHJcbiAgICAvLyBhcHBseSBhdHRyaWJ1dGVzIGluZGl2aWR1YWxseVxyXG4gICAgaWYgKHR5cGVvZiBhID09ICdvYmplY3QnKSB7XHJcbiAgICAgIGZvciAodmFyIGtleSBpbiBhKVxyXG4gICAgICAgIHRoaXMuYXR0cihrZXksIGFba2V5XSlcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmFkZChhLCB2LCAnYXR0cnMnKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIC8vIEFkZCBhbmltYXRhYmxlIHN0eWxlc1xyXG4sIHN0eWxlOiBmdW5jdGlvbihzLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIHMgPT0gJ29iamVjdCcpXHJcbiAgICAgIGZvciAodmFyIGtleSBpbiBzKVxyXG4gICAgICAgIHRoaXMuc3R5bGUoa2V5LCBzW2tleV0pXHJcblxyXG4gICAgZWxzZVxyXG4gICAgICB0aGlzLmFkZChzLCB2LCAnc3R5bGVzJylcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBBbmltYXRhYmxlIHgtYXhpc1xyXG4sIHg6IGZ1bmN0aW9uKHgsIHJlbGF0aXZlKSB7XHJcbiAgICBpZih0aGlzLnRhcmdldCgpIGluc3RhbmNlb2YgU1ZHLkcpe1xyXG4gICAgICB0aGlzLnRyYW5zZm9ybSh7eDp4fSwgcmVsYXRpdmUpXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG51bSA9IG5ldyBTVkcuTnVtYmVyKHgpXHJcbiAgICBudW0ucmVsYXRpdmUgPSByZWxhdGl2ZVxyXG4gICAgcmV0dXJuIHRoaXMuYWRkKCd4JywgbnVtKVxyXG4gIH1cclxuICAvLyBBbmltYXRhYmxlIHktYXhpc1xyXG4sIHk6IGZ1bmN0aW9uKHksIHJlbGF0aXZlKSB7XHJcbiAgICBpZih0aGlzLnRhcmdldCgpIGluc3RhbmNlb2YgU1ZHLkcpe1xyXG4gICAgICB0aGlzLnRyYW5zZm9ybSh7eTp5fSwgcmVsYXRpdmUpXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG51bSA9IG5ldyBTVkcuTnVtYmVyKHkpXHJcbiAgICBudW0ucmVsYXRpdmUgPSByZWxhdGl2ZVxyXG4gICAgcmV0dXJuIHRoaXMuYWRkKCd5JywgbnVtKVxyXG4gIH1cclxuICAvLyBBbmltYXRhYmxlIGNlbnRlciB4LWF4aXNcclxuLCBjeDogZnVuY3Rpb24oeCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWRkKCdjeCcsIG5ldyBTVkcuTnVtYmVyKHgpKVxyXG4gIH1cclxuICAvLyBBbmltYXRhYmxlIGNlbnRlciB5LWF4aXNcclxuLCBjeTogZnVuY3Rpb24oeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWRkKCdjeScsIG5ldyBTVkcuTnVtYmVyKHkpKVxyXG4gIH1cclxuICAvLyBBZGQgYW5pbWF0YWJsZSBtb3ZlXHJcbiwgbW92ZTogZnVuY3Rpb24oeCwgeSkge1xyXG4gICAgcmV0dXJuIHRoaXMueCh4KS55KHkpXHJcbiAgfVxyXG4gIC8vIEFkZCBhbmltYXRhYmxlIGNlbnRlclxyXG4sIGNlbnRlcjogZnVuY3Rpb24oeCwgeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY3goeCkuY3koeSlcclxuICB9XHJcbiAgLy8gQWRkIGFuaW1hdGFibGUgc2l6ZVxyXG4sIHNpemU6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIGlmICh0aGlzLnRhcmdldCgpIGluc3RhbmNlb2YgU1ZHLlRleHQpIHtcclxuICAgICAgLy8gYW5pbWF0ZSBmb250IHNpemUgZm9yIFRleHQgZWxlbWVudHNcclxuICAgICAgdGhpcy5hdHRyKCdmb250LXNpemUnLCB3aWR0aClcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBhbmltYXRlIGJib3ggYmFzZWQgc2l6ZSBmb3IgYWxsIG90aGVyIGVsZW1lbnRzXHJcbiAgICAgIHZhciBib3hcclxuXHJcbiAgICAgIGlmKCF3aWR0aCB8fCAhaGVpZ2h0KXtcclxuICAgICAgICBib3ggPSB0aGlzLnRhcmdldCgpLmJib3goKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZighd2lkdGgpe1xyXG4gICAgICAgIHdpZHRoID0gYm94LndpZHRoIC8gYm94LmhlaWdodCAgKiBoZWlnaHRcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoIWhlaWdodCl7XHJcbiAgICAgICAgaGVpZ2h0ID0gYm94LmhlaWdodCAvIGJveC53aWR0aCAgKiB3aWR0aFxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmFkZCgnd2lkdGgnICwgbmV3IFNWRy5OdW1iZXIod2lkdGgpKVxyXG4gICAgICAgICAgLmFkZCgnaGVpZ2h0JywgbmV3IFNWRy5OdW1iZXIoaGVpZ2h0KSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gQWRkIGFuaW1hdGFibGUgd2lkdGhcclxuLCB3aWR0aDogZnVuY3Rpb24od2lkdGgpIHtcclxuICAgIHJldHVybiB0aGlzLmFkZCgnd2lkdGgnLCBuZXcgU1ZHLk51bWJlcih3aWR0aCkpXHJcbiAgfVxyXG4gIC8vIEFkZCBhbmltYXRhYmxlIGhlaWdodFxyXG4sIGhlaWdodDogZnVuY3Rpb24oaGVpZ2h0KSB7XHJcbiAgICByZXR1cm4gdGhpcy5hZGQoJ2hlaWdodCcsIG5ldyBTVkcuTnVtYmVyKGhlaWdodCkpXHJcbiAgfVxyXG4gIC8vIEFkZCBhbmltYXRhYmxlIHBsb3RcclxuLCBwbG90OiBmdW5jdGlvbihhLCBiLCBjLCBkKSB7XHJcbiAgICAvLyBMaW5lcyBjYW4gYmUgcGxvdHRlZCB3aXRoIDQgYXJndW1lbnRzXHJcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09IDQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucGxvdChbYSwgYiwgYywgZF0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYWRkKCdwbG90JywgbmV3ICh0aGlzLnRhcmdldCgpLm1vcnBoQXJyYXkpKGEpKVxyXG4gIH1cclxuICAvLyBBZGQgbGVhZGluZyBtZXRob2RcclxuLCBsZWFkaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0KCkubGVhZGluZyA/XHJcbiAgICAgIHRoaXMuYWRkKCdsZWFkaW5nJywgbmV3IFNWRy5OdW1iZXIodmFsdWUpKSA6XHJcbiAgICAgIHRoaXNcclxuICB9XHJcbiAgLy8gQWRkIGFuaW1hdGFibGUgdmlld2JveFxyXG4sIHZpZXdib3g6IGZ1bmN0aW9uKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIGlmICh0aGlzLnRhcmdldCgpIGluc3RhbmNlb2YgU1ZHLkNvbnRhaW5lcikge1xyXG4gICAgICB0aGlzLmFkZCgndmlld2JveCcsIG5ldyBTVkcuVmlld0JveCh4LCB5LCB3aWR0aCwgaGVpZ2h0KSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuLCB1cGRhdGU6IGZ1bmN0aW9uKG8pIHtcclxuICAgIGlmICh0aGlzLnRhcmdldCgpIGluc3RhbmNlb2YgU1ZHLlN0b3ApIHtcclxuICAgICAgaWYgKHR5cGVvZiBvID09ICdudW1iZXInIHx8IG8gaW5zdGFuY2VvZiBTVkcuTnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlKHtcclxuICAgICAgICAgIG9mZnNldDogIGFyZ3VtZW50c1swXVxyXG4gICAgICAgICwgY29sb3I6ICAgYXJndW1lbnRzWzFdXHJcbiAgICAgICAgLCBvcGFjaXR5OiBhcmd1bWVudHNbMl1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoby5vcGFjaXR5ICE9IG51bGwpIHRoaXMuYXR0cignc3RvcC1vcGFjaXR5Jywgby5vcGFjaXR5KVxyXG4gICAgICBpZiAoby5jb2xvciAgICE9IG51bGwpIHRoaXMuYXR0cignc3RvcC1jb2xvcicsIG8uY29sb3IpXHJcbiAgICAgIGlmIChvLm9mZnNldCAgIT0gbnVsbCkgdGhpcy5hdHRyKCdvZmZzZXQnLCBvLm9mZnNldClcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufSlcclxuXG5TVkcuQm94ID0gU1ZHLmludmVudCh7XHJcbiAgY3JlYXRlOiBmdW5jdGlvbih4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICBpZiAodHlwZW9mIHggPT0gJ29iamVjdCcgJiYgISh4IGluc3RhbmNlb2YgU1ZHLkVsZW1lbnQpKSB7XHJcbiAgICAgIC8vIGNocm9tZXMgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGhhcyBubyB4IGFuZCB5IHByb3BlcnR5XHJcbiAgICAgIHJldHVybiBTVkcuQm94LmNhbGwodGhpcywgeC5sZWZ0ICE9IG51bGwgPyB4LmxlZnQgOiB4LnggLCB4LnRvcCAhPSBudWxsID8geC50b3AgOiB4LnksIHgud2lkdGgsIHguaGVpZ2h0KVxyXG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDQpIHtcclxuICAgICAgdGhpcy54ID0geFxyXG4gICAgICB0aGlzLnkgPSB5XHJcbiAgICAgIHRoaXMud2lkdGggPSB3aWR0aFxyXG4gICAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxyXG4gICAgfVxyXG5cclxuICAgIC8vIGFkZCBjZW50ZXIsIHJpZ2h0LCBib3R0b20uLi5cclxuICAgIGZ1bGxCb3godGhpcylcclxuICB9XHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBNZXJnZSByZWN0IGJveCB3aXRoIGFub3RoZXIsIHJldHVybiBhIG5ldyBpbnN0YW5jZVxyXG4gICAgbWVyZ2U6IGZ1bmN0aW9uKGJveCkge1xyXG4gICAgICB2YXIgYiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKClcclxuXHJcbiAgICAgIC8vIG1lcmdlIGJveGVzXHJcbiAgICAgIGIueCAgICAgID0gTWF0aC5taW4odGhpcy54LCBib3gueClcclxuICAgICAgYi55ICAgICAgPSBNYXRoLm1pbih0aGlzLnksIGJveC55KVxyXG4gICAgICBiLndpZHRoICA9IE1hdGgubWF4KHRoaXMueCArIHRoaXMud2lkdGgsICBib3gueCArIGJveC53aWR0aCkgIC0gYi54XHJcbiAgICAgIGIuaGVpZ2h0ID0gTWF0aC5tYXgodGhpcy55ICsgdGhpcy5oZWlnaHQsIGJveC55ICsgYm94LmhlaWdodCkgLSBiLnlcclxuXHJcbiAgICAgIHJldHVybiBmdWxsQm94KGIpXHJcbiAgICB9XHJcblxyXG4gICwgdHJhbnNmb3JtOiBmdW5jdGlvbihtKSB7XHJcbiAgICAgIHZhciB4TWluID0gSW5maW5pdHksIHhNYXggPSAtSW5maW5pdHksIHlNaW4gPSBJbmZpbml0eSwgeU1heCA9IC1JbmZpbml0eSwgcCwgYmJveFxyXG5cclxuICAgICAgdmFyIHB0cyA9IFtcclxuICAgICAgICBuZXcgU1ZHLlBvaW50KHRoaXMueCwgdGhpcy55KSxcclxuICAgICAgICBuZXcgU1ZHLlBvaW50KHRoaXMueDIsIHRoaXMueSksXHJcbiAgICAgICAgbmV3IFNWRy5Qb2ludCh0aGlzLngsIHRoaXMueTIpLFxyXG4gICAgICAgIG5ldyBTVkcuUG9pbnQodGhpcy54MiwgdGhpcy55MilcclxuICAgICAgXVxyXG5cclxuICAgICAgcHRzLmZvckVhY2goZnVuY3Rpb24ocCkge1xyXG4gICAgICAgIHAgPSBwLnRyYW5zZm9ybShtKVxyXG4gICAgICAgIHhNaW4gPSBNYXRoLm1pbih4TWluLHAueClcclxuICAgICAgICB4TWF4ID0gTWF0aC5tYXgoeE1heCxwLngpXHJcbiAgICAgICAgeU1pbiA9IE1hdGgubWluKHlNaW4scC55KVxyXG4gICAgICAgIHlNYXggPSBNYXRoLm1heCh5TWF4LHAueSlcclxuICAgICAgfSlcclxuXHJcbiAgICAgIGJib3ggPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcigpXHJcbiAgICAgIGJib3gueCA9IHhNaW5cclxuICAgICAgYmJveC53aWR0aCA9IHhNYXgteE1pblxyXG4gICAgICBiYm94LnkgPSB5TWluXHJcbiAgICAgIGJib3guaGVpZ2h0ID0geU1heC15TWluXHJcblxyXG4gICAgICBmdWxsQm94KGJib3gpXHJcblxyXG4gICAgICByZXR1cm4gYmJveFxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcblNWRy5CQm94ID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZVxyXG4gIGNyZWF0ZTogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgU1ZHLkJveC5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcblxyXG4gICAgLy8gZ2V0IHZhbHVlcyBpZiBlbGVtZW50IGlzIGdpdmVuXHJcbiAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFNWRy5FbGVtZW50KSB7XHJcbiAgICAgIHZhciBib3hcclxuXHJcbiAgICAgIC8vIHllcyB0aGlzIGlzIHVnbHksIGJ1dCBGaXJlZm94IGNhbiBiZSBhIGJpdGNoIHdoZW4gaXQgY29tZXMgdG8gZWxlbWVudHMgdGhhdCBhcmUgbm90IHlldCByZW5kZXJlZFxyXG4gICAgICB0cnkge1xyXG5cclxuICAgICAgICBpZiAoIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyl7XHJcbiAgICAgICAgICAvLyBUaGlzIGlzIElFIC0gaXQgZG9lcyBub3Qgc3VwcG9ydCBjb250YWlucygpIGZvciB0b3AtbGV2ZWwgU1ZHc1xyXG4gICAgICAgICAgdmFyIHRvcFBhcmVudCA9IGVsZW1lbnQubm9kZVxyXG4gICAgICAgICAgd2hpbGUgKHRvcFBhcmVudC5wYXJlbnROb2RlKXtcclxuICAgICAgICAgICAgdG9wUGFyZW50ID0gdG9wUGFyZW50LnBhcmVudE5vZGVcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh0b3BQYXJlbnQgIT0gZG9jdW1lbnQpIHRocm93IG5ldyBFeGNlcHRpb24oJ0VsZW1lbnQgbm90IGluIHRoZSBkb20nKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyB0aGUgZWxlbWVudCBpcyBOT1QgaW4gdGhlIGRvbSwgdGhyb3cgZXJyb3JcclxuICAgICAgICAgIGlmKCFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY29udGFpbnMoZWxlbWVudC5ub2RlKSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignRWxlbWVudCBub3QgaW4gdGhlIGRvbScpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmaW5kIG5hdGl2ZSBiYm94XHJcbiAgICAgICAgYm94ID0gZWxlbWVudC5ub2RlLmdldEJCb3goKVxyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICBpZihlbGVtZW50IGluc3RhbmNlb2YgU1ZHLlNoYXBlKXtcclxuICAgICAgICAgIHZhciBjbG9uZSA9IGVsZW1lbnQuY2xvbmUoU1ZHLnBhcnNlci5kcmF3Lmluc3RhbmNlKS5zaG93KClcclxuICAgICAgICAgIGJveCA9IGNsb25lLm5vZGUuZ2V0QkJveCgpXHJcbiAgICAgICAgICBjbG9uZS5yZW1vdmUoKVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgYm94ID0ge1xyXG4gICAgICAgICAgICB4OiAgICAgIGVsZW1lbnQubm9kZS5jbGllbnRMZWZ0XHJcbiAgICAgICAgICAsIHk6ICAgICAgZWxlbWVudC5ub2RlLmNsaWVudFRvcFxyXG4gICAgICAgICAgLCB3aWR0aDogIGVsZW1lbnQubm9kZS5jbGllbnRXaWR0aFxyXG4gICAgICAgICAgLCBoZWlnaHQ6IGVsZW1lbnQubm9kZS5jbGllbnRIZWlnaHRcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFNWRy5Cb3guY2FsbCh0aGlzLCBib3gpXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gRGVmaW5lIGFuY2VzdG9yXHJcbiwgaW5oZXJpdDogU1ZHLkJveFxyXG5cclxuICAvLyBEZWZpbmUgUGFyZW50XHJcbiwgcGFyZW50OiBTVkcuRWxlbWVudFxyXG5cclxuICAvLyBDb25zdHJ1Y3RvclxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gR2V0IGJvdW5kaW5nIGJveFxyXG4gICAgYmJveDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBuZXcgU1ZHLkJCb3godGhpcylcclxuICAgIH1cclxuICB9XHJcblxyXG59KVxyXG5cclxuU1ZHLkJCb3gucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU1ZHLkJCb3hcclxuXHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgdGJveDogZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUud2FybignVXNlIG9mIFRCb3ggaXMgZGVwcmVjYXRlZCBhbmQgbWFwcGVkIHRvIFJCb3guIFVzZSAucmJveCgpIGluc3RlYWQuJylcclxuICAgIHJldHVybiB0aGlzLnJib3godGhpcy5kb2MoKSlcclxuICB9XHJcbn0pXHJcblxyXG5TVkcuUkJveCA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemVcclxuICBjcmVhdGU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgIFNWRy5Cb3guYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKVxyXG5cclxuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgU1ZHLkVsZW1lbnQpIHtcclxuICAgICAgU1ZHLkJveC5jYWxsKHRoaXMsIGVsZW1lbnQubm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSlcclxuICAgIH1cclxuICB9XHJcblxyXG4sIGluaGVyaXQ6IFNWRy5Cb3hcclxuXHJcbiAgLy8gZGVmaW5lIFBhcmVudFxyXG4sIHBhcmVudDogU1ZHLkVsZW1lbnRcclxuXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICBhZGRPZmZzZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBvZmZzZXQgYnkgd2luZG93IHNjcm9sbCBwb3NpdGlvbiwgYmVjYXVzZSBnZXRCb3VuZGluZ0NsaWVudFJlY3QgY2hhbmdlcyB3aGVuIHdpbmRvdyBpcyBzY3JvbGxlZFxyXG4gICAgICB0aGlzLnggKz0gd2luZG93LnBhZ2VYT2Zmc2V0XHJcbiAgICAgIHRoaXMueSArPSB3aW5kb3cucGFnZVlPZmZzZXRcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIENvbnN0cnVjdG9yXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBHZXQgcmVjdCBib3hcclxuICAgIHJib3g6IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgIGlmIChlbCkgcmV0dXJuIG5ldyBTVkcuUkJveCh0aGlzKS50cmFuc2Zvcm0oZWwuc2NyZWVuQ1RNKCkuaW52ZXJzZSgpKVxyXG4gICAgICByZXR1cm4gbmV3IFNWRy5SQm94KHRoaXMpLmFkZE9mZnNldCgpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSlcclxuXHJcblNWRy5SQm94LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNWRy5SQm94XHJcblxuU1ZHLk1hdHJpeCA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemVcclxuICBjcmVhdGU6IGZ1bmN0aW9uKHNvdXJjZSkge1xyXG4gICAgdmFyIGksIGJhc2UgPSBhcnJheVRvTWF0cml4KFsxLCAwLCAwLCAxLCAwLCAwXSlcclxuXHJcbiAgICAvLyBlbnN1cmUgc291cmNlIGFzIG9iamVjdFxyXG4gICAgc291cmNlID0gc291cmNlIGluc3RhbmNlb2YgU1ZHLkVsZW1lbnQgP1xyXG4gICAgICBzb3VyY2UubWF0cml4aWZ5KCkgOlxyXG4gICAgdHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycgP1xyXG4gICAgICBhcnJheVRvTWF0cml4KHNvdXJjZS5zcGxpdChTVkcucmVnZXguZGVsaW1pdGVyKS5tYXAocGFyc2VGbG9hdCkpIDpcclxuICAgIGFyZ3VtZW50cy5sZW5ndGggPT0gNiA/XHJcbiAgICAgIGFycmF5VG9NYXRyaXgoW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6XHJcbiAgICBBcnJheS5pc0FycmF5KHNvdXJjZSkgP1xyXG4gICAgICBhcnJheVRvTWF0cml4KHNvdXJjZSkgOlxyXG4gICAgdHlwZW9mIHNvdXJjZSA9PT0gJ29iamVjdCcgP1xyXG4gICAgICBzb3VyY2UgOiBiYXNlXHJcblxyXG4gICAgLy8gbWVyZ2Ugc291cmNlXHJcbiAgICBmb3IgKGkgPSBhYmNkZWYubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpXHJcbiAgICAgIHRoaXNbYWJjZGVmW2ldXSA9IHNvdXJjZVthYmNkZWZbaV1dICE9IG51bGwgP1xyXG4gICAgICAgIHNvdXJjZVthYmNkZWZbaV1dIDogYmFzZVthYmNkZWZbaV1dXHJcbiAgfVxyXG5cclxuICAvLyBBZGQgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gRXh0cmFjdCBpbmRpdmlkdWFsIHRyYW5zZm9ybWF0aW9uc1xyXG4gICAgZXh0cmFjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vIGZpbmQgZGVsdGEgdHJhbnNmb3JtIHBvaW50c1xyXG4gICAgICB2YXIgcHggICAgPSBkZWx0YVRyYW5zZm9ybVBvaW50KHRoaXMsIDAsIDEpXHJcbiAgICAgICAgLCBweSAgICA9IGRlbHRhVHJhbnNmb3JtUG9pbnQodGhpcywgMSwgMClcclxuICAgICAgICAsIHNrZXdYID0gMTgwIC8gTWF0aC5QSSAqIE1hdGguYXRhbjIocHgueSwgcHgueCkgLSA5MFxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvLyB0cmFuc2xhdGlvblxyXG4gICAgICAgIHg6ICAgICAgICB0aGlzLmVcclxuICAgICAgLCB5OiAgICAgICAgdGhpcy5mXHJcbiAgICAgICwgdHJhbnNmb3JtZWRYOih0aGlzLmUgKiBNYXRoLmNvcyhza2V3WCAqIE1hdGguUEkgLyAxODApICsgdGhpcy5mICogTWF0aC5zaW4oc2tld1ggKiBNYXRoLlBJIC8gMTgwKSkgLyBNYXRoLnNxcnQodGhpcy5hICogdGhpcy5hICsgdGhpcy5iICogdGhpcy5iKVxyXG4gICAgICAsIHRyYW5zZm9ybWVkWToodGhpcy5mICogTWF0aC5jb3Moc2tld1ggKiBNYXRoLlBJIC8gMTgwKSArIHRoaXMuZSAqIE1hdGguc2luKC1za2V3WCAqIE1hdGguUEkgLyAxODApKSAvIE1hdGguc3FydCh0aGlzLmMgKiB0aGlzLmMgKyB0aGlzLmQgKiB0aGlzLmQpXHJcbiAgICAgICAgLy8gc2tld1xyXG4gICAgICAsIHNrZXdYOiAgICAtc2tld1hcclxuICAgICAgLCBza2V3WTogICAgMTgwIC8gTWF0aC5QSSAqIE1hdGguYXRhbjIocHkueSwgcHkueClcclxuICAgICAgICAvLyBzY2FsZVxyXG4gICAgICAsIHNjYWxlWDogICBNYXRoLnNxcnQodGhpcy5hICogdGhpcy5hICsgdGhpcy5iICogdGhpcy5iKVxyXG4gICAgICAsIHNjYWxlWTogICBNYXRoLnNxcnQodGhpcy5jICogdGhpcy5jICsgdGhpcy5kICogdGhpcy5kKVxyXG4gICAgICAgIC8vIHJvdGF0aW9uXHJcbiAgICAgICwgcm90YXRpb246IHNrZXdYXHJcbiAgICAgICwgYTogdGhpcy5hXHJcbiAgICAgICwgYjogdGhpcy5iXHJcbiAgICAgICwgYzogdGhpcy5jXHJcbiAgICAgICwgZDogdGhpcy5kXHJcbiAgICAgICwgZTogdGhpcy5lXHJcbiAgICAgICwgZjogdGhpcy5mXHJcbiAgICAgICwgbWF0cml4OiBuZXcgU1ZHLk1hdHJpeCh0aGlzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBDbG9uZSBtYXRyaXhcclxuICAsIGNsb25lOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIG5ldyBTVkcuTWF0cml4KHRoaXMpXHJcbiAgICB9XHJcbiAgICAvLyBNb3JwaCBvbmUgbWF0cml4IGludG8gYW5vdGhlclxyXG4gICwgbW9ycGg6IGZ1bmN0aW9uKG1hdHJpeCkge1xyXG4gICAgICAvLyBzdG9yZSBuZXcgZGVzdGluYXRpb25cclxuICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBTVkcuTWF0cml4KG1hdHJpeClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBHZXQgbW9ycGhlZCBtYXRyaXggYXQgYSBnaXZlbiBwb3NpdGlvblxyXG4gICwgYXQ6IGZ1bmN0aW9uKHBvcykge1xyXG4gICAgICAvLyBtYWtlIHN1cmUgYSBkZXN0aW5hdGlvbiBpcyBkZWZpbmVkXHJcbiAgICAgIGlmICghdGhpcy5kZXN0aW5hdGlvbikgcmV0dXJuIHRoaXNcclxuXHJcbiAgICAgIC8vIGNhbGN1bGF0ZSBtb3JwaGVkIG1hdHJpeCBhdCBhIGdpdmVuIHBvc2l0aW9uXHJcbiAgICAgIHZhciBtYXRyaXggPSBuZXcgU1ZHLk1hdHJpeCh7XHJcbiAgICAgICAgYTogdGhpcy5hICsgKHRoaXMuZGVzdGluYXRpb24uYSAtIHRoaXMuYSkgKiBwb3NcclxuICAgICAgLCBiOiB0aGlzLmIgKyAodGhpcy5kZXN0aW5hdGlvbi5iIC0gdGhpcy5iKSAqIHBvc1xyXG4gICAgICAsIGM6IHRoaXMuYyArICh0aGlzLmRlc3RpbmF0aW9uLmMgLSB0aGlzLmMpICogcG9zXHJcbiAgICAgICwgZDogdGhpcy5kICsgKHRoaXMuZGVzdGluYXRpb24uZCAtIHRoaXMuZCkgKiBwb3NcclxuICAgICAgLCBlOiB0aGlzLmUgKyAodGhpcy5kZXN0aW5hdGlvbi5lIC0gdGhpcy5lKSAqIHBvc1xyXG4gICAgICAsIGY6IHRoaXMuZiArICh0aGlzLmRlc3RpbmF0aW9uLmYgLSB0aGlzLmYpICogcG9zXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gbWF0cml4XHJcbiAgICB9XHJcbiAgICAvLyBNdWx0aXBsaWVzIGJ5IGdpdmVuIG1hdHJpeFxyXG4gICwgbXVsdGlwbHk6IGZ1bmN0aW9uKG1hdHJpeCkge1xyXG4gICAgICByZXR1cm4gbmV3IFNWRy5NYXRyaXgodGhpcy5uYXRpdmUoKS5tdWx0aXBseShwYXJzZU1hdHJpeChtYXRyaXgpLm5hdGl2ZSgpKSlcclxuICAgIH1cclxuICAgIC8vIEludmVyc2VzIG1hdHJpeFxyXG4gICwgaW52ZXJzZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBuZXcgU1ZHLk1hdHJpeCh0aGlzLm5hdGl2ZSgpLmludmVyc2UoKSlcclxuICAgIH1cclxuICAgIC8vIFRyYW5zbGF0ZSBtYXRyaXhcclxuICAsIHRyYW5zbGF0ZTogZnVuY3Rpb24oeCwgeSkge1xyXG4gICAgICByZXR1cm4gbmV3IFNWRy5NYXRyaXgodGhpcy5uYXRpdmUoKS50cmFuc2xhdGUoeCB8fCAwLCB5IHx8IDApKVxyXG4gICAgfVxyXG4gICAgLy8gU2NhbGUgbWF0cml4XHJcbiAgLCBzY2FsZTogZnVuY3Rpb24oeCwgeSwgY3gsIGN5KSB7XHJcbiAgICAgIC8vIHN1cHBvcnQgdW5pZm9ybWFsIHNjYWxlXHJcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcclxuICAgICAgICB5ID0geFxyXG4gICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMykge1xyXG4gICAgICAgIGN5ID0gY3hcclxuICAgICAgICBjeCA9IHlcclxuICAgICAgICB5ID0geFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5hcm91bmQoY3gsIGN5LCBuZXcgU1ZHLk1hdHJpeCh4LCAwLCAwLCB5LCAwLCAwKSlcclxuICAgIH1cclxuICAgIC8vIFJvdGF0ZSBtYXRyaXhcclxuICAsIHJvdGF0ZTogZnVuY3Rpb24ociwgY3gsIGN5KSB7XHJcbiAgICAgIC8vIGNvbnZlcnQgZGVncmVlcyB0byByYWRpYW5zXHJcbiAgICAgIHIgPSBTVkcudXRpbHMucmFkaWFucyhyKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuYXJvdW5kKGN4LCBjeSwgbmV3IFNWRy5NYXRyaXgoTWF0aC5jb3MociksIE1hdGguc2luKHIpLCAtTWF0aC5zaW4ociksIE1hdGguY29zKHIpLCAwLCAwKSlcclxuICAgIH1cclxuICAgIC8vIEZsaXAgbWF0cml4IG9uIHggb3IgeSwgYXQgYSBnaXZlbiBvZmZzZXRcclxuICAsIGZsaXA6IGZ1bmN0aW9uKGEsIG8pIHtcclxuICAgICAgcmV0dXJuIGEgPT0gJ3gnID9cclxuICAgICAgICAgIHRoaXMuc2NhbGUoLTEsIDEsIG8sIDApIDpcclxuICAgICAgICBhID09ICd5JyA/XHJcbiAgICAgICAgICB0aGlzLnNjYWxlKDEsIC0xLCAwLCBvKSA6XHJcbiAgICAgICAgICB0aGlzLnNjYWxlKC0xLCAtMSwgYSwgbyAhPSBudWxsID8gbyA6IGEpXHJcbiAgICB9XHJcbiAgICAvLyBTa2V3XHJcbiAgLCBza2V3OiBmdW5jdGlvbih4LCB5LCBjeCwgY3kpIHtcclxuICAgICAgLy8gc3VwcG9ydCB1bmlmb3JtYWwgc2tld1xyXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgeSA9IHhcclxuICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDMpIHtcclxuICAgICAgICBjeSA9IGN4XHJcbiAgICAgICAgY3ggPSB5XHJcbiAgICAgICAgeSA9IHhcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gY29udmVydCBkZWdyZWVzIHRvIHJhZGlhbnNcclxuICAgICAgeCA9IFNWRy51dGlscy5yYWRpYW5zKHgpXHJcbiAgICAgIHkgPSBTVkcudXRpbHMucmFkaWFucyh5KVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuYXJvdW5kKGN4LCBjeSwgbmV3IFNWRy5NYXRyaXgoMSwgTWF0aC50YW4oeSksIE1hdGgudGFuKHgpLCAxLCAwLCAwKSlcclxuICAgIH1cclxuICAgIC8vIFNrZXdYXHJcbiAgLCBza2V3WDogZnVuY3Rpb24oeCwgY3gsIGN5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNrZXcoeCwgMCwgY3gsIGN5KVxyXG4gICAgfVxyXG4gICAgLy8gU2tld1lcclxuICAsIHNrZXdZOiBmdW5jdGlvbih5LCBjeCwgY3kpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc2tldygwLCB5LCBjeCwgY3kpXHJcbiAgICB9XHJcbiAgICAvLyBUcmFuc2Zvcm0gYXJvdW5kIGEgY2VudGVyIHBvaW50XHJcbiAgLCBhcm91bmQ6IGZ1bmN0aW9uKGN4LCBjeSwgbWF0cml4KSB7XHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgLm11bHRpcGx5KG5ldyBTVkcuTWF0cml4KDEsIDAsIDAsIDEsIGN4IHx8IDAsIGN5IHx8IDApKVxyXG4gICAgICAgIC5tdWx0aXBseShtYXRyaXgpXHJcbiAgICAgICAgLm11bHRpcGx5KG5ldyBTVkcuTWF0cml4KDEsIDAsIDAsIDEsIC1jeCB8fCAwLCAtY3kgfHwgMCkpXHJcbiAgICB9XHJcbiAgICAvLyBDb252ZXJ0IHRvIG5hdGl2ZSBTVkdNYXRyaXhcclxuICAsIG5hdGl2ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vIGNyZWF0ZSBuZXcgbWF0cml4XHJcbiAgICAgIHZhciBtYXRyaXggPSBTVkcucGFyc2VyLm5hdGl2ZS5jcmVhdGVTVkdNYXRyaXgoKVxyXG5cclxuICAgICAgLy8gdXBkYXRlIHdpdGggY3VycmVudCB2YWx1ZXNcclxuICAgICAgZm9yICh2YXIgaSA9IGFiY2RlZi5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcclxuICAgICAgICBtYXRyaXhbYWJjZGVmW2ldXSA9IHRoaXNbYWJjZGVmW2ldXVxyXG5cclxuICAgICAgcmV0dXJuIG1hdHJpeFxyXG4gICAgfVxyXG4gICAgLy8gQ29udmVydCBtYXRyaXggdG8gc3RyaW5nXHJcbiAgLCB0b1N0cmluZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiAnbWF0cml4KCcgKyB0aGlzLmEgKyAnLCcgKyB0aGlzLmIgKyAnLCcgKyB0aGlzLmMgKyAnLCcgKyB0aGlzLmQgKyAnLCcgKyB0aGlzLmUgKyAnLCcgKyB0aGlzLmYgKyAnKSdcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIERlZmluZSBwYXJlbnRcclxuLCBwYXJlbnQ6IFNWRy5FbGVtZW50XHJcblxyXG4gIC8vIEFkZCBwYXJlbnQgbWV0aG9kXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBHZXQgY3VycmVudCBtYXRyaXhcclxuICAgIGN0bTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBuZXcgU1ZHLk1hdHJpeCh0aGlzLm5vZGUuZ2V0Q1RNKCkpXHJcbiAgICB9LFxyXG4gICAgLy8gR2V0IGN1cnJlbnQgc2NyZWVuIG1hdHJpeFxyXG4gICAgc2NyZWVuQ1RNOiBmdW5jdGlvbigpIHtcclxuICAgICAgLyogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTM0NDUzN1xyXG4gICAgICAgICBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIEZGIGRvZXMgbm90IHJldHVybiB0aGUgdHJhbnNmb3JtYXRpb24gbWF0cml4XHJcbiAgICAgICAgIGZvciB0aGUgaW5uZXIgY29vcmRpbmF0ZSBzeXN0ZW0gd2hlbiBnZXRTY3JlZW5DVE0oKSBpcyBjYWxsZWQgb24gbmVzdGVkIHN2Z3MuXHJcbiAgICAgICAgIEhvd2V2ZXIgYWxsIG90aGVyIEJyb3dzZXJzIGRvIHRoYXQgKi9cclxuICAgICAgaWYodGhpcyBpbnN0YW5jZW9mIFNWRy5OZXN0ZWQpIHtcclxuICAgICAgICB2YXIgcmVjdCA9IHRoaXMucmVjdCgxLDEpXHJcbiAgICAgICAgdmFyIG0gPSByZWN0Lm5vZGUuZ2V0U2NyZWVuQ1RNKClcclxuICAgICAgICByZWN0LnJlbW92ZSgpXHJcbiAgICAgICAgcmV0dXJuIG5ldyBTVkcuTWF0cml4KG0pXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5ldyBTVkcuTWF0cml4KHRoaXMubm9kZS5nZXRTY3JlZW5DVE0oKSlcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufSlcclxuXG5TVkcuUG9pbnQgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplXHJcbiAgY3JlYXRlOiBmdW5jdGlvbih4LHkpIHtcclxuICAgIHZhciBpLCBzb3VyY2UsIGJhc2UgPSB7eDowLCB5OjB9XHJcblxyXG4gICAgLy8gZW5zdXJlIHNvdXJjZSBhcyBvYmplY3RcclxuICAgIHNvdXJjZSA9IEFycmF5LmlzQXJyYXkoeCkgP1xyXG4gICAgICB7eDp4WzBdLCB5OnhbMV19IDpcclxuICAgIHR5cGVvZiB4ID09PSAnb2JqZWN0JyA/XHJcbiAgICAgIHt4OngueCwgeTp4Lnl9IDpcclxuICAgIHggIT0gbnVsbCA/XHJcbiAgICAgIHt4OngsIHk6KHkgIT0gbnVsbCA/IHkgOiB4KX0gOiBiYXNlIC8vIElmIHkgaGFzIG5vIHZhbHVlLCB0aGVuIHggaXMgdXNlZCBoYXMgaXRzIHZhbHVlXHJcblxyXG4gICAgLy8gbWVyZ2Ugc291cmNlXHJcbiAgICB0aGlzLnggPSBzb3VyY2UueFxyXG4gICAgdGhpcy55ID0gc291cmNlLnlcclxuICB9XHJcblxyXG4gIC8vIEFkZCBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBDbG9uZSBwb2ludFxyXG4gICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gbmV3IFNWRy5Qb2ludCh0aGlzKVxyXG4gICAgfVxyXG4gICAgLy8gTW9ycGggb25lIHBvaW50IGludG8gYW5vdGhlclxyXG4gICwgbW9ycGg6IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgICAgLy8gc3RvcmUgbmV3IGRlc3RpbmF0aW9uXHJcbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBuZXcgU1ZHLlBvaW50KHgsIHkpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gR2V0IG1vcnBoZWQgcG9pbnQgYXQgYSBnaXZlbiBwb3NpdGlvblxyXG4gICwgYXQ6IGZ1bmN0aW9uKHBvcykge1xyXG4gICAgICAvLyBtYWtlIHN1cmUgYSBkZXN0aW5hdGlvbiBpcyBkZWZpbmVkXHJcbiAgICAgIGlmICghdGhpcy5kZXN0aW5hdGlvbikgcmV0dXJuIHRoaXNcclxuXHJcbiAgICAgIC8vIGNhbGN1bGF0ZSBtb3JwaGVkIG1hdHJpeCBhdCBhIGdpdmVuIHBvc2l0aW9uXHJcbiAgICAgIHZhciBwb2ludCA9IG5ldyBTVkcuUG9pbnQoe1xyXG4gICAgICAgIHg6IHRoaXMueCArICh0aGlzLmRlc3RpbmF0aW9uLnggLSB0aGlzLngpICogcG9zXHJcbiAgICAgICwgeTogdGhpcy55ICsgKHRoaXMuZGVzdGluYXRpb24ueSAtIHRoaXMueSkgKiBwb3NcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHJldHVybiBwb2ludFxyXG4gICAgfVxyXG4gICAgLy8gQ29udmVydCB0byBuYXRpdmUgU1ZHUG9pbnRcclxuICAsIG5hdGl2ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vIGNyZWF0ZSBuZXcgcG9pbnRcclxuICAgICAgdmFyIHBvaW50ID0gU1ZHLnBhcnNlci5uYXRpdmUuY3JlYXRlU1ZHUG9pbnQoKVxyXG5cclxuICAgICAgLy8gdXBkYXRlIHdpdGggY3VycmVudCB2YWx1ZXNcclxuICAgICAgcG9pbnQueCA9IHRoaXMueFxyXG4gICAgICBwb2ludC55ID0gdGhpcy55XHJcblxyXG4gICAgICByZXR1cm4gcG9pbnRcclxuICAgIH1cclxuICAgIC8vIHRyYW5zZm9ybSBwb2ludCB3aXRoIG1hdHJpeFxyXG4gICwgdHJhbnNmb3JtOiBmdW5jdGlvbihtYXRyaXgpIHtcclxuICAgICAgcmV0dXJuIG5ldyBTVkcuUG9pbnQodGhpcy5uYXRpdmUoKS5tYXRyaXhUcmFuc2Zvcm0obWF0cml4Lm5hdGl2ZSgpKSlcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufSlcclxuXHJcblNWRy5leHRlbmQoU1ZHLkVsZW1lbnQsIHtcclxuXHJcbiAgLy8gR2V0IHBvaW50XHJcbiAgcG9pbnQ6IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgIHJldHVybiBuZXcgU1ZHLlBvaW50KHgseSkudHJhbnNmb3JtKHRoaXMuc2NyZWVuQ1RNKCkuaW52ZXJzZSgpKTtcclxuICB9XHJcblxyXG59KVxyXG5cblNWRy5leHRlbmQoU1ZHLkVsZW1lbnQsIHtcclxuICAvLyBTZXQgc3ZnIGVsZW1lbnQgYXR0cmlidXRlXHJcbiAgYXR0cjogZnVuY3Rpb24oYSwgdiwgbikge1xyXG4gICAgLy8gYWN0IGFzIGZ1bGwgZ2V0dGVyXHJcbiAgICBpZiAoYSA9PSBudWxsKSB7XHJcbiAgICAgIC8vIGdldCBhbiBvYmplY3Qgb2YgYXR0cmlidXRlc1xyXG4gICAgICBhID0ge31cclxuICAgICAgdiA9IHRoaXMubm9kZS5hdHRyaWJ1dGVzXHJcbiAgICAgIGZvciAobiA9IHYubGVuZ3RoIC0gMTsgbiA+PSAwOyBuLS0pXHJcbiAgICAgICAgYVt2W25dLm5vZGVOYW1lXSA9IFNWRy5yZWdleC5pc051bWJlci50ZXN0KHZbbl0ubm9kZVZhbHVlKSA/IHBhcnNlRmxvYXQodltuXS5ub2RlVmFsdWUpIDogdltuXS5ub2RlVmFsdWVcclxuXHJcbiAgICAgIHJldHVybiBhXHJcblxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAvLyBhcHBseSBldmVyeSBhdHRyaWJ1dGUgaW5kaXZpZHVhbGx5IGlmIGFuIG9iamVjdCBpcyBwYXNzZWRcclxuICAgICAgZm9yICh2IGluIGEpIHRoaXMuYXR0cih2LCBhW3ZdKVxyXG5cclxuICAgIH0gZWxzZSBpZiAodiA9PT0gbnVsbCkge1xyXG4gICAgICAgIC8vIHJlbW92ZSB2YWx1ZVxyXG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVBdHRyaWJ1dGUoYSlcclxuXHJcbiAgICB9IGVsc2UgaWYgKHYgPT0gbnVsbCkge1xyXG4gICAgICAvLyBhY3QgYXMgYSBnZXR0ZXIgaWYgdGhlIGZpcnN0IGFuZCBvbmx5IGFyZ3VtZW50IGlzIG5vdCBhbiBvYmplY3RcclxuICAgICAgdiA9IHRoaXMubm9kZS5nZXRBdHRyaWJ1dGUoYSlcclxuICAgICAgcmV0dXJuIHYgPT0gbnVsbCA/XHJcbiAgICAgICAgU1ZHLmRlZmF1bHRzLmF0dHJzW2FdIDpcclxuICAgICAgU1ZHLnJlZ2V4LmlzTnVtYmVyLnRlc3QodikgP1xyXG4gICAgICAgIHBhcnNlRmxvYXQodikgOiB2XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gQlVHIEZJWDogc29tZSBicm93c2VycyB3aWxsIHJlbmRlciBhIHN0cm9rZSBpZiBhIGNvbG9yIGlzIGdpdmVuIGV2ZW4gdGhvdWdoIHN0cm9rZSB3aWR0aCBpcyAwXHJcbiAgICAgIGlmIChhID09ICdzdHJva2Utd2lkdGgnKVxyXG4gICAgICAgIHRoaXMuYXR0cignc3Ryb2tlJywgcGFyc2VGbG9hdCh2KSA+IDAgPyB0aGlzLl9zdHJva2UgOiBudWxsKVxyXG4gICAgICBlbHNlIGlmIChhID09ICdzdHJva2UnKVxyXG4gICAgICAgIHRoaXMuX3N0cm9rZSA9IHZcclxuXHJcbiAgICAgIC8vIGNvbnZlcnQgaW1hZ2UgZmlsbCBhbmQgc3Ryb2tlIHRvIHBhdHRlcm5zXHJcbiAgICAgIGlmIChhID09ICdmaWxsJyB8fCBhID09ICdzdHJva2UnKSB7XHJcbiAgICAgICAgaWYgKFNWRy5yZWdleC5pc0ltYWdlLnRlc3QodikpXHJcbiAgICAgICAgICB2ID0gdGhpcy5kb2MoKS5kZWZzKCkuaW1hZ2UodiwgMCwgMClcclxuXHJcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBTVkcuSW1hZ2UpXHJcbiAgICAgICAgICB2ID0gdGhpcy5kb2MoKS5kZWZzKCkucGF0dGVybigwLCAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGQodilcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGVuc3VyZSBjb3JyZWN0IG51bWVyaWMgdmFsdWVzIChhbHNvIGFjY2VwdHMgTmFOIGFuZCBJbmZpbml0eSlcclxuICAgICAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJylcclxuICAgICAgICB2ID0gbmV3IFNWRy5OdW1iZXIodilcclxuXHJcbiAgICAgIC8vIGVuc3VyZSBmdWxsIGhleCBjb2xvclxyXG4gICAgICBlbHNlIGlmIChTVkcuQ29sb3IuaXNDb2xvcih2KSlcclxuICAgICAgICB2ID0gbmV3IFNWRy5Db2xvcih2KVxyXG5cclxuICAgICAgLy8gcGFyc2UgYXJyYXkgdmFsdWVzXHJcbiAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodikpXHJcbiAgICAgICAgdiA9IG5ldyBTVkcuQXJyYXkodilcclxuXHJcbiAgICAgIC8vIGlmIHRoZSBwYXNzZWQgYXR0cmlidXRlIGlzIGxlYWRpbmcuLi5cclxuICAgICAgaWYgKGEgPT0gJ2xlYWRpbmcnKSB7XHJcbiAgICAgICAgLy8gLi4uIGNhbGwgdGhlIGxlYWRpbmcgbWV0aG9kIGluc3RlYWRcclxuICAgICAgICBpZiAodGhpcy5sZWFkaW5nKVxyXG4gICAgICAgICAgdGhpcy5sZWFkaW5nKHYpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gc2V0IGdpdmVuIGF0dHJpYnV0ZSBvbiBub2RlXHJcbiAgICAgICAgdHlwZW9mIG4gPT09ICdzdHJpbmcnID9cclxuICAgICAgICAgIHRoaXMubm9kZS5zZXRBdHRyaWJ1dGVOUyhuLCBhLCB2LnRvU3RyaW5nKCkpIDpcclxuICAgICAgICAgIHRoaXMubm9kZS5zZXRBdHRyaWJ1dGUoYSwgdi50b1N0cmluZygpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyByZWJ1aWxkIGlmIHJlcXVpcmVkXHJcbiAgICAgIGlmICh0aGlzLnJlYnVpbGQgJiYgKGEgPT0gJ2ZvbnQtc2l6ZScgfHwgYSA9PSAneCcpKVxyXG4gICAgICAgIHRoaXMucmVidWlsZChhLCB2KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG59KVxuU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xyXG4gIC8vIEFkZCB0cmFuc2Zvcm1hdGlvbnNcclxuICB0cmFuc2Zvcm06IGZ1bmN0aW9uKG8sIHJlbGF0aXZlKSB7XHJcbiAgICAvLyBnZXQgdGFyZ2V0IGluIGNhc2Ugb2YgdGhlIGZ4IG1vZHVsZSwgb3RoZXJ3aXNlIHJlZmVyZW5jZSB0aGlzXHJcbiAgICB2YXIgdGFyZ2V0ID0gdGhpc1xyXG4gICAgICAsIG1hdHJpeCwgYmJveFxyXG5cclxuICAgIC8vIGFjdCBhcyBhIGdldHRlclxyXG4gICAgaWYgKHR5cGVvZiBvICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAvLyBnZXQgY3VycmVudCBtYXRyaXhcclxuICAgICAgbWF0cml4ID0gbmV3IFNWRy5NYXRyaXgodGFyZ2V0KS5leHRyYWN0KClcclxuXHJcbiAgICAgIHJldHVybiB0eXBlb2YgbyA9PT0gJ3N0cmluZycgPyBtYXRyaXhbb10gOiBtYXRyaXhcclxuICAgIH1cclxuXHJcbiAgICAvLyBnZXQgY3VycmVudCBtYXRyaXhcclxuICAgIG1hdHJpeCA9IG5ldyBTVkcuTWF0cml4KHRhcmdldClcclxuXHJcbiAgICAvLyBlbnN1cmUgcmVsYXRpdmUgZmxhZ1xyXG4gICAgcmVsYXRpdmUgPSAhIXJlbGF0aXZlIHx8ICEhby5yZWxhdGl2ZVxyXG5cclxuICAgIC8vIGFjdCBvbiBtYXRyaXhcclxuICAgIGlmIChvLmEgIT0gbnVsbCkge1xyXG4gICAgICBtYXRyaXggPSByZWxhdGl2ZSA/XHJcbiAgICAgICAgLy8gcmVsYXRpdmVcclxuICAgICAgICBtYXRyaXgubXVsdGlwbHkobmV3IFNWRy5NYXRyaXgobykpIDpcclxuICAgICAgICAvLyBhYnNvbHV0ZVxyXG4gICAgICAgIG5ldyBTVkcuTWF0cml4KG8pXHJcblxyXG4gICAgLy8gYWN0IG9uIHJvdGF0aW9uXHJcbiAgICB9IGVsc2UgaWYgKG8ucm90YXRpb24gIT0gbnVsbCkge1xyXG4gICAgICAvLyBlbnN1cmUgY2VudHJlIHBvaW50XHJcbiAgICAgIGVuc3VyZUNlbnRyZShvLCB0YXJnZXQpXHJcblxyXG4gICAgICAvLyBhcHBseSB0cmFuc2Zvcm1hdGlvblxyXG4gICAgICBtYXRyaXggPSByZWxhdGl2ZSA/XHJcbiAgICAgICAgLy8gcmVsYXRpdmVcclxuICAgICAgICBtYXRyaXgucm90YXRlKG8ucm90YXRpb24sIG8uY3gsIG8uY3kpIDpcclxuICAgICAgICAvLyBhYnNvbHV0ZVxyXG4gICAgICAgIG1hdHJpeC5yb3RhdGUoby5yb3RhdGlvbiAtIG1hdHJpeC5leHRyYWN0KCkucm90YXRpb24sIG8uY3gsIG8uY3kpXHJcblxyXG4gICAgLy8gYWN0IG9uIHNjYWxlXHJcbiAgICB9IGVsc2UgaWYgKG8uc2NhbGUgIT0gbnVsbCB8fCBvLnNjYWxlWCAhPSBudWxsIHx8IG8uc2NhbGVZICE9IG51bGwpIHtcclxuICAgICAgLy8gZW5zdXJlIGNlbnRyZSBwb2ludFxyXG4gICAgICBlbnN1cmVDZW50cmUobywgdGFyZ2V0KVxyXG5cclxuICAgICAgLy8gZW5zdXJlIHNjYWxlIHZhbHVlcyBvbiBib3RoIGF4ZXNcclxuICAgICAgby5zY2FsZVggPSBvLnNjYWxlICE9IG51bGwgPyBvLnNjYWxlIDogby5zY2FsZVggIT0gbnVsbCA/IG8uc2NhbGVYIDogMVxyXG4gICAgICBvLnNjYWxlWSA9IG8uc2NhbGUgIT0gbnVsbCA/IG8uc2NhbGUgOiBvLnNjYWxlWSAhPSBudWxsID8gby5zY2FsZVkgOiAxXHJcblxyXG4gICAgICBpZiAoIXJlbGF0aXZlKSB7XHJcbiAgICAgICAgLy8gYWJzb2x1dGU7IG11bHRpcGx5IGludmVyc2VkIHZhbHVlc1xyXG4gICAgICAgIHZhciBlID0gbWF0cml4LmV4dHJhY3QoKVxyXG4gICAgICAgIG8uc2NhbGVYID0gby5zY2FsZVggKiAxIC8gZS5zY2FsZVhcclxuICAgICAgICBvLnNjYWxlWSA9IG8uc2NhbGVZICogMSAvIGUuc2NhbGVZXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1hdHJpeCA9IG1hdHJpeC5zY2FsZShvLnNjYWxlWCwgby5zY2FsZVksIG8uY3gsIG8uY3kpXHJcblxyXG4gICAgLy8gYWN0IG9uIHNrZXdcclxuICAgIH0gZWxzZSBpZiAoby5za2V3ICE9IG51bGwgfHwgby5za2V3WCAhPSBudWxsIHx8IG8uc2tld1kgIT0gbnVsbCkge1xyXG4gICAgICAvLyBlbnN1cmUgY2VudHJlIHBvaW50XHJcbiAgICAgIGVuc3VyZUNlbnRyZShvLCB0YXJnZXQpXHJcblxyXG4gICAgICAvLyBlbnN1cmUgc2tldyB2YWx1ZXMgb24gYm90aCBheGVzXHJcbiAgICAgIG8uc2tld1ggPSBvLnNrZXcgIT0gbnVsbCA/IG8uc2tldyA6IG8uc2tld1ggIT0gbnVsbCA/IG8uc2tld1ggOiAwXHJcbiAgICAgIG8uc2tld1kgPSBvLnNrZXcgIT0gbnVsbCA/IG8uc2tldyA6IG8uc2tld1kgIT0gbnVsbCA/IG8uc2tld1kgOiAwXHJcblxyXG4gICAgICBpZiAoIXJlbGF0aXZlKSB7XHJcbiAgICAgICAgLy8gYWJzb2x1dGU7IHJlc2V0IHNrZXcgdmFsdWVzXHJcbiAgICAgICAgdmFyIGUgPSBtYXRyaXguZXh0cmFjdCgpXHJcbiAgICAgICAgbWF0cml4ID0gbWF0cml4Lm11bHRpcGx5KG5ldyBTVkcuTWF0cml4KCkuc2tldyhlLnNrZXdYLCBlLnNrZXdZLCBvLmN4LCBvLmN5KS5pbnZlcnNlKCkpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1hdHJpeCA9IG1hdHJpeC5za2V3KG8uc2tld1gsIG8uc2tld1ksIG8uY3gsIG8uY3kpXHJcblxyXG4gICAgLy8gYWN0IG9uIGZsaXBcclxuICAgIH0gZWxzZSBpZiAoby5mbGlwKSB7XHJcbiAgICAgIGlmKG8uZmxpcCA9PSAneCcgfHwgby5mbGlwID09ICd5Jykge1xyXG4gICAgICAgIG8ub2Zmc2V0ID0gby5vZmZzZXQgPT0gbnVsbCA/IHRhcmdldC5iYm94KClbJ2MnICsgby5mbGlwXSA6IG8ub2Zmc2V0XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYoby5vZmZzZXQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgYmJveCA9IHRhcmdldC5iYm94KClcclxuICAgICAgICAgIG8uZmxpcCA9IGJib3guY3hcclxuICAgICAgICAgIG8ub2Zmc2V0ID0gYmJveC5jeVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvLmZsaXAgPSBvLm9mZnNldFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgbWF0cml4ID0gbmV3IFNWRy5NYXRyaXgoKS5mbGlwKG8uZmxpcCwgby5vZmZzZXQpXHJcblxyXG4gICAgLy8gYWN0IG9uIHRyYW5zbGF0ZVxyXG4gICAgfSBlbHNlIGlmIChvLnggIT0gbnVsbCB8fCBvLnkgIT0gbnVsbCkge1xyXG4gICAgICBpZiAocmVsYXRpdmUpIHtcclxuICAgICAgICAvLyByZWxhdGl2ZVxyXG4gICAgICAgIG1hdHJpeCA9IG1hdHJpeC50cmFuc2xhdGUoby54LCBvLnkpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gYWJzb2x1dGVcclxuICAgICAgICBpZiAoby54ICE9IG51bGwpIG1hdHJpeC5lID0gby54XHJcbiAgICAgICAgaWYgKG8ueSAhPSBudWxsKSBtYXRyaXguZiA9IG8ueVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYXR0cigndHJhbnNmb3JtJywgbWF0cml4KVxyXG4gIH1cclxufSlcclxuXHJcblNWRy5leHRlbmQoU1ZHLkZYLCB7XHJcbiAgdHJhbnNmb3JtOiBmdW5jdGlvbihvLCByZWxhdGl2ZSkge1xyXG4gICAgLy8gZ2V0IHRhcmdldCBpbiBjYXNlIG9mIHRoZSBmeCBtb2R1bGUsIG90aGVyd2lzZSByZWZlcmVuY2UgdGhpc1xyXG4gICAgdmFyIHRhcmdldCA9IHRoaXMudGFyZ2V0KClcclxuICAgICAgLCBtYXRyaXgsIGJib3hcclxuXHJcbiAgICAvLyBhY3QgYXMgYSBnZXR0ZXJcclxuICAgIGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgLy8gZ2V0IGN1cnJlbnQgbWF0cml4XHJcbiAgICAgIG1hdHJpeCA9IG5ldyBTVkcuTWF0cml4KHRhcmdldCkuZXh0cmFjdCgpXHJcblxyXG4gICAgICByZXR1cm4gdHlwZW9mIG8gPT09ICdzdHJpbmcnID8gbWF0cml4W29dIDogbWF0cml4XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZW5zdXJlIHJlbGF0aXZlIGZsYWdcclxuICAgIHJlbGF0aXZlID0gISFyZWxhdGl2ZSB8fCAhIW8ucmVsYXRpdmVcclxuXHJcbiAgICAvLyBhY3Qgb24gbWF0cml4XHJcbiAgICBpZiAoby5hICE9IG51bGwpIHtcclxuICAgICAgbWF0cml4ID0gbmV3IFNWRy5NYXRyaXgobylcclxuXHJcbiAgICAvLyBhY3Qgb24gcm90YXRpb25cclxuICAgIH0gZWxzZSBpZiAoby5yb3RhdGlvbiAhPSBudWxsKSB7XHJcbiAgICAgIC8vIGVuc3VyZSBjZW50cmUgcG9pbnRcclxuICAgICAgZW5zdXJlQ2VudHJlKG8sIHRhcmdldClcclxuXHJcbiAgICAgIC8vIGFwcGx5IHRyYW5zZm9ybWF0aW9uXHJcbiAgICAgIG1hdHJpeCA9IG5ldyBTVkcuUm90YXRlKG8ucm90YXRpb24sIG8uY3gsIG8uY3kpXHJcblxyXG4gICAgLy8gYWN0IG9uIHNjYWxlXHJcbiAgICB9IGVsc2UgaWYgKG8uc2NhbGUgIT0gbnVsbCB8fCBvLnNjYWxlWCAhPSBudWxsIHx8IG8uc2NhbGVZICE9IG51bGwpIHtcclxuICAgICAgLy8gZW5zdXJlIGNlbnRyZSBwb2ludFxyXG4gICAgICBlbnN1cmVDZW50cmUobywgdGFyZ2V0KVxyXG5cclxuICAgICAgLy8gZW5zdXJlIHNjYWxlIHZhbHVlcyBvbiBib3RoIGF4ZXNcclxuICAgICAgby5zY2FsZVggPSBvLnNjYWxlICE9IG51bGwgPyBvLnNjYWxlIDogby5zY2FsZVggIT0gbnVsbCA/IG8uc2NhbGVYIDogMVxyXG4gICAgICBvLnNjYWxlWSA9IG8uc2NhbGUgIT0gbnVsbCA/IG8uc2NhbGUgOiBvLnNjYWxlWSAhPSBudWxsID8gby5zY2FsZVkgOiAxXHJcblxyXG4gICAgICBtYXRyaXggPSBuZXcgU1ZHLlNjYWxlKG8uc2NhbGVYLCBvLnNjYWxlWSwgby5jeCwgby5jeSlcclxuXHJcbiAgICAvLyBhY3Qgb24gc2tld1xyXG4gICAgfSBlbHNlIGlmIChvLnNrZXdYICE9IG51bGwgfHwgby5za2V3WSAhPSBudWxsKSB7XHJcbiAgICAgIC8vIGVuc3VyZSBjZW50cmUgcG9pbnRcclxuICAgICAgZW5zdXJlQ2VudHJlKG8sIHRhcmdldClcclxuXHJcbiAgICAgIC8vIGVuc3VyZSBza2V3IHZhbHVlcyBvbiBib3RoIGF4ZXNcclxuICAgICAgby5za2V3WCA9IG8uc2tld1ggIT0gbnVsbCA/IG8uc2tld1ggOiAwXHJcbiAgICAgIG8uc2tld1kgPSBvLnNrZXdZICE9IG51bGwgPyBvLnNrZXdZIDogMFxyXG5cclxuICAgICAgbWF0cml4ID0gbmV3IFNWRy5Ta2V3KG8uc2tld1gsIG8uc2tld1ksIG8uY3gsIG8uY3kpXHJcblxyXG4gICAgLy8gYWN0IG9uIGZsaXBcclxuICAgIH0gZWxzZSBpZiAoby5mbGlwKSB7XHJcbiAgICAgIGlmKG8uZmxpcCA9PSAneCcgfHwgby5mbGlwID09ICd5Jykge1xyXG4gICAgICAgIG8ub2Zmc2V0ID0gby5vZmZzZXQgPT0gbnVsbCA/IHRhcmdldC5iYm94KClbJ2MnICsgby5mbGlwXSA6IG8ub2Zmc2V0XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYoby5vZmZzZXQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgYmJveCA9IHRhcmdldC5iYm94KClcclxuICAgICAgICAgIG8uZmxpcCA9IGJib3guY3hcclxuICAgICAgICAgIG8ub2Zmc2V0ID0gYmJveC5jeVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvLmZsaXAgPSBvLm9mZnNldFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgbWF0cml4ID0gbmV3IFNWRy5NYXRyaXgoKS5mbGlwKG8uZmxpcCwgby5vZmZzZXQpXHJcblxyXG4gICAgLy8gYWN0IG9uIHRyYW5zbGF0ZVxyXG4gICAgfSBlbHNlIGlmIChvLnggIT0gbnVsbCB8fCBvLnkgIT0gbnVsbCkge1xyXG4gICAgICBtYXRyaXggPSBuZXcgU1ZHLlRyYW5zbGF0ZShvLngsIG8ueSlcclxuICAgIH1cclxuXHJcbiAgICBpZighbWF0cml4KSByZXR1cm4gdGhpc1xyXG5cclxuICAgIG1hdHJpeC5yZWxhdGl2ZSA9IHJlbGF0aXZlXHJcblxyXG4gICAgdGhpcy5sYXN0KCkudHJhbnNmb3Jtcy5wdXNoKG1hdHJpeClcclxuXHJcbiAgICByZXR1cm4gdGhpcy5fY2FsbFN0YXJ0KClcclxuICB9XHJcbn0pXHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgLy8gUmVzZXQgYWxsIHRyYW5zZm9ybWF0aW9uc1xyXG4gIHVudHJhbnNmb3JtOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIG51bGwpXHJcbiAgfSxcclxuICAvLyBtZXJnZSB0aGUgd2hvbGUgdHJhbnNmb3JtYXRpb24gY2hhaW4gaW50byBvbmUgbWF0cml4IGFuZCByZXR1cm5zIGl0XHJcbiAgbWF0cml4aWZ5OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgbWF0cml4ID0gKHRoaXMuYXR0cigndHJhbnNmb3JtJykgfHwgJycpXHJcbiAgICAgIC8vIHNwbGl0IHRyYW5zZm9ybWF0aW9uc1xyXG4gICAgICAuc3BsaXQoU1ZHLnJlZ2V4LnRyYW5zZm9ybXMpLnNsaWNlKDAsLTEpLm1hcChmdW5jdGlvbihzdHIpe1xyXG4gICAgICAgIC8vIGdlbmVyYXRlIGtleSA9PiB2YWx1ZSBwYWlyc1xyXG4gICAgICAgIHZhciBrdiA9IHN0ci50cmltKCkuc3BsaXQoJygnKVxyXG4gICAgICAgIHJldHVybiBba3ZbMF0sIGt2WzFdLnNwbGl0KFNWRy5yZWdleC5kZWxpbWl0ZXIpLm1hcChmdW5jdGlvbihzdHIpeyByZXR1cm4gcGFyc2VGbG9hdChzdHIpIH0pXVxyXG4gICAgICB9KVxyXG4gICAgICAvLyBtZXJnZSBldmVyeSB0cmFuc2Zvcm1hdGlvbiBpbnRvIG9uZSBtYXRyaXhcclxuICAgICAgLnJlZHVjZShmdW5jdGlvbihtYXRyaXgsIHRyYW5zZm9ybSl7XHJcblxyXG4gICAgICAgIGlmKHRyYW5zZm9ybVswXSA9PSAnbWF0cml4JykgcmV0dXJuIG1hdHJpeC5tdWx0aXBseShhcnJheVRvTWF0cml4KHRyYW5zZm9ybVsxXSkpXHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeFt0cmFuc2Zvcm1bMF1dLmFwcGx5KG1hdHJpeCwgdHJhbnNmb3JtWzFdKVxyXG5cclxuICAgICAgfSwgbmV3IFNWRy5NYXRyaXgoKSlcclxuXHJcbiAgICByZXR1cm4gbWF0cml4XHJcbiAgfSxcclxuICAvLyBhZGQgYW4gZWxlbWVudCB0byBhbm90aGVyIHBhcmVudCB3aXRob3V0IGNoYW5naW5nIHRoZSB2aXN1YWwgcmVwcmVzZW50YXRpb24gb24gdGhlIHNjcmVlblxyXG4gIHRvUGFyZW50OiBmdW5jdGlvbihwYXJlbnQpIHtcclxuICAgIGlmKHRoaXMgPT0gcGFyZW50KSByZXR1cm4gdGhpc1xyXG4gICAgdmFyIGN0bSA9IHRoaXMuc2NyZWVuQ1RNKClcclxuICAgIHZhciBwQ3RtID0gcGFyZW50LnNjcmVlbkNUTSgpLmludmVyc2UoKVxyXG5cclxuICAgIHRoaXMuYWRkVG8ocGFyZW50KS51bnRyYW5zZm9ybSgpLnRyYW5zZm9ybShwQ3RtLm11bHRpcGx5KGN0bSkpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9LFxyXG4gIC8vIHNhbWUgYXMgYWJvdmUgd2l0aCBwYXJlbnQgZXF1YWxzIHJvb3Qtc3ZnXHJcbiAgdG9Eb2M6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudG9QYXJlbnQodGhpcy5kb2MoKSlcclxuICB9XHJcblxyXG59KVxyXG5cclxuU1ZHLlRyYW5zZm9ybWF0aW9uID0gU1ZHLmludmVudCh7XHJcblxyXG4gIGNyZWF0ZTogZnVuY3Rpb24oc291cmNlLCBpbnZlcnNlZCl7XHJcblxyXG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgdHlwZW9mIGludmVyc2VkICE9ICdib29sZWFuJyl7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKVxyXG4gICAgfVxyXG5cclxuICAgIGlmKEFycmF5LmlzQXJyYXkoc291cmNlKSl7XHJcbiAgICAgIGZvcih2YXIgaSA9IDAsIGxlbiA9IHRoaXMuYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgKytpKXtcclxuICAgICAgICB0aGlzW3RoaXMuYXJndW1lbnRzW2ldXSA9IHNvdXJjZVtpXVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYodHlwZW9mIHNvdXJjZSA9PSAnb2JqZWN0Jyl7XHJcbiAgICAgIGZvcih2YXIgaSA9IDAsIGxlbiA9IHRoaXMuYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgKytpKXtcclxuICAgICAgICB0aGlzW3RoaXMuYXJndW1lbnRzW2ldXSA9IHNvdXJjZVt0aGlzLmFyZ3VtZW50c1tpXV1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW52ZXJzZWQgPSBmYWxzZVxyXG5cclxuICAgIGlmKGludmVyc2VkID09PSB0cnVlKXtcclxuICAgICAgdGhpcy5pbnZlcnNlZCA9IHRydWVcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuLCBleHRlbmQ6IHtcclxuXHJcbiAgICBhcmd1bWVudHM6IFtdXHJcbiAgLCBtZXRob2Q6ICcnXHJcblxyXG4gICwgYXQ6IGZ1bmN0aW9uKHBvcyl7XHJcblxyXG4gICAgICB2YXIgcGFyYW1zID0gW11cclxuXHJcbiAgICAgIGZvcih2YXIgaSA9IDAsIGxlbiA9IHRoaXMuYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgKytpKXtcclxuICAgICAgICBwYXJhbXMucHVzaCh0aGlzW3RoaXMuYXJndW1lbnRzW2ldXSlcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIG0gPSB0aGlzLl91bmRvIHx8IG5ldyBTVkcuTWF0cml4KClcclxuXHJcbiAgICAgIG0gPSBuZXcgU1ZHLk1hdHJpeCgpLm1vcnBoKFNWRy5NYXRyaXgucHJvdG90eXBlW3RoaXMubWV0aG9kXS5hcHBseShtLCBwYXJhbXMpKS5hdChwb3MpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5pbnZlcnNlZCA/IG0uaW52ZXJzZSgpIDogbVxyXG5cclxuICAgIH1cclxuXHJcbiAgLCB1bmRvOiBmdW5jdGlvbihvKXtcclxuICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gdGhpcy5hcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuOyArK2kpe1xyXG4gICAgICAgIG9bdGhpcy5hcmd1bWVudHNbaV1dID0gdHlwZW9mIHRoaXNbdGhpcy5hcmd1bWVudHNbaV1dID09ICd1bmRlZmluZWQnID8gMCA6IG9bdGhpcy5hcmd1bWVudHNbaV1dXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoZSBtZXRob2QgU1ZHLk1hdHJpeC5leHRyYWN0IHdoaWNoIHdhcyB1c2VkIGJlZm9yZSBjYWxsaW5nIHRoaXNcclxuICAgICAgLy8gbWV0aG9kIHRvIG9idGFpbiBhIHZhbHVlIGZvciB0aGUgcGFyYW1ldGVyIG8gZG9lc24ndCByZXR1cm4gYSBjeCBhbmRcclxuICAgICAgLy8gYSBjeSBzbyB3ZSB1c2UgdGhlIG9uZXMgdGhhdCB3ZXJlIHByb3ZpZGVkIHRvIHRoaXMgb2JqZWN0IGF0IGl0cyBjcmVhdGlvblxyXG4gICAgICBvLmN4ID0gdGhpcy5jeFxyXG4gICAgICBvLmN5ID0gdGhpcy5jeVxyXG5cclxuICAgICAgdGhpcy5fdW5kbyA9IG5ldyBTVkdbY2FwaXRhbGl6ZSh0aGlzLm1ldGhvZCldKG8sIHRydWUpLmF0KDEpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG59KVxyXG5cclxuU1ZHLlRyYW5zbGF0ZSA9IFNWRy5pbnZlbnQoe1xyXG5cclxuICBwYXJlbnQ6IFNWRy5NYXRyaXhcclxuLCBpbmhlcml0OiBTVkcuVHJhbnNmb3JtYXRpb25cclxuXHJcbiwgY3JlYXRlOiBmdW5jdGlvbihzb3VyY2UsIGludmVyc2VkKXtcclxuICAgIHRoaXMuY29uc3RydWN0b3IuYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKVxyXG4gIH1cclxuXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICBhcmd1bWVudHM6IFsndHJhbnNmb3JtZWRYJywgJ3RyYW5zZm9ybWVkWSddXHJcbiAgLCBtZXRob2Q6ICd0cmFuc2xhdGUnXHJcbiAgfVxyXG5cclxufSlcclxuXHJcblNWRy5Sb3RhdGUgPSBTVkcuaW52ZW50KHtcclxuXHJcbiAgcGFyZW50OiBTVkcuTWF0cml4XHJcbiwgaW5oZXJpdDogU1ZHLlRyYW5zZm9ybWF0aW9uXHJcblxyXG4sIGNyZWF0ZTogZnVuY3Rpb24oc291cmNlLCBpbnZlcnNlZCl7XHJcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSlcclxuICB9XHJcblxyXG4sIGV4dGVuZDoge1xyXG4gICAgYXJndW1lbnRzOiBbJ3JvdGF0aW9uJywgJ2N4JywgJ2N5J11cclxuICAsIG1ldGhvZDogJ3JvdGF0ZSdcclxuICAsIGF0OiBmdW5jdGlvbihwb3Mpe1xyXG4gICAgICB2YXIgbSA9IG5ldyBTVkcuTWF0cml4KCkucm90YXRlKG5ldyBTVkcuTnVtYmVyKCkubW9ycGgodGhpcy5yb3RhdGlvbiAtICh0aGlzLl91bmRvID8gdGhpcy5fdW5kby5yb3RhdGlvbiA6IDApKS5hdChwb3MpLCB0aGlzLmN4LCB0aGlzLmN5KVxyXG4gICAgICByZXR1cm4gdGhpcy5pbnZlcnNlZCA/IG0uaW52ZXJzZSgpIDogbVxyXG4gICAgfVxyXG4gICwgdW5kbzogZnVuY3Rpb24obyl7XHJcbiAgICAgIHRoaXMuX3VuZG8gPSBvXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSlcclxuXHJcblNWRy5TY2FsZSA9IFNWRy5pbnZlbnQoe1xyXG5cclxuICBwYXJlbnQ6IFNWRy5NYXRyaXhcclxuLCBpbmhlcml0OiBTVkcuVHJhbnNmb3JtYXRpb25cclxuXHJcbiwgY3JlYXRlOiBmdW5jdGlvbihzb3VyY2UsIGludmVyc2VkKXtcclxuICAgIHRoaXMuY29uc3RydWN0b3IuYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKVxyXG4gIH1cclxuXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICBhcmd1bWVudHM6IFsnc2NhbGVYJywgJ3NjYWxlWScsICdjeCcsICdjeSddXHJcbiAgLCBtZXRob2Q6ICdzY2FsZSdcclxuICB9XHJcblxyXG59KVxyXG5cclxuU1ZHLlNrZXcgPSBTVkcuaW52ZW50KHtcclxuXHJcbiAgcGFyZW50OiBTVkcuTWF0cml4XHJcbiwgaW5oZXJpdDogU1ZHLlRyYW5zZm9ybWF0aW9uXHJcblxyXG4sIGNyZWF0ZTogZnVuY3Rpb24oc291cmNlLCBpbnZlcnNlZCl7XHJcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSlcclxuICB9XHJcblxyXG4sIGV4dGVuZDoge1xyXG4gICAgYXJndW1lbnRzOiBbJ3NrZXdYJywgJ3NrZXdZJywgJ2N4JywgJ2N5J11cclxuICAsIG1ldGhvZDogJ3NrZXcnXHJcbiAgfVxyXG5cclxufSlcclxuXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgLy8gRHluYW1pYyBzdHlsZSBnZW5lcmF0b3JcclxuICBzdHlsZTogZnVuY3Rpb24ocywgdikge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAvLyBnZXQgZnVsbCBzdHlsZVxyXG4gICAgICByZXR1cm4gdGhpcy5ub2RlLnN0eWxlLmNzc1RleHQgfHwgJydcclxuXHJcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XHJcbiAgICAgIC8vIGFwcGx5IGV2ZXJ5IHN0eWxlIGluZGl2aWR1YWxseSBpZiBhbiBvYmplY3QgaXMgcGFzc2VkXHJcbiAgICAgIGlmICh0eXBlb2YgcyA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGZvciAodiBpbiBzKSB0aGlzLnN0eWxlKHYsIHNbdl0pXHJcblxyXG4gICAgICB9IGVsc2UgaWYgKFNWRy5yZWdleC5pc0Nzcy50ZXN0KHMpKSB7XHJcbiAgICAgICAgLy8gcGFyc2UgY3NzIHN0cmluZ1xyXG4gICAgICAgIHMgPSBzLnNwbGl0KC9cXHMqO1xccyovKVxyXG4gICAgICAgICAgLy8gZmlsdGVyIG91dCBzdWZmaXggOyBhbmQgc3R1ZmYgbGlrZSA7O1xyXG4gICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihlKSB7IHJldHVybiAhIWUgfSlcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24oZSl7IHJldHVybiBlLnNwbGl0KC9cXHMqOlxccyovKSB9KVxyXG5cclxuICAgICAgICAvLyBhcHBseSBldmVyeSBkZWZpbml0aW9uIGluZGl2aWR1YWxseVxyXG4gICAgICAgIHdoaWxlICh2ID0gcy5wb3AoKSkge1xyXG4gICAgICAgICAgdGhpcy5zdHlsZSh2WzBdLCB2WzFdKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBhY3QgYXMgYSBnZXR0ZXIgaWYgdGhlIGZpcnN0IGFuZCBvbmx5IGFyZ3VtZW50IGlzIG5vdCBhbiBvYmplY3RcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLnN0eWxlW2NhbWVsQ2FzZShzKV1cclxuICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubm9kZS5zdHlsZVtjYW1lbENhc2UocyldID0gdiA9PT0gbnVsbCB8fCBTVkcucmVnZXguaXNCbGFuay50ZXN0KHYpID8gJycgOiB2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn0pXG5TVkcuUGFyZW50ID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgZWxlbWVudClcclxuICB9XHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5FbGVtZW50XHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBSZXR1cm5zIGFsbCBjaGlsZCBlbGVtZW50c1xyXG4gICAgY2hpbGRyZW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gU1ZHLnV0aWxzLm1hcChTVkcudXRpbHMuZmlsdGVyU1ZHRWxlbWVudHModGhpcy5ub2RlLmNoaWxkTm9kZXMpLCBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIFNWRy5hZG9wdChub2RlKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgLy8gQWRkIGdpdmVuIGVsZW1lbnQgYXQgYSBwb3NpdGlvblxyXG4gICwgYWRkOiBmdW5jdGlvbihlbGVtZW50LCBpKSB7XHJcbiAgICAgIGlmIChpID09IG51bGwpXHJcbiAgICAgICAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKGVsZW1lbnQubm9kZSlcclxuICAgICAgZWxzZSBpZiAoZWxlbWVudC5ub2RlICE9IHRoaXMubm9kZS5jaGlsZE5vZGVzW2ldKVxyXG4gICAgICAgIHRoaXMubm9kZS5pbnNlcnRCZWZvcmUoZWxlbWVudC5ub2RlLCB0aGlzLm5vZGUuY2hpbGROb2Rlc1tpXSlcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBCYXNpY2FsbHkgZG9lcyB0aGUgc2FtZSBhcyBgYWRkKClgIGJ1dCByZXR1cm5zIHRoZSBhZGRlZCBlbGVtZW50IGluc3RlYWRcclxuICAsIHB1dDogZnVuY3Rpb24oZWxlbWVudCwgaSkge1xyXG4gICAgICB0aGlzLmFkZChlbGVtZW50LCBpKVxyXG4gICAgICByZXR1cm4gZWxlbWVudFxyXG4gICAgfVxyXG4gICAgLy8gQ2hlY2tzIGlmIHRoZSBnaXZlbiBlbGVtZW50IGlzIGEgY2hpbGRcclxuICAsIGhhczogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbmRleChlbGVtZW50KSA+PSAwXHJcbiAgICB9XHJcbiAgICAvLyBHZXRzIGluZGV4IG9mIGdpdmVuIGVsZW1lbnRcclxuICAsIGluZGV4OiBmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKHRoaXMubm9kZS5jaGlsZE5vZGVzKS5pbmRleE9mKGVsZW1lbnQubm9kZSlcclxuICAgIH1cclxuICAgIC8vIEdldCBhIGVsZW1lbnQgYXQgdGhlIGdpdmVuIGluZGV4XHJcbiAgLCBnZXQ6IGZ1bmN0aW9uKGkpIHtcclxuICAgICAgcmV0dXJuIFNWRy5hZG9wdCh0aGlzLm5vZGUuY2hpbGROb2Rlc1tpXSlcclxuICAgIH1cclxuICAgIC8vIEdldCBmaXJzdCBjaGlsZFxyXG4gICwgZmlyc3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXQoMClcclxuICAgIH1cclxuICAgIC8vIEdldCB0aGUgbGFzdCBjaGlsZFxyXG4gICwgbGFzdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldCh0aGlzLm5vZGUuY2hpbGROb2Rlcy5sZW5ndGggLSAxKVxyXG4gICAgfVxyXG4gICAgLy8gSXRlcmF0ZXMgb3ZlciBhbGwgY2hpbGRyZW4gYW5kIGludm9rZXMgYSBnaXZlbiBibG9ja1xyXG4gICwgZWFjaDogZnVuY3Rpb24oYmxvY2ssIGRlZXApIHtcclxuICAgICAgdmFyIGksIGlsXHJcbiAgICAgICAgLCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4oKVxyXG5cclxuICAgICAgZm9yIChpID0gMCwgaWwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGNoaWxkcmVuW2ldIGluc3RhbmNlb2YgU1ZHLkVsZW1lbnQpXHJcbiAgICAgICAgICBibG9jay5hcHBseShjaGlsZHJlbltpXSwgW2ksIGNoaWxkcmVuXSlcclxuXHJcbiAgICAgICAgaWYgKGRlZXAgJiYgKGNoaWxkcmVuW2ldIGluc3RhbmNlb2YgU1ZHLkNvbnRhaW5lcikpXHJcbiAgICAgICAgICBjaGlsZHJlbltpXS5lYWNoKGJsb2NrLCBkZWVwKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gUmVtb3ZlIGEgZ2l2ZW4gY2hpbGRcclxuICAsIHJlbW92ZUVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5ub2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQubm9kZSlcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBSZW1vdmUgYWxsIGVsZW1lbnRzIGluIHRoaXMgY29udGFpbmVyXHJcbiAgLCBjbGVhcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vIHJlbW92ZSBjaGlsZHJlblxyXG4gICAgICB3aGlsZSh0aGlzLm5vZGUuaGFzQ2hpbGROb2RlcygpKVxyXG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUubGFzdENoaWxkKVxyXG5cclxuICAgICAgLy8gcmVtb3ZlIGRlZnMgcmVmZXJlbmNlXHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9kZWZzXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICwgLy8gR2V0IGRlZnNcclxuICAgIGRlZnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5kb2MoKS5kZWZzKClcclxuICAgIH1cclxuICB9XHJcblxyXG59KVxyXG5cblNWRy5leHRlbmQoU1ZHLlBhcmVudCwge1xyXG5cclxuICB1bmdyb3VwOiBmdW5jdGlvbihwYXJlbnQsIGRlcHRoKSB7XHJcbiAgICBpZihkZXB0aCA9PT0gMCB8fCB0aGlzIGluc3RhbmNlb2YgU1ZHLkRlZnMgfHwgdGhpcy5ub2RlID09IFNWRy5wYXJzZXIuZHJhdykgcmV0dXJuIHRoaXNcclxuXHJcbiAgICBwYXJlbnQgPSBwYXJlbnQgfHwgKHRoaXMgaW5zdGFuY2VvZiBTVkcuRG9jID8gdGhpcyA6IHRoaXMucGFyZW50KFNWRy5QYXJlbnQpKVxyXG4gICAgZGVwdGggPSBkZXB0aCB8fCBJbmZpbml0eVxyXG5cclxuICAgIHRoaXMuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICBpZih0aGlzIGluc3RhbmNlb2YgU1ZHLkRlZnMpIHJldHVybiB0aGlzXHJcbiAgICAgIGlmKHRoaXMgaW5zdGFuY2VvZiBTVkcuUGFyZW50KSByZXR1cm4gdGhpcy51bmdyb3VwKHBhcmVudCwgZGVwdGgtMSlcclxuICAgICAgcmV0dXJuIHRoaXMudG9QYXJlbnQocGFyZW50KVxyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLm5vZGUuZmlyc3RDaGlsZCB8fCB0aGlzLnJlbW92ZSgpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9LFxyXG5cclxuICBmbGF0dGVuOiBmdW5jdGlvbihwYXJlbnQsIGRlcHRoKSB7XHJcbiAgICByZXR1cm4gdGhpcy51bmdyb3VwKHBhcmVudCwgZGVwdGgpXHJcbiAgfVxyXG5cclxufSlcblNWRy5Db250YWluZXIgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBlbGVtZW50KVxyXG4gIH1cclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLlBhcmVudFxyXG5cclxufSlcblxyXG5TVkcuVmlld0JveCA9IFNWRy5pbnZlbnQoe1xyXG5cclxuICBjcmVhdGU6IGZ1bmN0aW9uKHNvdXJjZSkge1xyXG4gICAgdmFyIGksIGJhc2UgPSBbMCwgMCwgMCwgMF1cclxuXHJcbiAgICB2YXIgeCwgeSwgd2lkdGgsIGhlaWdodCwgYm94LCB2aWV3LCB3ZSwgaGVcclxuICAgICAgLCB3bSAgID0gMSAvLyB3aWR0aCBtdWx0aXBsaWVyXHJcbiAgICAgICwgaG0gICA9IDEgLy8gaGVpZ2h0IG11bHRpcGxpZXJcclxuICAgICAgLCByZWcgID0gL1srLV0/KD86XFxkKyg/OlxcLlxcZCopP3xcXC5cXGQrKSg/OmVbKy1dP1xcZCspPy9naVxyXG5cclxuICAgIGlmKHNvdXJjZSBpbnN0YW5jZW9mIFNWRy5FbGVtZW50KXtcclxuXHJcbiAgICAgIHdlID0gc291cmNlXHJcbiAgICAgIGhlID0gc291cmNlXHJcbiAgICAgIHZpZXcgPSAoc291cmNlLmF0dHIoJ3ZpZXdCb3gnKSB8fCAnJykubWF0Y2gocmVnKVxyXG4gICAgICBib3ggPSBzb3VyY2UuYmJveFxyXG5cclxuICAgICAgLy8gZ2V0IGRpbWVuc2lvbnMgb2YgY3VycmVudCBub2RlXHJcbiAgICAgIHdpZHRoICA9IG5ldyBTVkcuTnVtYmVyKHNvdXJjZS53aWR0aCgpKVxyXG4gICAgICBoZWlnaHQgPSBuZXcgU1ZHLk51bWJlcihzb3VyY2UuaGVpZ2h0KCkpXHJcblxyXG4gICAgICAvLyBmaW5kIG5lYXJlc3Qgbm9uLXBlcmNlbnR1YWwgZGltZW5zaW9uc1xyXG4gICAgICB3aGlsZSAod2lkdGgudW5pdCA9PSAnJScpIHtcclxuICAgICAgICB3bSAqPSB3aWR0aC52YWx1ZVxyXG4gICAgICAgIHdpZHRoID0gbmV3IFNWRy5OdW1iZXIod2UgaW5zdGFuY2VvZiBTVkcuRG9jID8gd2UucGFyZW50KCkub2Zmc2V0V2lkdGggOiB3ZS5wYXJlbnQoKS53aWR0aCgpKVxyXG4gICAgICAgIHdlID0gd2UucGFyZW50KClcclxuICAgICAgfVxyXG4gICAgICB3aGlsZSAoaGVpZ2h0LnVuaXQgPT0gJyUnKSB7XHJcbiAgICAgICAgaG0gKj0gaGVpZ2h0LnZhbHVlXHJcbiAgICAgICAgaGVpZ2h0ID0gbmV3IFNWRy5OdW1iZXIoaGUgaW5zdGFuY2VvZiBTVkcuRG9jID8gaGUucGFyZW50KCkub2Zmc2V0SGVpZ2h0IDogaGUucGFyZW50KCkuaGVpZ2h0KCkpXHJcbiAgICAgICAgaGUgPSBoZS5wYXJlbnQoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBlbnN1cmUgZGVmYXVsdHNcclxuICAgICAgdGhpcy54ICAgICAgPSAwXHJcbiAgICAgIHRoaXMueSAgICAgID0gMFxyXG4gICAgICB0aGlzLndpZHRoICA9IHdpZHRoICAqIHdtXHJcbiAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0ICogaG1cclxuICAgICAgdGhpcy56b29tICAgPSAxXHJcblxyXG4gICAgICBpZiAodmlldykge1xyXG4gICAgICAgIC8vIGdldCB3aWR0aCBhbmQgaGVpZ2h0IGZyb20gdmlld2JveFxyXG4gICAgICAgIHggICAgICA9IHBhcnNlRmxvYXQodmlld1swXSlcclxuICAgICAgICB5ICAgICAgPSBwYXJzZUZsb2F0KHZpZXdbMV0pXHJcbiAgICAgICAgd2lkdGggID0gcGFyc2VGbG9hdCh2aWV3WzJdKVxyXG4gICAgICAgIGhlaWdodCA9IHBhcnNlRmxvYXQodmlld1szXSlcclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHpvb20gYWNjb3JpbmcgdG8gdmlld2JveFxyXG4gICAgICAgIHRoaXMuem9vbSA9ICgodGhpcy53aWR0aCAvIHRoaXMuaGVpZ2h0KSA+ICh3aWR0aCAvIGhlaWdodCkpID9cclxuICAgICAgICAgIHRoaXMuaGVpZ2h0IC8gaGVpZ2h0IDpcclxuICAgICAgICAgIHRoaXMud2lkdGggIC8gd2lkdGhcclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHJlYWwgcGl4ZWwgZGltZW5zaW9ucyBvbiBwYXJlbnQgU1ZHLkRvYyBlbGVtZW50XHJcbiAgICAgICAgdGhpcy54ICAgICAgPSB4XHJcbiAgICAgICAgdGhpcy55ICAgICAgPSB5XHJcbiAgICAgICAgdGhpcy53aWR0aCAgPSB3aWR0aFxyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgfWVsc2V7XHJcblxyXG4gICAgICAvLyBlbnN1cmUgc291cmNlIGFzIG9iamVjdFxyXG4gICAgICBzb3VyY2UgPSB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyA/XHJcbiAgICAgICAgc291cmNlLm1hdGNoKHJlZykubWFwKGZ1bmN0aW9uKGVsKXsgcmV0dXJuIHBhcnNlRmxvYXQoZWwpIH0pIDpcclxuICAgICAgQXJyYXkuaXNBcnJheShzb3VyY2UpID9cclxuICAgICAgICBzb3VyY2UgOlxyXG4gICAgICB0eXBlb2Ygc291cmNlID09ICdvYmplY3QnID9cclxuICAgICAgICBbc291cmNlLngsIHNvdXJjZS55LCBzb3VyY2Uud2lkdGgsIHNvdXJjZS5oZWlnaHRdIDpcclxuICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PSA0ID9cclxuICAgICAgICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykgOlxyXG4gICAgICAgIGJhc2VcclxuXHJcbiAgICAgIHRoaXMueCA9IHNvdXJjZVswXVxyXG4gICAgICB0aGlzLnkgPSBzb3VyY2VbMV1cclxuICAgICAgdGhpcy53aWR0aCA9IHNvdXJjZVsyXVxyXG4gICAgICB0aGlzLmhlaWdodCA9IHNvdXJjZVszXVxyXG4gICAgfVxyXG5cclxuXHJcbiAgfVxyXG5cclxuLCBleHRlbmQ6IHtcclxuXHJcbiAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnggKyAnICcgKyB0aGlzLnkgKyAnICcgKyB0aGlzLndpZHRoICsgJyAnICsgdGhpcy5oZWlnaHRcclxuICAgIH1cclxuICAsIG1vcnBoOiBmdW5jdGlvbih4LCB5LCB3aWR0aCwgaGVpZ2h0KXtcclxuICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBTVkcuVmlld0JveCh4LCB5LCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAsIGF0OiBmdW5jdGlvbihwb3MpIHtcclxuXHJcbiAgICAgIGlmKCF0aGlzLmRlc3RpbmF0aW9uKSByZXR1cm4gdGhpc1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBTVkcuVmlld0JveChbXHJcbiAgICAgICAgICB0aGlzLnggKyAodGhpcy5kZXN0aW5hdGlvbi54IC0gdGhpcy54KSAqIHBvc1xyXG4gICAgICAgICwgdGhpcy55ICsgKHRoaXMuZGVzdGluYXRpb24ueSAtIHRoaXMueSkgKiBwb3NcclxuICAgICAgICAsIHRoaXMud2lkdGggKyAodGhpcy5kZXN0aW5hdGlvbi53aWR0aCAtIHRoaXMud2lkdGgpICogcG9zXHJcbiAgICAgICAgLCB0aGlzLmhlaWdodCArICh0aGlzLmRlc3RpbmF0aW9uLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSAqIHBvc1xyXG4gICAgICBdKVxyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvLyBEZWZpbmUgcGFyZW50XHJcbiwgcGFyZW50OiBTVkcuQ29udGFpbmVyXHJcblxyXG4gIC8vIEFkZCBwYXJlbnQgbWV0aG9kXHJcbiwgY29uc3RydWN0OiB7XHJcblxyXG4gICAgLy8gZ2V0L3NldCB2aWV3Ym94XHJcbiAgICB2aWV3Ym94OiBmdW5jdGlvbih4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApXHJcbiAgICAgICAgLy8gYWN0IGFzIGEgZ2V0dGVyIGlmIHRoZXJlIGFyZSBubyBhcmd1bWVudHNcclxuICAgICAgICByZXR1cm4gbmV3IFNWRy5WaWV3Qm94KHRoaXMpXHJcblxyXG4gICAgICAvLyBvdGhlcndpc2UgYWN0IGFzIGEgc2V0dGVyXHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3ZpZXdCb3gnLCBuZXcgU1ZHLlZpZXdCb3goeCwgeSwgd2lkdGgsIGhlaWdodCkpXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbn0pXG4vLyBBZGQgZXZlbnRzIHRvIGVsZW1lbnRzXHJcbjtbICAnY2xpY2snXHJcbiAgLCAnZGJsY2xpY2snXHJcbiAgLCAnbW91c2Vkb3duJ1xyXG4gICwgJ21vdXNldXAnXHJcbiAgLCAnbW91c2VvdmVyJ1xyXG4gICwgJ21vdXNlb3V0J1xyXG4gICwgJ21vdXNlbW92ZSdcclxuICAvLyAsICdtb3VzZWVudGVyJyAtPiBub3Qgc3VwcG9ydGVkIGJ5IElFXHJcbiAgLy8gLCAnbW91c2VsZWF2ZScgLT4gbm90IHN1cHBvcnRlZCBieSBJRVxyXG4gICwgJ3RvdWNoc3RhcnQnXHJcbiAgLCAndG91Y2htb3ZlJ1xyXG4gICwgJ3RvdWNobGVhdmUnXHJcbiAgLCAndG91Y2hlbmQnXHJcbiAgLCAndG91Y2hjYW5jZWwnIF0uZm9yRWFjaChmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAvLyBhZGQgZXZlbnQgdG8gU1ZHLkVsZW1lbnRcclxuICBTVkcuRWxlbWVudC5wcm90b3R5cGVbZXZlbnRdID0gZnVuY3Rpb24oZikge1xyXG4gICAgLy8gYmluZCBldmVudCB0byBlbGVtZW50IHJhdGhlciB0aGFuIGVsZW1lbnQgbm9kZVxyXG4gICAgU1ZHLm9uKHRoaXMubm9kZSwgZXZlbnQsIGYpXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufSlcclxuXHJcbi8vIEluaXRpYWxpemUgbGlzdGVuZXJzIHN0YWNrXHJcblNWRy5saXN0ZW5lcnMgPSBbXVxyXG5TVkcuaGFuZGxlck1hcCA9IFtdXHJcblNWRy5saXN0ZW5lcklkID0gMFxyXG5cclxuLy8gQWRkIGV2ZW50IGJpbmRlciBpbiB0aGUgU1ZHIG5hbWVzcGFjZVxyXG5TVkcub24gPSBmdW5jdGlvbihub2RlLCBldmVudCwgbGlzdGVuZXIsIGJpbmRpbmcsIG9wdGlvbnMpIHtcclxuICAvLyBjcmVhdGUgbGlzdGVuZXIsIGdldCBvYmplY3QtaW5kZXhcclxuICB2YXIgbCAgICAgPSBsaXN0ZW5lci5iaW5kKGJpbmRpbmcgfHwgbm9kZS5pbnN0YW5jZSB8fCBub2RlKVxyXG4gICAgLCBpbmRleCA9IChTVkcuaGFuZGxlck1hcC5pbmRleE9mKG5vZGUpICsgMSB8fCBTVkcuaGFuZGxlck1hcC5wdXNoKG5vZGUpKSAtIDFcclxuICAgICwgZXYgICAgPSBldmVudC5zcGxpdCgnLicpWzBdXHJcbiAgICAsIG5zICAgID0gZXZlbnQuc3BsaXQoJy4nKVsxXSB8fCAnKidcclxuXHJcblxyXG4gIC8vIGVuc3VyZSB2YWxpZCBvYmplY3RcclxuICBTVkcubGlzdGVuZXJzW2luZGV4XSAgICAgICAgID0gU1ZHLmxpc3RlbmVyc1tpbmRleF0gICAgICAgICB8fCB7fVxyXG4gIFNWRy5saXN0ZW5lcnNbaW5kZXhdW2V2XSAgICAgPSBTVkcubGlzdGVuZXJzW2luZGV4XVtldl0gICAgIHx8IHt9XHJcbiAgU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdW25zXSA9IFNWRy5saXN0ZW5lcnNbaW5kZXhdW2V2XVtuc10gfHwge31cclxuXHJcbiAgaWYoIWxpc3RlbmVyLl9zdmdqc0xpc3RlbmVySWQpXHJcbiAgICBsaXN0ZW5lci5fc3ZnanNMaXN0ZW5lcklkID0gKytTVkcubGlzdGVuZXJJZFxyXG5cclxuICAvLyByZWZlcmVuY2UgbGlzdGVuZXJcclxuICBTVkcubGlzdGVuZXJzW2luZGV4XVtldl1bbnNdW2xpc3RlbmVyLl9zdmdqc0xpc3RlbmVySWRdID0gbFxyXG5cclxuICAvLyBhZGQgbGlzdGVuZXJcclxuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGwsIG9wdGlvbnMgfHwgZmFsc2UpXHJcbn1cclxuXHJcbi8vIEFkZCBldmVudCB1bmJpbmRlciBpbiB0aGUgU1ZHIG5hbWVzcGFjZVxyXG5TVkcub2ZmID0gZnVuY3Rpb24obm9kZSwgZXZlbnQsIGxpc3RlbmVyKSB7XHJcbiAgdmFyIGluZGV4ID0gU1ZHLmhhbmRsZXJNYXAuaW5kZXhPZihub2RlKVxyXG4gICAgLCBldiAgICA9IGV2ZW50ICYmIGV2ZW50LnNwbGl0KCcuJylbMF1cclxuICAgICwgbnMgICAgPSBldmVudCAmJiBldmVudC5zcGxpdCgnLicpWzFdXHJcbiAgICAsIG5hbWVzcGFjZSA9ICcnXHJcblxyXG4gIGlmKGluZGV4ID09IC0xKSByZXR1cm5cclxuXHJcbiAgaWYgKGxpc3RlbmVyKSB7XHJcbiAgICBpZih0eXBlb2YgbGlzdGVuZXIgPT0gJ2Z1bmN0aW9uJykgbGlzdGVuZXIgPSBsaXN0ZW5lci5fc3ZnanNMaXN0ZW5lcklkXHJcbiAgICBpZighbGlzdGVuZXIpIHJldHVyblxyXG5cclxuICAgIC8vIHJlbW92ZSBsaXN0ZW5lciByZWZlcmVuY2VcclxuICAgIGlmIChTVkcubGlzdGVuZXJzW2luZGV4XVtldl0gJiYgU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdW25zIHx8ICcqJ10pIHtcclxuICAgICAgLy8gcmVtb3ZlIGxpc3RlbmVyXHJcbiAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldiwgU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdW25zIHx8ICcqJ11bbGlzdGVuZXJdLCBmYWxzZSlcclxuXHJcbiAgICAgIGRlbGV0ZSBTVkcubGlzdGVuZXJzW2luZGV4XVtldl1bbnMgfHwgJyonXVtsaXN0ZW5lcl1cclxuICAgIH1cclxuXHJcbiAgfSBlbHNlIGlmIChucyAmJiBldikge1xyXG4gICAgLy8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yIGEgbmFtZXNwYWNlZCBldmVudFxyXG4gICAgaWYgKFNWRy5saXN0ZW5lcnNbaW5kZXhdW2V2XSAmJiBTVkcubGlzdGVuZXJzW2luZGV4XVtldl1bbnNdKSB7XHJcbiAgICAgIGZvciAobGlzdGVuZXIgaW4gU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdW25zXSlcclxuICAgICAgICBTVkcub2ZmKG5vZGUsIFtldiwgbnNdLmpvaW4oJy4nKSwgbGlzdGVuZXIpXHJcblxyXG4gICAgICBkZWxldGUgU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdW25zXVxyXG4gICAgfVxyXG5cclxuICB9IGVsc2UgaWYgKG5zKXtcclxuICAgIC8vIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvciBhIHNwZWNpZmljIG5hbWVzcGFjZVxyXG4gICAgZm9yKGV2ZW50IGluIFNWRy5saXN0ZW5lcnNbaW5kZXhdKXtcclxuICAgICAgICBmb3IobmFtZXNwYWNlIGluIFNWRy5saXN0ZW5lcnNbaW5kZXhdW2V2ZW50XSl7XHJcbiAgICAgICAgICAgIGlmKG5zID09PSBuYW1lc3BhY2Upe1xyXG4gICAgICAgICAgICAgICAgU1ZHLm9mZihub2RlLCBbZXZlbnQsIG5zXS5qb2luKCcuJykpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH0gZWxzZSBpZiAoZXYpIHtcclxuICAgIC8vIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvciB0aGUgZXZlbnRcclxuICAgIGlmIChTVkcubGlzdGVuZXJzW2luZGV4XVtldl0pIHtcclxuICAgICAgZm9yIChuYW1lc3BhY2UgaW4gU1ZHLmxpc3RlbmVyc1tpbmRleF1bZXZdKVxyXG4gICAgICAgIFNWRy5vZmYobm9kZSwgW2V2LCBuYW1lc3BhY2VdLmpvaW4oJy4nKSlcclxuXHJcbiAgICAgIGRlbGV0ZSBTVkcubGlzdGVuZXJzW2luZGV4XVtldl1cclxuICAgIH1cclxuXHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIHJlbW92ZSBhbGwgbGlzdGVuZXJzIG9uIGEgZ2l2ZW4gbm9kZVxyXG4gICAgZm9yIChldmVudCBpbiBTVkcubGlzdGVuZXJzW2luZGV4XSlcclxuICAgICAgU1ZHLm9mZihub2RlLCBldmVudClcclxuXHJcbiAgICBkZWxldGUgU1ZHLmxpc3RlbmVyc1tpbmRleF1cclxuICAgIGRlbGV0ZSBTVkcuaGFuZGxlck1hcFtpbmRleF1cclxuXHJcbiAgfVxyXG59XHJcblxyXG4vL1xyXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgLy8gQmluZCBnaXZlbiBldmVudCB0byBsaXN0ZW5lclxyXG4gIG9uOiBmdW5jdGlvbihldmVudCwgbGlzdGVuZXIsIGJpbmRpbmcsIG9wdGlvbnMpIHtcclxuICAgIFNWRy5vbih0aGlzLm5vZGUsIGV2ZW50LCBsaXN0ZW5lciwgYmluZGluZywgb3B0aW9ucylcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBVbmJpbmQgZXZlbnQgZnJvbSBsaXN0ZW5lclxyXG4sIG9mZjogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XHJcbiAgICBTVkcub2ZmKHRoaXMubm9kZSwgZXZlbnQsIGxpc3RlbmVyKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIC8vIEZpcmUgZ2l2ZW4gZXZlbnRcclxuLCBmaXJlOiBmdW5jdGlvbihldmVudCwgZGF0YSkge1xyXG5cclxuICAgIC8vIERpc3BhdGNoIGV2ZW50XHJcbiAgICBpZihldmVudCBpbnN0YW5jZW9mIHdpbmRvdy5FdmVudCl7XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChldmVudCA9IG5ldyB3aW5kb3cuQ3VzdG9tRXZlbnQoZXZlbnQsIHtkZXRhaWw6ZGF0YSwgY2FuY2VsYWJsZTogdHJ1ZX0pKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2V2ZW50ID0gZXZlbnRcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4sIGV2ZW50OiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9ldmVudFxyXG4gIH1cclxufSlcclxuXG5cclxuU1ZHLkRlZnMgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICdkZWZzJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuQ29udGFpbmVyXHJcblxyXG59KVxuU1ZHLkcgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICdnJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuQ29udGFpbmVyXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBNb3ZlIG92ZXIgeC1heGlzXHJcbiAgICB4OiBmdW5jdGlvbih4KSB7XHJcbiAgICAgIHJldHVybiB4ID09IG51bGwgPyB0aGlzLnRyYW5zZm9ybSgneCcpIDogdGhpcy50cmFuc2Zvcm0oeyB4OiB4IC0gdGhpcy54KCkgfSwgdHJ1ZSlcclxuICAgIH1cclxuICAgIC8vIE1vdmUgb3ZlciB5LWF4aXNcclxuICAsIHk6IGZ1bmN0aW9uKHkpIHtcclxuICAgICAgcmV0dXJuIHkgPT0gbnVsbCA/IHRoaXMudHJhbnNmb3JtKCd5JykgOiB0aGlzLnRyYW5zZm9ybSh7IHk6IHkgLSB0aGlzLnkoKSB9LCB0cnVlKVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBieSBjZW50ZXIgb3ZlciB4LWF4aXNcclxuICAsIGN4OiBmdW5jdGlvbih4KSB7XHJcbiAgICAgIHJldHVybiB4ID09IG51bGwgPyB0aGlzLmdib3goKS5jeCA6IHRoaXMueCh4IC0gdGhpcy5nYm94KCkud2lkdGggLyAyKVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBieSBjZW50ZXIgb3ZlciB5LWF4aXNcclxuICAsIGN5OiBmdW5jdGlvbih5KSB7XHJcbiAgICAgIHJldHVybiB5ID09IG51bGwgPyB0aGlzLmdib3goKS5jeSA6IHRoaXMueSh5IC0gdGhpcy5nYm94KCkuaGVpZ2h0IC8gMilcclxuICAgIH1cclxuICAsIGdib3g6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgdmFyIGJib3ggID0gdGhpcy5iYm94KClcclxuICAgICAgICAsIHRyYW5zID0gdGhpcy50cmFuc2Zvcm0oKVxyXG5cclxuICAgICAgYmJveC54ICArPSB0cmFucy54XHJcbiAgICAgIGJib3gueDIgKz0gdHJhbnMueFxyXG4gICAgICBiYm94LmN4ICs9IHRyYW5zLnhcclxuXHJcbiAgICAgIGJib3gueSAgKz0gdHJhbnMueVxyXG4gICAgICBiYm94LnkyICs9IHRyYW5zLnlcclxuICAgICAgYmJveC5jeSArPSB0cmFucy55XHJcblxyXG4gICAgICByZXR1cm4gYmJveFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBhIGdyb3VwIGVsZW1lbnRcclxuICAgIGdyb3VwOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTVkcuRylcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxuLy8gIyMjIFRoaXMgbW9kdWxlIGFkZHMgYmFja3dhcmQgLyBmb3J3YXJkIGZ1bmN0aW9uYWxpdHkgdG8gZWxlbWVudHMuXHJcblxyXG4vL1xyXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgLy8gR2V0IGFsbCBzaWJsaW5ncywgaW5jbHVkaW5nIG15c2VsZlxyXG4gIHNpYmxpbmdzOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnBhcmVudCgpLmNoaWxkcmVuKClcclxuICB9XHJcbiAgLy8gR2V0IHRoZSBjdXJlbnQgcG9zaXRpb24gc2libGluZ3NcclxuLCBwb3NpdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQoKS5pbmRleCh0aGlzKVxyXG4gIH1cclxuICAvLyBHZXQgdGhlIG5leHQgZWxlbWVudCAod2lsbCByZXR1cm4gbnVsbCBpZiB0aGVyZSBpcyBub25lKVxyXG4sIG5leHQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2libGluZ3MoKVt0aGlzLnBvc2l0aW9uKCkgKyAxXVxyXG4gIH1cclxuICAvLyBHZXQgdGhlIG5leHQgZWxlbWVudCAod2lsbCByZXR1cm4gbnVsbCBpZiB0aGVyZSBpcyBub25lKVxyXG4sIHByZXZpb3VzOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnNpYmxpbmdzKClbdGhpcy5wb3NpdGlvbigpIC0gMV1cclxuICB9XHJcbiAgLy8gU2VuZCBnaXZlbiBlbGVtZW50IG9uZSBzdGVwIGZvcndhcmRcclxuLCBmb3J3YXJkOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBpID0gdGhpcy5wb3NpdGlvbigpICsgMVxyXG4gICAgICAsIHAgPSB0aGlzLnBhcmVudCgpXHJcblxyXG4gICAgLy8gbW92ZSBub2RlIG9uZSBzdGVwIGZvcndhcmRcclxuICAgIHAucmVtb3ZlRWxlbWVudCh0aGlzKS5hZGQodGhpcywgaSlcclxuXHJcbiAgICAvLyBtYWtlIHN1cmUgZGVmcyBub2RlIGlzIGFsd2F5cyBhdCB0aGUgdG9wXHJcbiAgICBpZiAocCBpbnN0YW5jZW9mIFNWRy5Eb2MpXHJcbiAgICAgIHAubm9kZS5hcHBlbmRDaGlsZChwLmRlZnMoKS5ub2RlKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIC8vIFNlbmQgZ2l2ZW4gZWxlbWVudCBvbmUgc3RlcCBiYWNrd2FyZFxyXG4sIGJhY2t3YXJkOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBpID0gdGhpcy5wb3NpdGlvbigpXHJcblxyXG4gICAgaWYgKGkgPiAwKVxyXG4gICAgICB0aGlzLnBhcmVudCgpLnJlbW92ZUVsZW1lbnQodGhpcykuYWRkKHRoaXMsIGkgLSAxKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIC8vIFNlbmQgZ2l2ZW4gZWxlbWVudCBhbGwgdGhlIHdheSB0byB0aGUgZnJvbnRcclxuLCBmcm9udDogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcCA9IHRoaXMucGFyZW50KClcclxuXHJcbiAgICAvLyBNb3ZlIG5vZGUgZm9yd2FyZFxyXG4gICAgcC5ub2RlLmFwcGVuZENoaWxkKHRoaXMubm9kZSlcclxuXHJcbiAgICAvLyBNYWtlIHN1cmUgZGVmcyBub2RlIGlzIGFsd2F5cyBhdCB0aGUgdG9wXHJcbiAgICBpZiAocCBpbnN0YW5jZW9mIFNWRy5Eb2MpXHJcbiAgICAgIHAubm9kZS5hcHBlbmRDaGlsZChwLmRlZnMoKS5ub2RlKVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIC8vIFNlbmQgZ2l2ZW4gZWxlbWVudCBhbGwgdGhlIHdheSB0byB0aGUgYmFja1xyXG4sIGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMucG9zaXRpb24oKSA+IDApXHJcbiAgICAgIHRoaXMucGFyZW50KCkucmVtb3ZlRWxlbWVudCh0aGlzKS5hZGQodGhpcywgMClcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBJbnNlcnRzIGEgZ2l2ZW4gZWxlbWVudCBiZWZvcmUgdGhlIHRhcmdldGVkIGVsZW1lbnRcclxuLCBiZWZvcmU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgIGVsZW1lbnQucmVtb3ZlKClcclxuXHJcbiAgICB2YXIgaSA9IHRoaXMucG9zaXRpb24oKVxyXG5cclxuICAgIHRoaXMucGFyZW50KCkuYWRkKGVsZW1lbnQsIGkpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gSW5zdGVycyBhIGdpdmVuIGVsZW1lbnQgYWZ0ZXIgdGhlIHRhcmdldGVkIGVsZW1lbnRcclxuLCBhZnRlcjogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgZWxlbWVudC5yZW1vdmUoKVxyXG5cclxuICAgIHZhciBpID0gdGhpcy5wb3NpdGlvbigpXHJcblxyXG4gICAgdGhpcy5wYXJlbnQoKS5hZGQoZWxlbWVudCwgaSArIDEpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG59KVxuU1ZHLk1hc2sgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIFNWRy5jcmVhdGUoJ21hc2snKSlcclxuXHJcbiAgICAvLyBrZWVwIHJlZmVyZW5jZXMgdG8gbWFza2VkIGVsZW1lbnRzXHJcbiAgICB0aGlzLnRhcmdldHMgPSBbXVxyXG4gIH1cclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLkNvbnRhaW5lclxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gVW5tYXNrIGFsbCBtYXNrZWQgZWxlbWVudHMgYW5kIHJlbW92ZSBpdHNlbGZcclxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vIHVubWFzayBhbGwgdGFyZ2V0c1xyXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50YXJnZXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxyXG4gICAgICAgIGlmICh0aGlzLnRhcmdldHNbaV0pXHJcbiAgICAgICAgICB0aGlzLnRhcmdldHNbaV0udW5tYXNrKClcclxuICAgICAgdGhpcy50YXJnZXRzID0gW11cclxuXHJcbiAgICAgIC8vIHJlbW92ZSBtYXNrIGZyb20gcGFyZW50XHJcbiAgICAgIHRoaXMucGFyZW50KCkucmVtb3ZlRWxlbWVudCh0aGlzKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEFkZCBwYXJlbnQgbWV0aG9kXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBDcmVhdGUgbWFza2luZyBlbGVtZW50XHJcbiAgICBtYXNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZGVmcygpLnB1dChuZXcgU1ZHLk1hc2spXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuXHJcblNWRy5leHRlbmQoU1ZHLkVsZW1lbnQsIHtcclxuICAvLyBEaXN0cmlidXRlIG1hc2sgdG8gc3ZnIGVsZW1lbnRcclxuICBtYXNrV2l0aDogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgLy8gdXNlIGdpdmVuIG1hc2sgb3IgY3JlYXRlIGEgbmV3IG9uZVxyXG4gICAgdGhpcy5tYXNrZXIgPSBlbGVtZW50IGluc3RhbmNlb2YgU1ZHLk1hc2sgPyBlbGVtZW50IDogdGhpcy5wYXJlbnQoKS5tYXNrKCkuYWRkKGVsZW1lbnQpXHJcblxyXG4gICAgLy8gc3RvcmUgcmV2ZXJlbmNlIG9uIHNlbGYgaW4gbWFza1xyXG4gICAgdGhpcy5tYXNrZXIudGFyZ2V0cy5wdXNoKHRoaXMpXHJcblxyXG4gICAgLy8gYXBwbHkgbWFza1xyXG4gICAgcmV0dXJuIHRoaXMuYXR0cignbWFzaycsICd1cmwoXCIjJyArIHRoaXMubWFza2VyLmF0dHIoJ2lkJykgKyAnXCIpJylcclxuICB9XHJcbiAgLy8gVW5tYXNrIGVsZW1lbnRcclxuLCB1bm1hc2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgZGVsZXRlIHRoaXMubWFza2VyXHJcbiAgICByZXR1cm4gdGhpcy5hdHRyKCdtYXNrJywgbnVsbClcclxuICB9XHJcblxyXG59KVxyXG5cblNWRy5DbGlwUGF0aCA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemUgbm9kZVxyXG4gIGNyZWF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgU1ZHLmNyZWF0ZSgnY2xpcFBhdGgnKSlcclxuXHJcbiAgICAvLyBrZWVwIHJlZmVyZW5jZXMgdG8gY2xpcHBlZCBlbGVtZW50c1xyXG4gICAgdGhpcy50YXJnZXRzID0gW11cclxuICB9XHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5Db250YWluZXJcclxuXHJcbiAgLy8gQWRkIGNsYXNzIG1ldGhvZHNcclxuLCBleHRlbmQ6IHtcclxuICAgIC8vIFVuY2xpcCBhbGwgY2xpcHBlZCBlbGVtZW50cyBhbmQgcmVtb3ZlIGl0c2VsZlxyXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcclxuICAgICAgLy8gdW5jbGlwIGFsbCB0YXJnZXRzXHJcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRhcmdldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0c1tpXSlcclxuICAgICAgICAgIHRoaXMudGFyZ2V0c1tpXS51bmNsaXAoKVxyXG4gICAgICB0aGlzLnRhcmdldHMgPSBbXVxyXG5cclxuICAgICAgLy8gcmVtb3ZlIGNsaXBQYXRoIGZyb20gcGFyZW50XHJcbiAgICAgIHRoaXMucGFyZW50KCkucmVtb3ZlRWxlbWVudCh0aGlzKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEFkZCBwYXJlbnQgbWV0aG9kXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBDcmVhdGUgY2xpcHBpbmcgZWxlbWVudFxyXG4gICAgY2xpcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmRlZnMoKS5wdXQobmV3IFNWRy5DbGlwUGF0aClcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG4vL1xyXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgLy8gRGlzdHJpYnV0ZSBjbGlwUGF0aCB0byBzdmcgZWxlbWVudFxyXG4gIGNsaXBXaXRoOiBmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAvLyB1c2UgZ2l2ZW4gY2xpcCBvciBjcmVhdGUgYSBuZXcgb25lXHJcbiAgICB0aGlzLmNsaXBwZXIgPSBlbGVtZW50IGluc3RhbmNlb2YgU1ZHLkNsaXBQYXRoID8gZWxlbWVudCA6IHRoaXMucGFyZW50KCkuY2xpcCgpLmFkZChlbGVtZW50KVxyXG5cclxuICAgIC8vIHN0b3JlIHJldmVyZW5jZSBvbiBzZWxmIGluIG1hc2tcclxuICAgIHRoaXMuY2xpcHBlci50YXJnZXRzLnB1c2godGhpcylcclxuXHJcbiAgICAvLyBhcHBseSBtYXNrXHJcbiAgICByZXR1cm4gdGhpcy5hdHRyKCdjbGlwLXBhdGgnLCAndXJsKFwiIycgKyB0aGlzLmNsaXBwZXIuYXR0cignaWQnKSArICdcIiknKVxyXG4gIH1cclxuICAvLyBVbmNsaXAgZWxlbWVudFxyXG4sIHVuY2xpcDogZnVuY3Rpb24oKSB7XHJcbiAgICBkZWxldGUgdGhpcy5jbGlwcGVyXHJcbiAgICByZXR1cm4gdGhpcy5hdHRyKCdjbGlwLXBhdGgnLCBudWxsKVxyXG4gIH1cclxuXHJcbn0pXG5TVkcuR3JhZGllbnQgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBTVkcuY3JlYXRlKHR5cGUgKyAnR3JhZGllbnQnKSlcclxuXHJcbiAgICAvLyBzdG9yZSB0eXBlXHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlXHJcbiAgfVxyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuQ29udGFpbmVyXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBBZGQgYSBjb2xvciBzdG9wXHJcbiAgICBhdDogZnVuY3Rpb24ob2Zmc2V0LCBjb2xvciwgb3BhY2l0eSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5TdG9wKS51cGRhdGUob2Zmc2V0LCBjb2xvciwgb3BhY2l0eSlcclxuICAgIH1cclxuICAgIC8vIFVwZGF0ZSBncmFkaWVudFxyXG4gICwgdXBkYXRlOiBmdW5jdGlvbihibG9jaykge1xyXG4gICAgICAvLyByZW1vdmUgYWxsIHN0b3BzXHJcbiAgICAgIHRoaXMuY2xlYXIoKVxyXG5cclxuICAgICAgLy8gaW52b2tlIHBhc3NlZCBibG9ja1xyXG4gICAgICBpZiAodHlwZW9mIGJsb2NrID09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgYmxvY2suY2FsbCh0aGlzLCB0aGlzKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIFJldHVybiB0aGUgZmlsbCBpZFxyXG4gICwgZmlsbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiAndXJsKCMnICsgdGhpcy5pZCgpICsgJyknXHJcbiAgICB9XHJcbiAgICAvLyBBbGlhcyBzdHJpbmcgY29udmVydGlvbiB0byBmaWxsXHJcbiAgLCB0b1N0cmluZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZpbGwoKVxyXG4gICAgfVxyXG4gICAgLy8gY3VzdG9tIGF0dHIgdG8gaGFuZGxlIHRyYW5zZm9ybVxyXG4gICwgYXR0cjogZnVuY3Rpb24oYSwgYiwgYykge1xyXG4gICAgICBpZihhID09ICd0cmFuc2Zvcm0nKSBhID0gJ2dyYWRpZW50VHJhbnNmb3JtJ1xyXG4gICAgICByZXR1cm4gU1ZHLkNvbnRhaW5lci5wcm90b3R5cGUuYXR0ci5jYWxsKHRoaXMsIGEsIGIsIGMpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gQ3JlYXRlIGdyYWRpZW50IGVsZW1lbnQgaW4gZGVmc1xyXG4gICAgZ3JhZGllbnQ6IGZ1bmN0aW9uKHR5cGUsIGJsb2NrKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmRlZnMoKS5ncmFkaWVudCh0eXBlLCBibG9jaylcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG4vLyBBZGQgYW5pbWF0YWJsZSBtZXRob2RzIHRvIGJvdGggZ3JhZGllbnQgYW5kIGZ4IG1vZHVsZVxyXG5TVkcuZXh0ZW5kKFNWRy5HcmFkaWVudCwgU1ZHLkZYLCB7XHJcbiAgLy8gRnJvbSBwb3NpdGlvblxyXG4gIGZyb206IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgIHJldHVybiAodGhpcy5fdGFyZ2V0IHx8IHRoaXMpLnR5cGUgPT0gJ3JhZGlhbCcgP1xyXG4gICAgICB0aGlzLmF0dHIoeyBmeDogbmV3IFNWRy5OdW1iZXIoeCksIGZ5OiBuZXcgU1ZHLk51bWJlcih5KSB9KSA6XHJcbiAgICAgIHRoaXMuYXR0cih7IHgxOiBuZXcgU1ZHLk51bWJlcih4KSwgeTE6IG5ldyBTVkcuTnVtYmVyKHkpIH0pXHJcbiAgfVxyXG4gIC8vIFRvIHBvc2l0aW9uXHJcbiwgdG86IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgIHJldHVybiAodGhpcy5fdGFyZ2V0IHx8IHRoaXMpLnR5cGUgPT0gJ3JhZGlhbCcgP1xyXG4gICAgICB0aGlzLmF0dHIoeyBjeDogbmV3IFNWRy5OdW1iZXIoeCksIGN5OiBuZXcgU1ZHLk51bWJlcih5KSB9KSA6XHJcbiAgICAgIHRoaXMuYXR0cih7IHgyOiBuZXcgU1ZHLk51bWJlcih4KSwgeTI6IG5ldyBTVkcuTnVtYmVyKHkpIH0pXHJcbiAgfVxyXG59KVxyXG5cclxuLy8gQmFzZSBncmFkaWVudCBnZW5lcmF0aW9uXHJcblNWRy5leHRlbmQoU1ZHLkRlZnMsIHtcclxuICAvLyBkZWZpbmUgZ3JhZGllbnRcclxuICBncmFkaWVudDogZnVuY3Rpb24odHlwZSwgYmxvY2spIHtcclxuICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLkdyYWRpZW50KHR5cGUpKS51cGRhdGUoYmxvY2spXHJcbiAgfVxyXG5cclxufSlcclxuXHJcblNWRy5TdG9wID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAnc3RvcCdcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLkVsZW1lbnRcclxuXHJcbiAgLy8gQWRkIGNsYXNzIG1ldGhvZHNcclxuLCBleHRlbmQ6IHtcclxuICAgIC8vIGFkZCBjb2xvciBzdG9wc1xyXG4gICAgdXBkYXRlOiBmdW5jdGlvbihvKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgbyA9PSAnbnVtYmVyJyB8fCBvIGluc3RhbmNlb2YgU1ZHLk51bWJlcikge1xyXG4gICAgICAgIG8gPSB7XHJcbiAgICAgICAgICBvZmZzZXQ6ICBhcmd1bWVudHNbMF1cclxuICAgICAgICAsIGNvbG9yOiAgIGFyZ3VtZW50c1sxXVxyXG4gICAgICAgICwgb3BhY2l0eTogYXJndW1lbnRzWzJdXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBzZXQgYXR0cmlidXRlc1xyXG4gICAgICBpZiAoby5vcGFjaXR5ICE9IG51bGwpIHRoaXMuYXR0cignc3RvcC1vcGFjaXR5Jywgby5vcGFjaXR5KVxyXG4gICAgICBpZiAoby5jb2xvciAgICE9IG51bGwpIHRoaXMuYXR0cignc3RvcC1jb2xvcicsIG8uY29sb3IpXHJcbiAgICAgIGlmIChvLm9mZnNldCAgIT0gbnVsbCkgdGhpcy5hdHRyKCdvZmZzZXQnLCBuZXcgU1ZHLk51bWJlcihvLm9mZnNldCkpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0pXHJcblxuU1ZHLlBhdHRlcm4gPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICdwYXR0ZXJuJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuQ29udGFpbmVyXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBSZXR1cm4gdGhlIGZpbGwgaWRcclxuICAgIGZpbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gJ3VybCgjJyArIHRoaXMuaWQoKSArICcpJ1xyXG4gICAgfVxyXG4gICAgLy8gVXBkYXRlIHBhdHRlcm4gYnkgcmVidWlsZGluZ1xyXG4gICwgdXBkYXRlOiBmdW5jdGlvbihibG9jaykge1xyXG4gICAgICAvLyByZW1vdmUgY29udGVudFxyXG4gICAgICB0aGlzLmNsZWFyKClcclxuXHJcbiAgICAgIC8vIGludm9rZSBwYXNzZWQgYmxvY2tcclxuICAgICAgaWYgKHR5cGVvZiBibG9jayA9PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgIGJsb2NrLmNhbGwodGhpcywgdGhpcylcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBBbGlhcyBzdHJpbmcgY29udmVydGlvbiB0byBmaWxsXHJcbiAgLCB0b1N0cmluZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZpbGwoKVxyXG4gICAgfVxyXG4gICAgLy8gY3VzdG9tIGF0dHIgdG8gaGFuZGxlIHRyYW5zZm9ybVxyXG4gICwgYXR0cjogZnVuY3Rpb24oYSwgYiwgYykge1xyXG4gICAgICBpZihhID09ICd0cmFuc2Zvcm0nKSBhID0gJ3BhdHRlcm5UcmFuc2Zvcm0nXHJcbiAgICAgIHJldHVybiBTVkcuQ29udGFpbmVyLnByb3RvdHlwZS5hdHRyLmNhbGwodGhpcywgYSwgYiwgYylcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gQ3JlYXRlIHBhdHRlcm4gZWxlbWVudCBpbiBkZWZzXHJcbiAgICBwYXR0ZXJuOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBibG9jaykge1xyXG4gICAgICByZXR1cm4gdGhpcy5kZWZzKCkucGF0dGVybih3aWR0aCwgaGVpZ2h0LCBibG9jaylcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5EZWZzLCB7XHJcbiAgLy8gRGVmaW5lIGdyYWRpZW50XHJcbiAgcGF0dGVybjogZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgYmxvY2spIHtcclxuICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLlBhdHRlcm4pLnVwZGF0ZShibG9jaykuYXR0cih7XHJcbiAgICAgIHg6ICAgICAgICAgICAgMFxyXG4gICAgLCB5OiAgICAgICAgICAgIDBcclxuICAgICwgd2lkdGg6ICAgICAgICB3aWR0aFxyXG4gICAgLCBoZWlnaHQ6ICAgICAgIGhlaWdodFxyXG4gICAgLCBwYXR0ZXJuVW5pdHM6ICd1c2VyU3BhY2VPblVzZSdcclxuICAgIH0pXHJcbiAgfVxyXG5cclxufSlcblNWRy5Eb2MgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIC8vIGVuc3VyZSB0aGUgcHJlc2VuY2Ugb2YgYSBkb20gZWxlbWVudFxyXG4gICAgICBlbGVtZW50ID0gdHlwZW9mIGVsZW1lbnQgPT0gJ3N0cmluZycgP1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpIDpcclxuICAgICAgICBlbGVtZW50XHJcblxyXG4gICAgICAvLyBJZiB0aGUgdGFyZ2V0IGlzIGFuIHN2ZyBlbGVtZW50LCB1c2UgdGhhdCBlbGVtZW50IGFzIHRoZSBtYWluIHdyYXBwZXIuXHJcbiAgICAgIC8vIFRoaXMgYWxsb3dzIHN2Zy5qcyB0byB3b3JrIHdpdGggc3ZnIGRvY3VtZW50cyBhcyB3ZWxsLlxyXG4gICAgICBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PSAnc3ZnJykge1xyXG4gICAgICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBlbGVtZW50KVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBTVkcuY3JlYXRlKCdzdmcnKSlcclxuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubm9kZSlcclxuICAgICAgICB0aGlzLnNpemUoJzEwMCUnLCAnMTAwJScpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHNldCBzdmcgZWxlbWVudCBhdHRyaWJ1dGVzIGFuZCBlbnN1cmUgZGVmcyBub2RlXHJcbiAgICAgIHRoaXMubmFtZXNwYWNlKCkuZGVmcygpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuQ29udGFpbmVyXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBBZGQgbmFtZXNwYWNlc1xyXG4gICAgbmFtZXNwYWNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICAuYXR0cih7IHhtbG5zOiBTVkcubnMsIHZlcnNpb246ICcxLjEnIH0pXHJcbiAgICAgICAgLmF0dHIoJ3htbG5zOnhsaW5rJywgU1ZHLnhsaW5rLCBTVkcueG1sbnMpXHJcbiAgICAgICAgLmF0dHIoJ3htbG5zOnN2Z2pzJywgU1ZHLnN2Z2pzLCBTVkcueG1sbnMpXHJcbiAgICB9XHJcbiAgICAvLyBDcmVhdGVzIGFuZCByZXR1cm5zIGRlZnMgZWxlbWVudFxyXG4gICwgZGVmczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICghdGhpcy5fZGVmcykge1xyXG4gICAgICAgIHZhciBkZWZzXHJcblxyXG4gICAgICAgIC8vIEZpbmQgb3IgY3JlYXRlIGEgZGVmcyBlbGVtZW50IGluIHRoaXMgaW5zdGFuY2VcclxuICAgICAgICBpZiAoZGVmcyA9IHRoaXMubm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGVmcycpWzBdKVxyXG4gICAgICAgICAgdGhpcy5fZGVmcyA9IFNWRy5hZG9wdChkZWZzKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHRoaXMuX2RlZnMgPSBuZXcgU1ZHLkRlZnNcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBkZWZzIG5vZGUgaXMgYXQgdGhlIGVuZCBvZiB0aGUgc3RhY2tcclxuICAgICAgICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQodGhpcy5fZGVmcy5ub2RlKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5fZGVmc1xyXG4gICAgfVxyXG4gICAgLy8gY3VzdG9tIHBhcmVudCBtZXRob2RcclxuICAsIHBhcmVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm5vZGUucGFyZW50Tm9kZS5ub2RlTmFtZSA9PSAnI2RvY3VtZW50JyA/IG51bGwgOiB0aGlzLm5vZGUucGFyZW50Tm9kZVxyXG4gICAgfVxyXG4gICAgLy8gRml4IGZvciBwb3NzaWJsZSBzdWItcGl4ZWwgb2Zmc2V0LiBTZWU6XHJcbiAgICAvLyBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02MDg4MTJcclxuICAsIHNwb2Y6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgcG9zID0gdGhpcy5ub2RlLmdldFNjcmVlbkNUTSgpXHJcblxyXG4gICAgICBpZiAocG9zKVxyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgIC5zdHlsZSgnbGVmdCcsICgtcG9zLmUgJSAxKSArICdweCcpXHJcbiAgICAgICAgICAuc3R5bGUoJ3RvcCcsICAoLXBvcy5mICUgMSkgKyAncHgnKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAgIC8vIFJlbW92ZXMgdGhlIGRvYyBmcm9tIHRoZSBET01cclxuICAsIHJlbW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmKHRoaXMucGFyZW50KCkpIHtcclxuICAgICAgICB0aGlzLnBhcmVudCgpLnJlbW92ZUNoaWxkKHRoaXMubm9kZSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAsIGNsZWFyOiBmdW5jdGlvbigpIHtcclxuICAgICAgLy8gcmVtb3ZlIGNoaWxkcmVuXHJcbiAgICAgIHdoaWxlKHRoaXMubm9kZS5oYXNDaGlsZE5vZGVzKCkpXHJcbiAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUNoaWxkKHRoaXMubm9kZS5sYXN0Q2hpbGQpXHJcblxyXG4gICAgICAvLyByZW1vdmUgZGVmcyByZWZlcmVuY2VcclxuICAgICAgZGVsZXRlIHRoaXMuX2RlZnNcclxuXHJcbiAgICAgIC8vIGFkZCBiYWNrIHBhcnNlclxyXG4gICAgICBpZighU1ZHLnBhcnNlci5kcmF3LnBhcmVudE5vZGUpXHJcbiAgICAgICAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKFNWRy5wYXJzZXIuZHJhdylcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSlcclxuXG5TVkcuU2hhcGUgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBlbGVtZW50KVxyXG4gIH1cclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLkVsZW1lbnRcclxuXHJcbn0pXG5cclxuU1ZHLkJhcmUgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihlbGVtZW50LCBpbmhlcml0KSB7XHJcbiAgICAvLyBjb25zdHJ1Y3QgZWxlbWVudFxyXG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIFNWRy5jcmVhdGUoZWxlbWVudCkpXHJcblxyXG4gICAgLy8gaW5oZXJpdCBjdXN0b20gbWV0aG9kc1xyXG4gICAgaWYgKGluaGVyaXQpXHJcbiAgICAgIGZvciAodmFyIG1ldGhvZCBpbiBpbmhlcml0LnByb3RvdHlwZSlcclxuICAgICAgICBpZiAodHlwZW9mIGluaGVyaXQucHJvdG90eXBlW21ldGhvZF0gPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICB0aGlzW21ldGhvZF0gPSBpbmhlcml0LnByb3RvdHlwZVttZXRob2RdXHJcbiAgfVxyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuRWxlbWVudFxyXG5cclxuICAvLyBBZGQgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gSW5zZXJ0IHNvbWUgcGxhaW4gdGV4dFxyXG4gICAgd29yZHM6IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgLy8gcmVtb3ZlIGNvbnRlbnRzXHJcbiAgICAgIHdoaWxlICh0aGlzLm5vZGUuaGFzQ2hpbGROb2RlcygpKVxyXG4gICAgICAgIHRoaXMubm9kZS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUubGFzdENoaWxkKVxyXG5cclxuICAgICAgLy8gY3JlYXRlIHRleHQgbm9kZVxyXG4gICAgICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5QYXJlbnQsIHtcclxuICAvLyBDcmVhdGUgYW4gZWxlbWVudCB0aGF0IGlzIG5vdCBkZXNjcmliZWQgYnkgU1ZHLmpzXHJcbiAgZWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCwgaW5oZXJpdCkge1xyXG4gICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTVkcuQmFyZShlbGVtZW50LCBpbmhlcml0KSlcclxuICB9XHJcbn0pXHJcblxuU1ZHLlN5bWJvbCA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemUgbm9kZVxyXG4gIGNyZWF0ZTogJ3N5bWJvbCdcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLkNvbnRhaW5lclxyXG5cclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIGNyZWF0ZSBzeW1ib2xcclxuICAgIHN5bWJvbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLlN5bWJvbClcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxuU1ZHLlVzZSA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemUgbm9kZVxyXG4gIGNyZWF0ZTogJ3VzZSdcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLlNoYXBlXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBVc2UgZWxlbWVudCBhcyBhIHJlZmVyZW5jZVxyXG4gICAgZWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCwgZmlsZSkge1xyXG4gICAgICAvLyBTZXQgbGluZWQgZWxlbWVudFxyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdocmVmJywgKGZpbGUgfHwgJycpICsgJyMnICsgZWxlbWVudCwgU1ZHLnhsaW5rKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBhIHVzZSBlbGVtZW50XHJcbiAgICB1c2U6IGZ1bmN0aW9uKGVsZW1lbnQsIGZpbGUpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTVkcuVXNlKS5lbGVtZW50KGVsZW1lbnQsIGZpbGUpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxuU1ZHLlJlY3QgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICdyZWN0J1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuU2hhcGVcclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBhIHJlY3QgZWxlbWVudFxyXG4gICAgcmVjdDogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5SZWN0KCkpLnNpemUod2lkdGgsIGhlaWdodClcclxuICAgIH1cclxuICB9XHJcbn0pXG5TVkcuQ2lyY2xlID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAnY2lyY2xlJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuU2hhcGVcclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBjaXJjbGUgZWxlbWVudCwgYmFzZWQgb24gZWxsaXBzZVxyXG4gICAgY2lyY2xlOiBmdW5jdGlvbihzaXplKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLkNpcmNsZSkucngobmV3IFNWRy5OdW1iZXIoc2l6ZSkuZGl2aWRlKDIpKS5tb3ZlKDAsIDApXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuQ2lyY2xlLCBTVkcuRlgsIHtcclxuICAvLyBSYWRpdXMgeCB2YWx1ZVxyXG4gIHJ4OiBmdW5jdGlvbihyeCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXR0cigncicsIHJ4KVxyXG4gIH1cclxuICAvLyBBbGlhcyByYWRpdXMgeCB2YWx1ZVxyXG4sIHJ5OiBmdW5jdGlvbihyeSkge1xyXG4gICAgcmV0dXJuIHRoaXMucngocnkpXHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLkVsbGlwc2UgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICdlbGxpcHNlJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuU2hhcGVcclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBhbiBlbGxpcHNlXHJcbiAgICBlbGxpcHNlOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLkVsbGlwc2UpLnNpemUod2lkdGgsIGhlaWdodCkubW92ZSgwLCAwKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcblNWRy5leHRlbmQoU1ZHLkVsbGlwc2UsIFNWRy5SZWN0LCBTVkcuRlgsIHtcclxuICAvLyBSYWRpdXMgeCB2YWx1ZVxyXG4gIHJ4OiBmdW5jdGlvbihyeCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXR0cigncngnLCByeClcclxuICB9XHJcbiAgLy8gUmFkaXVzIHkgdmFsdWVcclxuLCByeTogZnVuY3Rpb24ocnkpIHtcclxuICAgIHJldHVybiB0aGlzLmF0dHIoJ3J5JywgcnkpXHJcbiAgfVxyXG59KVxyXG5cclxuLy8gQWRkIGNvbW1vbiBtZXRob2RcclxuU1ZHLmV4dGVuZChTVkcuQ2lyY2xlLCBTVkcuRWxsaXBzZSwge1xyXG4gICAgLy8gTW92ZSBvdmVyIHgtYXhpc1xyXG4gICAgeDogZnVuY3Rpb24oeCkge1xyXG4gICAgICByZXR1cm4geCA9PSBudWxsID8gdGhpcy5jeCgpIC0gdGhpcy5yeCgpIDogdGhpcy5jeCh4ICsgdGhpcy5yeCgpKVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBvdmVyIHktYXhpc1xyXG4gICwgeTogZnVuY3Rpb24oeSkge1xyXG4gICAgICByZXR1cm4geSA9PSBudWxsID8gdGhpcy5jeSgpIC0gdGhpcy5yeSgpIDogdGhpcy5jeSh5ICsgdGhpcy5yeSgpKVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBieSBjZW50ZXIgb3ZlciB4LWF4aXNcclxuICAsIGN4OiBmdW5jdGlvbih4KSB7XHJcbiAgICAgIHJldHVybiB4ID09IG51bGwgPyB0aGlzLmF0dHIoJ2N4JykgOiB0aGlzLmF0dHIoJ2N4JywgeClcclxuICAgIH1cclxuICAgIC8vIE1vdmUgYnkgY2VudGVyIG92ZXIgeS1heGlzXHJcbiAgLCBjeTogZnVuY3Rpb24oeSkge1xyXG4gICAgICByZXR1cm4geSA9PSBudWxsID8gdGhpcy5hdHRyKCdjeScpIDogdGhpcy5hdHRyKCdjeScsIHkpXHJcbiAgICB9XHJcbiAgICAvLyBTZXQgd2lkdGggb2YgZWxlbWVudFxyXG4gICwgd2lkdGg6IGZ1bmN0aW9uKHdpZHRoKSB7XHJcbiAgICAgIHJldHVybiB3aWR0aCA9PSBudWxsID8gdGhpcy5yeCgpICogMiA6IHRoaXMucngobmV3IFNWRy5OdW1iZXIod2lkdGgpLmRpdmlkZSgyKSlcclxuICAgIH1cclxuICAgIC8vIFNldCBoZWlnaHQgb2YgZWxlbWVudFxyXG4gICwgaGVpZ2h0OiBmdW5jdGlvbihoZWlnaHQpIHtcclxuICAgICAgcmV0dXJuIGhlaWdodCA9PSBudWxsID8gdGhpcy5yeSgpICogMiA6IHRoaXMucnkobmV3IFNWRy5OdW1iZXIoaGVpZ2h0KS5kaXZpZGUoMikpXHJcbiAgICB9XHJcbiAgICAvLyBDdXN0b20gc2l6ZSBmdW5jdGlvblxyXG4gICwgc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG4gICAgICB2YXIgcCA9IHByb3BvcnRpb25hbFNpemUodGhpcywgd2lkdGgsIGhlaWdodClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgLnJ4KG5ldyBTVkcuTnVtYmVyKHAud2lkdGgpLmRpdmlkZSgyKSlcclxuICAgICAgICAucnkobmV3IFNWRy5OdW1iZXIocC5oZWlnaHQpLmRpdmlkZSgyKSlcclxuICAgIH1cclxufSlcblNWRy5MaW5lID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAnbGluZSdcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLlNoYXBlXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBHZXQgYXJyYXlcclxuICAgIGFycmF5OiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIG5ldyBTVkcuUG9pbnRBcnJheShbXHJcbiAgICAgICAgWyB0aGlzLmF0dHIoJ3gxJyksIHRoaXMuYXR0cigneTEnKSBdXHJcbiAgICAgICwgWyB0aGlzLmF0dHIoJ3gyJyksIHRoaXMuYXR0cigneTInKSBdXHJcbiAgICAgIF0pXHJcbiAgICB9XHJcbiAgICAvLyBPdmVyd3JpdGUgbmF0aXZlIHBsb3QoKSBtZXRob2RcclxuICAsIHBsb3Q6IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyKSB7XHJcbiAgICAgIGlmICh4MSA9PSBudWxsKVxyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5KClcclxuICAgICAgZWxzZSBpZiAodHlwZW9mIHkxICE9PSAndW5kZWZpbmVkJylcclxuICAgICAgICB4MSA9IHsgeDE6IHgxLCB5MTogeTEsIHgyOiB4MiwgeTI6IHkyIH1cclxuICAgICAgZWxzZVxyXG4gICAgICAgIHgxID0gbmV3IFNWRy5Qb2ludEFycmF5KHgxKS50b0xpbmUoKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cih4MSlcclxuICAgIH1cclxuICAgIC8vIE1vdmUgYnkgbGVmdCB0b3AgY29ybmVyXHJcbiAgLCBtb3ZlOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIodGhpcy5hcnJheSgpLm1vdmUoeCwgeSkudG9MaW5lKCkpXHJcbiAgICB9XHJcbiAgICAvLyBTZXQgZWxlbWVudCBzaXplIHRvIGdpdmVuIHdpZHRoIGFuZCBoZWlnaHRcclxuICAsIHNpemU6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgdmFyIHAgPSBwcm9wb3J0aW9uYWxTaXplKHRoaXMsIHdpZHRoLCBoZWlnaHQpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKHRoaXMuYXJyYXkoKS5zaXplKHAud2lkdGgsIHAuaGVpZ2h0KS50b0xpbmUoKSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEFkZCBwYXJlbnQgbWV0aG9kXHJcbiwgY29uc3RydWN0OiB7XHJcbiAgICAvLyBDcmVhdGUgYSBsaW5lIGVsZW1lbnRcclxuICAgIGxpbmU6IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyKSB7XHJcbiAgICAgIC8vIG1ha2Ugc3VyZSBwbG90IGlzIGNhbGxlZCBhcyBhIHNldHRlclxyXG4gICAgICAvLyB4MSBpcyBub3QgbmVjZXNzYXJpbHkgYSBudW1iZXIsIGl0IGNhbiBhbHNvIGJlIGFuIGFycmF5LCBhIHN0cmluZyBhbmQgYSBTVkcuUG9pbnRBcnJheVxyXG4gICAgICByZXR1cm4gU1ZHLkxpbmUucHJvdG90eXBlLnBsb3QuYXBwbHkoXHJcbiAgICAgICAgdGhpcy5wdXQobmV3IFNWRy5MaW5lKVxyXG4gICAgICAsIHgxICE9IG51bGwgPyBbeDEsIHkxLCB4MiwgeTJdIDogWzAsIDAsIDAsIDBdXHJcbiAgICAgIClcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxuU1ZHLlBvbHlsaW5lID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAncG9seWxpbmUnXHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5TaGFwZVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gQ3JlYXRlIGEgd3JhcHBlZCBwb2x5bGluZSBlbGVtZW50XHJcbiAgICBwb2x5bGluZTogZnVuY3Rpb24ocCkge1xyXG4gICAgICAvLyBtYWtlIHN1cmUgcGxvdCBpcyBjYWxsZWQgYXMgYSBzZXR0ZXJcclxuICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTVkcuUG9seWxpbmUpLnBsb3QocCB8fCBuZXcgU1ZHLlBvaW50QXJyYXkpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLlBvbHlnb24gPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICdwb2x5Z29uJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuU2hhcGVcclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBhIHdyYXBwZWQgcG9seWdvbiBlbGVtZW50XHJcbiAgICBwb2x5Z29uOiBmdW5jdGlvbihwKSB7XHJcbiAgICAgIC8vIG1ha2Ugc3VyZSBwbG90IGlzIGNhbGxlZCBhcyBhIHNldHRlclxyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5Qb2x5Z29uKS5wbG90KHAgfHwgbmV3IFNWRy5Qb2ludEFycmF5KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcbi8vIEFkZCBwb2x5Z29uLXNwZWNpZmljIGZ1bmN0aW9uc1xyXG5TVkcuZXh0ZW5kKFNWRy5Qb2x5bGluZSwgU1ZHLlBvbHlnb24sIHtcclxuICAvLyBHZXQgYXJyYXlcclxuICBhcnJheTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fYXJyYXkgfHwgKHRoaXMuX2FycmF5ID0gbmV3IFNWRy5Qb2ludEFycmF5KHRoaXMuYXR0cigncG9pbnRzJykpKVxyXG4gIH1cclxuICAvLyBQbG90IG5ldyBwYXRoXHJcbiwgcGxvdDogZnVuY3Rpb24ocCkge1xyXG4gICAgcmV0dXJuIChwID09IG51bGwpID9cclxuICAgICAgdGhpcy5hcnJheSgpIDpcclxuICAgICAgdGhpcy5jbGVhcigpLmF0dHIoJ3BvaW50cycsIHR5cGVvZiBwID09ICdzdHJpbmcnID8gcCA6ICh0aGlzLl9hcnJheSA9IG5ldyBTVkcuUG9pbnRBcnJheShwKSkpXHJcbiAgfVxyXG4gIC8vIENsZWFyIGFycmF5IGNhY2hlXHJcbiwgY2xlYXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2FycmF5XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lclxyXG4sIG1vdmU6IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgIHJldHVybiB0aGlzLmF0dHIoJ3BvaW50cycsIHRoaXMuYXJyYXkoKS5tb3ZlKHgsIHkpKVxyXG4gIH1cclxuICAvLyBTZXQgZWxlbWVudCBzaXplIHRvIGdpdmVuIHdpZHRoIGFuZCBoZWlnaHRcclxuLCBzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICB2YXIgcCA9IHByb3BvcnRpb25hbFNpemUodGhpcywgd2lkdGgsIGhlaWdodClcclxuXHJcbiAgICByZXR1cm4gdGhpcy5hdHRyKCdwb2ludHMnLCB0aGlzLmFycmF5KCkuc2l6ZShwLndpZHRoLCBwLmhlaWdodCkpXHJcbiAgfVxyXG5cclxufSlcclxuXG4vLyB1bmlmeSBhbGwgcG9pbnQgdG8gcG9pbnQgZWxlbWVudHNcclxuU1ZHLmV4dGVuZChTVkcuTGluZSwgU1ZHLlBvbHlsaW5lLCBTVkcuUG9seWdvbiwge1xyXG4gIC8vIERlZmluZSBtb3JwaGFibGUgYXJyYXlcclxuICBtb3JwaEFycmF5OiAgU1ZHLlBvaW50QXJyYXlcclxuICAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lciBvdmVyIHgtYXhpc1xyXG4sIHg6IGZ1bmN0aW9uKHgpIHtcclxuICAgIHJldHVybiB4ID09IG51bGwgPyB0aGlzLmJib3goKS54IDogdGhpcy5tb3ZlKHgsIHRoaXMuYmJveCgpLnkpXHJcbiAgfVxyXG4gIC8vIE1vdmUgYnkgbGVmdCB0b3AgY29ybmVyIG92ZXIgeS1heGlzXHJcbiwgeTogZnVuY3Rpb24oeSkge1xyXG4gICAgcmV0dXJuIHkgPT0gbnVsbCA/IHRoaXMuYmJveCgpLnkgOiB0aGlzLm1vdmUodGhpcy5iYm94KCkueCwgeSlcclxuICB9XHJcbiAgLy8gU2V0IHdpZHRoIG9mIGVsZW1lbnRcclxuLCB3aWR0aDogZnVuY3Rpb24od2lkdGgpIHtcclxuICAgIHZhciBiID0gdGhpcy5iYm94KClcclxuXHJcbiAgICByZXR1cm4gd2lkdGggPT0gbnVsbCA/IGIud2lkdGggOiB0aGlzLnNpemUod2lkdGgsIGIuaGVpZ2h0KVxyXG4gIH1cclxuICAvLyBTZXQgaGVpZ2h0IG9mIGVsZW1lbnRcclxuLCBoZWlnaHQ6IGZ1bmN0aW9uKGhlaWdodCkge1xyXG4gICAgdmFyIGIgPSB0aGlzLmJib3goKVxyXG5cclxuICAgIHJldHVybiBoZWlnaHQgPT0gbnVsbCA/IGIuaGVpZ2h0IDogdGhpcy5zaXplKGIud2lkdGgsIGhlaWdodClcclxuICB9XHJcbn0pXG5TVkcuUGF0aCA9IFNWRy5pbnZlbnQoe1xyXG4gIC8vIEluaXRpYWxpemUgbm9kZVxyXG4gIGNyZWF0ZTogJ3BhdGgnXHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5TaGFwZVxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gRGVmaW5lIG1vcnBoYWJsZSBhcnJheVxyXG4gICAgbW9ycGhBcnJheTogIFNWRy5QYXRoQXJyYXlcclxuICAgIC8vIEdldCBhcnJheVxyXG4gICwgYXJyYXk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fYXJyYXkgfHwgKHRoaXMuX2FycmF5ID0gbmV3IFNWRy5QYXRoQXJyYXkodGhpcy5hdHRyKCdkJykpKVxyXG4gICAgfVxyXG4gICAgLy8gUGxvdCBuZXcgcGF0aFxyXG4gICwgcGxvdDogZnVuY3Rpb24oZCkge1xyXG4gICAgICByZXR1cm4gKGQgPT0gbnVsbCkgP1xyXG4gICAgICAgIHRoaXMuYXJyYXkoKSA6XHJcbiAgICAgICAgdGhpcy5jbGVhcigpLmF0dHIoJ2QnLCB0eXBlb2YgZCA9PSAnc3RyaW5nJyA/IGQgOiAodGhpcy5fYXJyYXkgPSBuZXcgU1ZHLlBhdGhBcnJheShkKSkpXHJcbiAgICB9XHJcbiAgICAvLyBDbGVhciBhcnJheSBjYWNoZVxyXG4gICwgY2xlYXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fYXJyYXlcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIE1vdmUgYnkgbGVmdCB0b3AgY29ybmVyXHJcbiAgLCBtb3ZlOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2QnLCB0aGlzLmFycmF5KCkubW92ZSh4LCB5KSlcclxuICAgIH1cclxuICAgIC8vIE1vdmUgYnkgbGVmdCB0b3AgY29ybmVyIG92ZXIgeC1heGlzXHJcbiAgLCB4OiBmdW5jdGlvbih4KSB7XHJcbiAgICAgIHJldHVybiB4ID09IG51bGwgPyB0aGlzLmJib3goKS54IDogdGhpcy5tb3ZlKHgsIHRoaXMuYmJveCgpLnkpXHJcbiAgICB9XHJcbiAgICAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lciBvdmVyIHktYXhpc1xyXG4gICwgeTogZnVuY3Rpb24oeSkge1xyXG4gICAgICByZXR1cm4geSA9PSBudWxsID8gdGhpcy5iYm94KCkueSA6IHRoaXMubW92ZSh0aGlzLmJib3goKS54LCB5KVxyXG4gICAgfVxyXG4gICAgLy8gU2V0IGVsZW1lbnQgc2l6ZSB0byBnaXZlbiB3aWR0aCBhbmQgaGVpZ2h0XHJcbiAgLCBzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgIHZhciBwID0gcHJvcG9ydGlvbmFsU2l6ZSh0aGlzLCB3aWR0aCwgaGVpZ2h0KVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cignZCcsIHRoaXMuYXJyYXkoKS5zaXplKHAud2lkdGgsIHAuaGVpZ2h0KSlcclxuICAgIH1cclxuICAgIC8vIFNldCB3aWR0aCBvZiBlbGVtZW50XHJcbiAgLCB3aWR0aDogZnVuY3Rpb24od2lkdGgpIHtcclxuICAgICAgcmV0dXJuIHdpZHRoID09IG51bGwgPyB0aGlzLmJib3goKS53aWR0aCA6IHRoaXMuc2l6ZSh3aWR0aCwgdGhpcy5iYm94KCkuaGVpZ2h0KVxyXG4gICAgfVxyXG4gICAgLy8gU2V0IGhlaWdodCBvZiBlbGVtZW50XHJcbiAgLCBoZWlnaHQ6IGZ1bmN0aW9uKGhlaWdodCkge1xyXG4gICAgICByZXR1cm4gaGVpZ2h0ID09IG51bGwgPyB0aGlzLmJib3goKS5oZWlnaHQgOiB0aGlzLnNpemUodGhpcy5iYm94KCkud2lkdGgsIGhlaWdodClcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gQ3JlYXRlIGEgd3JhcHBlZCBwYXRoIGVsZW1lbnRcclxuICAgIHBhdGg6IGZ1bmN0aW9uKGQpIHtcclxuICAgICAgLy8gbWFrZSBzdXJlIHBsb3QgaXMgY2FsbGVkIGFzIGEgc2V0dGVyXHJcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLlBhdGgpLnBsb3QoZCB8fCBuZXcgU1ZHLlBhdGhBcnJheSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxuU1ZHLkltYWdlID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAnaW1hZ2UnXHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5TaGFwZVxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gKHJlKWxvYWQgaW1hZ2VcclxuICAgIGxvYWQ6IGZ1bmN0aW9uKHVybCkge1xyXG4gICAgICBpZiAoIXVybCkgcmV0dXJuIHRoaXNcclxuXHJcbiAgICAgIHZhciBzZWxmID0gdGhpc1xyXG4gICAgICAgICwgaW1nICA9IG5ldyB3aW5kb3cuSW1hZ2UoKVxyXG5cclxuICAgICAgLy8gcHJlbG9hZCBpbWFnZVxyXG4gICAgICBTVkcub24oaW1nLCAnbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBwID0gc2VsZi5wYXJlbnQoU1ZHLlBhdHRlcm4pXHJcblxyXG4gICAgICAgIGlmKHAgPT09IG51bGwpIHJldHVyblxyXG5cclxuICAgICAgICAvLyBlbnN1cmUgaW1hZ2Ugc2l6ZVxyXG4gICAgICAgIGlmIChzZWxmLndpZHRoKCkgPT0gMCAmJiBzZWxmLmhlaWdodCgpID09IDApXHJcbiAgICAgICAgICBzZWxmLnNpemUoaW1nLndpZHRoLCBpbWcuaGVpZ2h0KVxyXG5cclxuICAgICAgICAvLyBlbnN1cmUgcGF0dGVybiBzaXplIGlmIG5vdCBzZXRcclxuICAgICAgICBpZiAocCAmJiBwLndpZHRoKCkgPT0gMCAmJiBwLmhlaWdodCgpID09IDApXHJcbiAgICAgICAgICBwLnNpemUoc2VsZi53aWR0aCgpLCBzZWxmLmhlaWdodCgpKVxyXG5cclxuICAgICAgICAvLyBjYWxsYmFja1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2VsZi5fbG9hZGVkID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgc2VsZi5fbG9hZGVkLmNhbGwoc2VsZiwge1xyXG4gICAgICAgICAgICB3aWR0aDogIGltZy53aWR0aFxyXG4gICAgICAgICAgLCBoZWlnaHQ6IGltZy5oZWlnaHRcclxuICAgICAgICAgICwgcmF0aW86ICBpbWcud2lkdGggLyBpbWcuaGVpZ2h0XHJcbiAgICAgICAgICAsIHVybDogICAgdXJsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgU1ZHLm9uKGltZywgJ2Vycm9yJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzZWxmLl9lcnJvciA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgICAgIHNlbGYuX2Vycm9yLmNhbGwoc2VsZiwgZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdocmVmJywgKGltZy5zcmMgPSB0aGlzLnNyYyA9IHVybCksIFNWRy54bGluaylcclxuICAgIH1cclxuICAgIC8vIEFkZCBsb2FkZWQgY2FsbGJhY2tcclxuICAsIGxvYWRlZDogZnVuY3Rpb24obG9hZGVkKSB7XHJcbiAgICAgIHRoaXMuX2xvYWRlZCA9IGxvYWRlZFxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAsIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICB0aGlzLl9lcnJvciA9IGVycm9yXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gY3JlYXRlIGltYWdlIGVsZW1lbnQsIGxvYWQgaW1hZ2UgYW5kIHNldCBpdHMgc2l6ZVxyXG4gICAgaW1hZ2U6IGZ1bmN0aW9uKHNvdXJjZSwgd2lkdGgsIGhlaWdodCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5JbWFnZSkubG9hZChzb3VyY2UpLnNpemUod2lkdGggfHwgMCwgaGVpZ2h0IHx8IHdpZHRoIHx8IDApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSlcblNWRy5UZXh0ID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBTVkcuY3JlYXRlKCd0ZXh0JykpXHJcblxyXG4gICAgdGhpcy5kb20ubGVhZGluZyA9IG5ldyBTVkcuTnVtYmVyKDEuMykgICAgLy8gc3RvcmUgbGVhZGluZyB2YWx1ZSBmb3IgcmVidWlsZGluZ1xyXG4gICAgdGhpcy5fcmVidWlsZCA9IHRydWUgICAgICAgICAgICAgICAgICAgICAgLy8gZW5hYmxlIGF1dG9tYXRpYyB1cGRhdGluZyBvZiBkeSB2YWx1ZXNcclxuICAgIHRoaXMuX2J1aWxkICAgPSBmYWxzZSAgICAgICAgICAgICAgICAgICAgIC8vIGRpc2FibGUgYnVpbGQgbW9kZSBmb3IgYWRkaW5nIG11bHRpcGxlIGxpbmVzXHJcblxyXG4gICAgLy8gc2V0IGRlZmF1bHQgZm9udFxyXG4gICAgdGhpcy5hdHRyKCdmb250LWZhbWlseScsIFNWRy5kZWZhdWx0cy5hdHRyc1snZm9udC1mYW1pbHknXSlcclxuICB9XHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5TaGFwZVxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gTW92ZSBvdmVyIHgtYXhpc1xyXG4gICAgeDogZnVuY3Rpb24oeCkge1xyXG4gICAgICAvLyBhY3QgYXMgZ2V0dGVyXHJcbiAgICAgIGlmICh4ID09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cigneCcpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd4JywgeClcclxuICAgIH1cclxuICAgIC8vIE1vdmUgb3ZlciB5LWF4aXNcclxuICAsIHk6IGZ1bmN0aW9uKHkpIHtcclxuICAgICAgdmFyIG95ID0gdGhpcy5hdHRyKCd5JylcclxuICAgICAgICAsIG8gID0gdHlwZW9mIG95ID09PSAnbnVtYmVyJyA/IG95IC0gdGhpcy5iYm94KCkueSA6IDBcclxuXHJcbiAgICAgIC8vIGFjdCBhcyBnZXR0ZXJcclxuICAgICAgaWYgKHkgPT0gbnVsbClcclxuICAgICAgICByZXR1cm4gdHlwZW9mIG95ID09PSAnbnVtYmVyJyA/IG95IC0gbyA6IG95XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd5JywgdHlwZW9mIHkgPT09ICdudW1iZXInID8geSArIG8gOiB5KVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBjZW50ZXIgb3ZlciB4LWF4aXNcclxuICAsIGN4OiBmdW5jdGlvbih4KSB7XHJcbiAgICAgIHJldHVybiB4ID09IG51bGwgPyB0aGlzLmJib3goKS5jeCA6IHRoaXMueCh4IC0gdGhpcy5iYm94KCkud2lkdGggLyAyKVxyXG4gICAgfVxyXG4gICAgLy8gTW92ZSBjZW50ZXIgb3ZlciB5LWF4aXNcclxuICAsIGN5OiBmdW5jdGlvbih5KSB7XHJcbiAgICAgIHJldHVybiB5ID09IG51bGwgPyB0aGlzLmJib3goKS5jeSA6IHRoaXMueSh5IC0gdGhpcy5iYm94KCkuaGVpZ2h0IC8gMilcclxuICAgIH1cclxuICAgIC8vIFNldCB0aGUgdGV4dCBjb250ZW50XHJcbiAgLCB0ZXh0OiBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgIC8vIGFjdCBhcyBnZXR0ZXJcclxuICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgdmFyIHRleHQgPSAnJ1xyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZE5vZGVzXHJcbiAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyArK2kpe1xyXG5cclxuICAgICAgICAgIC8vIGFkZCBuZXdsaW5lIGlmIGl0cyBub3QgdGhlIGZpcnN0IGNoaWxkIGFuZCBuZXdMaW5lZCBpcyBzZXQgdG8gdHJ1ZVxyXG4gICAgICAgICAgaWYoaSAhPSAwICYmIGNoaWxkcmVuW2ldLm5vZGVUeXBlICE9IDMgJiYgU1ZHLmFkb3B0KGNoaWxkcmVuW2ldKS5kb20ubmV3TGluZWQgPT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIHRleHQgKz0gJ1xcbidcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBhZGQgY29udGVudCBvZiB0aGlzIG5vZGVcclxuICAgICAgICAgIHRleHQgKz0gY2hpbGRyZW5baV0udGV4dENvbnRlbnRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0ZXh0XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHJlbW92ZSBleGlzdGluZyBjb250ZW50XHJcbiAgICAgIHRoaXMuY2xlYXIoKS5idWlsZCh0cnVlKVxyXG5cclxuICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLy8gY2FsbCBibG9ja1xyXG4gICAgICAgIHRleHQuY2FsbCh0aGlzLCB0aGlzKVxyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBzdG9yZSB0ZXh0IGFuZCBtYWtlIHN1cmUgdGV4dCBpcyBub3QgYmxhbmtcclxuICAgICAgICB0ZXh0ID0gdGV4dC5zcGxpdCgnXFxuJylcclxuXHJcbiAgICAgICAgLy8gYnVpbGQgbmV3IGxpbmVzXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGV4dC5sZW5ndGg7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgICAgdGhpcy50c3Bhbih0ZXh0W2ldKS5uZXdMaW5lKClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gZGlzYWJsZSBidWlsZCBtb2RlIGFuZCByZWJ1aWxkIGxpbmVzXHJcbiAgICAgIHJldHVybiB0aGlzLmJ1aWxkKGZhbHNlKS5yZWJ1aWxkKClcclxuICAgIH1cclxuICAgIC8vIFNldCBmb250IHNpemVcclxuICAsIHNpemU6IGZ1bmN0aW9uKHNpemUpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cignZm9udC1zaXplJywgc2l6ZSkucmVidWlsZCgpXHJcbiAgICB9XHJcbiAgICAvLyBTZXQgLyBnZXQgbGVhZGluZ1xyXG4gICwgbGVhZGluZzogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgLy8gYWN0IGFzIGdldHRlclxyXG4gICAgICBpZiAodmFsdWUgPT0gbnVsbClcclxuICAgICAgICByZXR1cm4gdGhpcy5kb20ubGVhZGluZ1xyXG5cclxuICAgICAgLy8gYWN0IGFzIHNldHRlclxyXG4gICAgICB0aGlzLmRvbS5sZWFkaW5nID0gbmV3IFNWRy5OdW1iZXIodmFsdWUpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5yZWJ1aWxkKClcclxuICAgIH1cclxuICAgIC8vIEdldCBhbGwgdGhlIGZpcnN0IGxldmVsIGxpbmVzXHJcbiAgLCBsaW5lczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBub2RlID0gKHRoaXMudGV4dFBhdGggJiYgdGhpcy50ZXh0UGF0aCgpIHx8IHRoaXMpLm5vZGVcclxuXHJcbiAgICAgIC8vIGZpbHRlciB0c3BhbnMgYW5kIG1hcCB0aGVtIHRvIFNWRy5qcyBpbnN0YW5jZXNcclxuICAgICAgdmFyIGxpbmVzID0gU1ZHLnV0aWxzLm1hcChTVkcudXRpbHMuZmlsdGVyU1ZHRWxlbWVudHMobm9kZS5jaGlsZE5vZGVzKSwgZnVuY3Rpb24oZWwpe1xyXG4gICAgICAgIHJldHVybiBTVkcuYWRvcHQoZWwpXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyByZXR1cm4gYW4gaW5zdGFuY2Ugb2YgU1ZHLnNldFxyXG4gICAgICByZXR1cm4gbmV3IFNWRy5TZXQobGluZXMpXHJcbiAgICB9XHJcbiAgICAvLyBSZWJ1aWxkIGFwcGVhcmFuY2UgdHlwZVxyXG4gICwgcmVidWlsZDogZnVuY3Rpb24ocmVidWlsZCkge1xyXG4gICAgICAvLyBzdG9yZSBuZXcgcmVidWlsZCBmbGFnIGlmIGdpdmVuXHJcbiAgICAgIGlmICh0eXBlb2YgcmVidWlsZCA9PSAnYm9vbGVhbicpXHJcbiAgICAgICAgdGhpcy5fcmVidWlsZCA9IHJlYnVpbGRcclxuXHJcbiAgICAgIC8vIGRlZmluZSBwb3NpdGlvbiBvZiBhbGwgbGluZXNcclxuICAgICAgaWYgKHRoaXMuX3JlYnVpbGQpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXNcclxuICAgICAgICAgICwgYmxhbmtMaW5lT2Zmc2V0ID0gMFxyXG4gICAgICAgICAgLCBkeSA9IHRoaXMuZG9tLmxlYWRpbmcgKiBuZXcgU1ZHLk51bWJlcih0aGlzLmF0dHIoJ2ZvbnQtc2l6ZScpKVxyXG5cclxuICAgICAgICB0aGlzLmxpbmVzKCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmRvbS5uZXdMaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoIXNlbGYudGV4dFBhdGgoKSlcclxuICAgICAgICAgICAgICB0aGlzLmF0dHIoJ3gnLCBzZWxmLmF0dHIoJ3gnKSlcclxuICAgICAgICAgICAgaWYodGhpcy50ZXh0KCkgPT0gJ1xcbicpIHtcclxuICAgICAgICAgICAgICBibGFua0xpbmVPZmZzZXQgKz0gZHlcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgdGhpcy5hdHRyKCdkeScsIGR5ICsgYmxhbmtMaW5lT2Zmc2V0KVxyXG4gICAgICAgICAgICAgIGJsYW5rTGluZU9mZnNldCA9IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMuZmlyZSgncmVidWlsZCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBFbmFibGUgLyBkaXNhYmxlIGJ1aWxkIG1vZGVcclxuICAsIGJ1aWxkOiBmdW5jdGlvbihidWlsZCkge1xyXG4gICAgICB0aGlzLl9idWlsZCA9ICEhYnVpbGRcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIG92ZXJ3cml0ZSBtZXRob2QgZnJvbSBwYXJlbnQgdG8gc2V0IGRhdGEgcHJvcGVybHlcclxuICAsIHNldERhdGE6IGZ1bmN0aW9uKG8pe1xyXG4gICAgICB0aGlzLmRvbSA9IG9cclxuICAgICAgdGhpcy5kb20ubGVhZGluZyA9IG5ldyBTVkcuTnVtYmVyKG8ubGVhZGluZyB8fCAxLjMpXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gQ3JlYXRlIHRleHQgZWxlbWVudFxyXG4gICAgdGV4dDogZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5UZXh0KS50ZXh0KHRleHQpXHJcbiAgICB9XHJcbiAgICAvLyBDcmVhdGUgcGxhaW4gdGV4dCBlbGVtZW50XHJcbiAgLCBwbGFpbjogZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5UZXh0KS5wbGFpbih0ZXh0KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5TVkcuVHNwYW4gPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICd0c3BhbidcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLlNoYXBlXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBTZXQgdGV4dCBjb250ZW50XHJcbiAgICB0ZXh0OiBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgIGlmKHRleHQgPT0gbnVsbCkgcmV0dXJuIHRoaXMubm9kZS50ZXh0Q29udGVudCArICh0aGlzLmRvbS5uZXdMaW5lZCA/ICdcXG4nIDogJycpXHJcblxyXG4gICAgICB0eXBlb2YgdGV4dCA9PT0gJ2Z1bmN0aW9uJyA/IHRleHQuY2FsbCh0aGlzLCB0aGlzKSA6IHRoaXMucGxhaW4odGV4dClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBTaG9ydGN1dCBkeFxyXG4gICwgZHg6IGZ1bmN0aW9uKGR4KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2R4JywgZHgpXHJcbiAgICB9XHJcbiAgICAvLyBTaG9ydGN1dCBkeVxyXG4gICwgZHk6IGZ1bmN0aW9uKGR5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2R5JywgZHkpXHJcbiAgICB9XHJcbiAgICAvLyBDcmVhdGUgbmV3IGxpbmVcclxuICAsIG5ld0xpbmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBmZXRjaCB0ZXh0IHBhcmVudFxyXG4gICAgICB2YXIgdCA9IHRoaXMucGFyZW50KFNWRy5UZXh0KVxyXG5cclxuICAgICAgLy8gbWFyayBuZXcgbGluZVxyXG4gICAgICB0aGlzLmRvbS5uZXdMaW5lZCA9IHRydWVcclxuXHJcbiAgICAgIC8vIGFwcGx5IG5ldyBoecKhblxyXG4gICAgICByZXR1cm4gdGhpcy5keSh0LmRvbS5sZWFkaW5nICogdC5hdHRyKCdmb250LXNpemUnKSkuYXR0cigneCcsIHQueCgpKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5UZXh0LCBTVkcuVHNwYW4sIHtcclxuICAvLyBDcmVhdGUgcGxhaW4gdGV4dCBub2RlXHJcbiAgcGxhaW46IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgIC8vIGNsZWFyIGlmIGJ1aWxkIG1vZGUgaXMgZGlzYWJsZWRcclxuICAgIGlmICh0aGlzLl9idWlsZCA9PT0gZmFsc2UpXHJcbiAgICAgIHRoaXMuY2xlYXIoKVxyXG5cclxuICAgIC8vIGNyZWF0ZSB0ZXh0IG5vZGVcclxuICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KSlcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAvLyBDcmVhdGUgYSB0c3BhblxyXG4sIHRzcGFuOiBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICB2YXIgbm9kZSAgPSAodGhpcy50ZXh0UGF0aCAmJiB0aGlzLnRleHRQYXRoKCkgfHwgdGhpcykubm9kZVxyXG4gICAgICAsIHRzcGFuID0gbmV3IFNWRy5Uc3BhblxyXG5cclxuICAgIC8vIGNsZWFyIGlmIGJ1aWxkIG1vZGUgaXMgZGlzYWJsZWRcclxuICAgIGlmICh0aGlzLl9idWlsZCA9PT0gZmFsc2UpXHJcbiAgICAgIHRoaXMuY2xlYXIoKVxyXG5cclxuICAgIC8vIGFkZCBuZXcgdHNwYW5cclxuICAgIG5vZGUuYXBwZW5kQ2hpbGQodHNwYW4ubm9kZSlcclxuXHJcbiAgICByZXR1cm4gdHNwYW4udGV4dCh0ZXh0KVxyXG4gIH1cclxuICAvLyBDbGVhciBhbGwgbGluZXNcclxuLCBjbGVhcjogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgbm9kZSA9ICh0aGlzLnRleHRQYXRoICYmIHRoaXMudGV4dFBhdGgoKSB8fCB0aGlzKS5ub2RlXHJcblxyXG4gICAgLy8gcmVtb3ZlIGV4aXN0aW5nIGNoaWxkIG5vZGVzXHJcbiAgICB3aGlsZSAobm9kZS5oYXNDaGlsZE5vZGVzKCkpXHJcbiAgICAgIG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5sYXN0Q2hpbGQpXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgLy8gR2V0IGxlbmd0aCBvZiB0ZXh0IGVsZW1lbnRcclxuLCBsZW5ndGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubm9kZS5nZXRDb21wdXRlZFRleHRMZW5ndGgoKVxyXG4gIH1cclxufSlcclxuXG5TVkcuVGV4dFBhdGggPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICd0ZXh0UGF0aCdcclxuXHJcbiAgLy8gSW5oZXJpdCBmcm9tXHJcbiwgaW5oZXJpdDogU1ZHLlBhcmVudFxyXG5cclxuICAvLyBEZWZpbmUgcGFyZW50IGNsYXNzXHJcbiwgcGFyZW50OiBTVkcuVGV4dFxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgbW9ycGhBcnJheTogU1ZHLlBhdGhBcnJheVxyXG4gICAgLy8gQ3JlYXRlIHBhdGggZm9yIHRleHQgdG8gcnVuIG9uXHJcbiAgLCBwYXRoOiBmdW5jdGlvbihkKSB7XHJcbiAgICAgIC8vIGNyZWF0ZSB0ZXh0UGF0aCBlbGVtZW50XHJcbiAgICAgIHZhciBwYXRoICA9IG5ldyBTVkcuVGV4dFBhdGhcclxuICAgICAgICAsIHRyYWNrID0gdGhpcy5kb2MoKS5kZWZzKCkucGF0aChkKVxyXG5cclxuICAgICAgLy8gbW92ZSBsaW5lcyB0byB0ZXh0cGF0aFxyXG4gICAgICB3aGlsZSAodGhpcy5ub2RlLmhhc0NoaWxkTm9kZXMoKSlcclxuICAgICAgICBwYXRoLm5vZGUuYXBwZW5kQ2hpbGQodGhpcy5ub2RlLmZpcnN0Q2hpbGQpXHJcblxyXG4gICAgICAvLyBhZGQgdGV4dFBhdGggZWxlbWVudCBhcyBjaGlsZCBub2RlXHJcbiAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZChwYXRoLm5vZGUpXHJcblxyXG4gICAgICAvLyBsaW5rIHRleHRQYXRoIHRvIHBhdGggYW5kIGFkZCBjb250ZW50XHJcbiAgICAgIHBhdGguYXR0cignaHJlZicsICcjJyArIHRyYWNrLCBTVkcueGxpbmspXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gcmV0dXJuIHRoZSBhcnJheSBvZiB0aGUgcGF0aCB0cmFjayBlbGVtZW50XHJcbiAgLCBhcnJheTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciB0cmFjayA9IHRoaXMudHJhY2soKVxyXG5cclxuICAgICAgcmV0dXJuIHRyYWNrID8gdHJhY2suYXJyYXkoKSA6IG51bGxcclxuICAgIH1cclxuICAgIC8vIFBsb3QgcGF0aCBpZiBhbnlcclxuICAsIHBsb3Q6IGZ1bmN0aW9uKGQpIHtcclxuICAgICAgdmFyIHRyYWNrID0gdGhpcy50cmFjaygpXHJcbiAgICAgICAgLCBwYXRoQXJyYXkgPSBudWxsXHJcblxyXG4gICAgICBpZiAodHJhY2spIHtcclxuICAgICAgICBwYXRoQXJyYXkgPSB0cmFjay5wbG90KGQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAoZCA9PSBudWxsKSA/IHBhdGhBcnJheSA6IHRoaXNcclxuICAgIH1cclxuICAgIC8vIEdldCB0aGUgcGF0aCB0cmFjayBlbGVtZW50XHJcbiAgLCB0cmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBwYXRoID0gdGhpcy50ZXh0UGF0aCgpXHJcblxyXG4gICAgICBpZiAocGF0aClcclxuICAgICAgICByZXR1cm4gcGF0aC5yZWZlcmVuY2UoJ2hyZWYnKVxyXG4gICAgfVxyXG4gICAgLy8gR2V0IHRoZSB0ZXh0UGF0aCBjaGlsZFxyXG4gICwgdGV4dFBhdGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAodGhpcy5ub2RlLmZpcnN0Q2hpbGQgJiYgdGhpcy5ub2RlLmZpcnN0Q2hpbGQubm9kZU5hbWUgPT0gJ3RleHRQYXRoJylcclxuICAgICAgICByZXR1cm4gU1ZHLmFkb3B0KHRoaXMubm9kZS5maXJzdENoaWxkKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXG5TVkcuTmVzdGVkID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBTVkcuY3JlYXRlKCdzdmcnKSlcclxuXHJcbiAgICB0aGlzLnN0eWxlKCdvdmVyZmxvdycsICd2aXNpYmxlJylcclxuICB9XHJcblxyXG4gIC8vIEluaGVyaXQgZnJvbVxyXG4sIGluaGVyaXQ6IFNWRy5Db250YWluZXJcclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBuZXN0ZWQgc3ZnIGRvY3VtZW50XHJcbiAgICBuZXN0ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5OZXN0ZWQpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxuU1ZHLkEgPSBTVkcuaW52ZW50KHtcclxuICAvLyBJbml0aWFsaXplIG5vZGVcclxuICBjcmVhdGU6ICdhJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuQ29udGFpbmVyXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBMaW5rIHVybFxyXG4gICAgdG86IGZ1bmN0aW9uKHVybCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdocmVmJywgdXJsLCBTVkcueGxpbmspXHJcbiAgICB9XHJcbiAgICAvLyBMaW5rIHNob3cgYXR0cmlidXRlXHJcbiAgLCBzaG93OiBmdW5jdGlvbih0YXJnZXQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cignc2hvdycsIHRhcmdldCwgU1ZHLnhsaW5rKVxyXG4gICAgfVxyXG4gICAgLy8gTGluayB0YXJnZXQgYXR0cmlidXRlXHJcbiAgLCB0YXJnZXQ6IGZ1bmN0aW9uKHRhcmdldCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCd0YXJnZXQnLCB0YXJnZXQpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFyZW50IG1ldGhvZFxyXG4sIGNvbnN0cnVjdDoge1xyXG4gICAgLy8gQ3JlYXRlIGEgaHlwZXJsaW5rIGVsZW1lbnRcclxuICAgIGxpbms6IGZ1bmN0aW9uKHVybCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5BKS50byh1cmwpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xyXG4gIC8vIENyZWF0ZSBhIGh5cGVybGluayBlbGVtZW50XHJcbiAgbGlua1RvOiBmdW5jdGlvbih1cmwpIHtcclxuICAgIHZhciBsaW5rID0gbmV3IFNWRy5BXHJcblxyXG4gICAgaWYgKHR5cGVvZiB1cmwgPT0gJ2Z1bmN0aW9uJylcclxuICAgICAgdXJsLmNhbGwobGluaywgbGluaylcclxuICAgIGVsc2VcclxuICAgICAgbGluay50byh1cmwpXHJcblxyXG4gICAgcmV0dXJuIHRoaXMucGFyZW50KCkucHV0KGxpbmspLnB1dCh0aGlzKVxyXG4gIH1cclxuXHJcbn0pXG5TVkcuTWFya2VyID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiAnbWFya2VyJ1xyXG5cclxuICAvLyBJbmhlcml0IGZyb21cclxuLCBpbmhlcml0OiBTVkcuQ29udGFpbmVyXHJcblxyXG4gIC8vIEFkZCBjbGFzcyBtZXRob2RzXHJcbiwgZXh0ZW5kOiB7XHJcbiAgICAvLyBTZXQgd2lkdGggb2YgZWxlbWVudFxyXG4gICAgd2lkdGg6IGZ1bmN0aW9uKHdpZHRoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ21hcmtlcldpZHRoJywgd2lkdGgpXHJcbiAgICB9XHJcbiAgICAvLyBTZXQgaGVpZ2h0IG9mIGVsZW1lbnRcclxuICAsIGhlaWdodDogZnVuY3Rpb24oaGVpZ2h0KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ21hcmtlckhlaWdodCcsIGhlaWdodClcclxuICAgIH1cclxuICAgIC8vIFNldCBtYXJrZXIgcmVmWCBhbmQgcmVmWVxyXG4gICwgcmVmOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3JlZlgnLCB4KS5hdHRyKCdyZWZZJywgeSlcclxuICAgIH1cclxuICAgIC8vIFVwZGF0ZSBtYXJrZXJcclxuICAsIHVwZGF0ZTogZnVuY3Rpb24oYmxvY2spIHtcclxuICAgICAgLy8gcmVtb3ZlIGFsbCBjb250ZW50XHJcbiAgICAgIHRoaXMuY2xlYXIoKVxyXG5cclxuICAgICAgLy8gaW52b2tlIHBhc3NlZCBibG9ja1xyXG4gICAgICBpZiAodHlwZW9mIGJsb2NrID09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgYmxvY2suY2FsbCh0aGlzLCB0aGlzKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICAgIC8vIFJldHVybiB0aGUgZmlsbCBpZFxyXG4gICwgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gJ3VybCgjJyArIHRoaXMuaWQoKSArICcpJ1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIG1hcmtlcjogZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgYmxvY2spIHtcclxuICAgICAgLy8gQ3JlYXRlIG1hcmtlciBlbGVtZW50IGluIGRlZnNcclxuICAgICAgcmV0dXJuIHRoaXMuZGVmcygpLm1hcmtlcih3aWR0aCwgaGVpZ2h0LCBibG9jaylcclxuICAgIH1cclxuICB9XHJcblxyXG59KVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuRGVmcywge1xyXG4gIC8vIENyZWF0ZSBtYXJrZXJcclxuICBtYXJrZXI6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIGJsb2NrKSB7XHJcbiAgICAvLyBTZXQgZGVmYXVsdCB2aWV3Ym94IHRvIG1hdGNoIHRoZSB3aWR0aCBhbmQgaGVpZ2h0LCBzZXQgcmVmIHRvIGN4IGFuZCBjeSBhbmQgc2V0IG9yaWVudCB0byBhdXRvXHJcbiAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5NYXJrZXIpXHJcbiAgICAgIC5zaXplKHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgIC5yZWYod2lkdGggLyAyLCBoZWlnaHQgLyAyKVxyXG4gICAgICAudmlld2JveCgwLCAwLCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAuYXR0cignb3JpZW50JywgJ2F1dG8nKVxyXG4gICAgICAudXBkYXRlKGJsb2NrKVxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5MaW5lLCBTVkcuUG9seWxpbmUsIFNWRy5Qb2x5Z29uLCBTVkcuUGF0aCwge1xyXG4gIC8vIENyZWF0ZSBhbmQgYXR0YWNoIG1hcmtlcnNcclxuICBtYXJrZXI6IGZ1bmN0aW9uKG1hcmtlciwgd2lkdGgsIGhlaWdodCwgYmxvY2spIHtcclxuICAgIHZhciBhdHRyID0gWydtYXJrZXInXVxyXG5cclxuICAgIC8vIEJ1aWxkIGF0dHJpYnV0ZSBuYW1lXHJcbiAgICBpZiAobWFya2VyICE9ICdhbGwnKSBhdHRyLnB1c2gobWFya2VyKVxyXG4gICAgYXR0ciA9IGF0dHIuam9pbignLScpXHJcblxyXG4gICAgLy8gU2V0IG1hcmtlciBhdHRyaWJ1dGVcclxuICAgIG1hcmtlciA9IGFyZ3VtZW50c1sxXSBpbnN0YW5jZW9mIFNWRy5NYXJrZXIgP1xyXG4gICAgICBhcmd1bWVudHNbMV0gOlxyXG4gICAgICB0aGlzLmRvYygpLm1hcmtlcih3aWR0aCwgaGVpZ2h0LCBibG9jaylcclxuXHJcbiAgICByZXR1cm4gdGhpcy5hdHRyKGF0dHIsIG1hcmtlcilcclxuICB9XHJcblxyXG59KVxuLy8gRGVmaW5lIGxpc3Qgb2YgYXZhaWxhYmxlIGF0dHJpYnV0ZXMgZm9yIHN0cm9rZSBhbmQgZmlsbFxyXG52YXIgc3VnYXIgPSB7XHJcbiAgc3Ryb2tlOiBbJ2NvbG9yJywgJ3dpZHRoJywgJ29wYWNpdHknLCAnbGluZWNhcCcsICdsaW5lam9pbicsICdtaXRlcmxpbWl0JywgJ2Rhc2hhcnJheScsICdkYXNob2Zmc2V0J11cclxuLCBmaWxsOiAgIFsnY29sb3InLCAnb3BhY2l0eScsICdydWxlJ11cclxuLCBwcmVmaXg6IGZ1bmN0aW9uKHQsIGEpIHtcclxuICAgIHJldHVybiBhID09ICdjb2xvcicgPyB0IDogdCArICctJyArIGFcclxuICB9XHJcbn1cclxuXHJcbi8vIEFkZCBzdWdhciBmb3IgZmlsbCBhbmQgc3Ryb2tlXHJcbjtbJ2ZpbGwnLCAnc3Ryb2tlJ10uZm9yRWFjaChmdW5jdGlvbihtKSB7XHJcbiAgdmFyIGksIGV4dGVuc2lvbiA9IHt9XHJcblxyXG4gIGV4dGVuc2lvblttXSA9IGZ1bmN0aW9uKG8pIHtcclxuICAgIGlmICh0eXBlb2YgbyA9PSAndW5kZWZpbmVkJylcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIGlmICh0eXBlb2YgbyA9PSAnc3RyaW5nJyB8fCBTVkcuQ29sb3IuaXNSZ2IobykgfHwgKG8gJiYgdHlwZW9mIG8uZmlsbCA9PT0gJ2Z1bmN0aW9uJykpXHJcbiAgICAgIHRoaXMuYXR0cihtLCBvKVxyXG5cclxuICAgIGVsc2VcclxuICAgICAgLy8gc2V0IGFsbCBhdHRyaWJ1dGVzIGZyb20gc3VnYXIuZmlsbCBhbmQgc3VnYXIuc3Ryb2tlIGxpc3RcclxuICAgICAgZm9yIChpID0gc3VnYXJbbV0ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAgICAgICAgaWYgKG9bc3VnYXJbbV1baV1dICE9IG51bGwpXHJcbiAgICAgICAgICB0aGlzLmF0dHIoc3VnYXIucHJlZml4KG0sIHN1Z2FyW21dW2ldKSwgb1tzdWdhclttXVtpXV0pXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIFNWRy5leHRlbmQoU1ZHLkVsZW1lbnQsIFNWRy5GWCwgZXh0ZW5zaW9uKVxyXG5cclxufSlcclxuXHJcblNWRy5leHRlbmQoU1ZHLkVsZW1lbnQsIFNWRy5GWCwge1xyXG4gIC8vIE1hcCByb3RhdGlvbiB0byB0cmFuc2Zvcm1cclxuICByb3RhdGU6IGZ1bmN0aW9uKGQsIGN4LCBjeSkge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHsgcm90YXRpb246IGQsIGN4OiBjeCwgY3k6IGN5IH0pXHJcbiAgfVxyXG4gIC8vIE1hcCBza2V3IHRvIHRyYW5zZm9ybVxyXG4sIHNrZXc6IGZ1bmN0aW9uKHgsIHksIGN4LCBjeSkge1xyXG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT0gMSAgfHwgYXJndW1lbnRzLmxlbmd0aCA9PSAzID9cclxuICAgICAgdGhpcy50cmFuc2Zvcm0oeyBza2V3OiB4LCBjeDogeSwgY3k6IGN4IH0pIDpcclxuICAgICAgdGhpcy50cmFuc2Zvcm0oeyBza2V3WDogeCwgc2tld1k6IHksIGN4OiBjeCwgY3k6IGN5IH0pXHJcbiAgfVxyXG4gIC8vIE1hcCBzY2FsZSB0byB0cmFuc2Zvcm1cclxuLCBzY2FsZTogZnVuY3Rpb24oeCwgeSwgY3gsIGN5KSB7XHJcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PSAxICB8fCBhcmd1bWVudHMubGVuZ3RoID09IDMgP1xyXG4gICAgICB0aGlzLnRyYW5zZm9ybSh7IHNjYWxlOiB4LCBjeDogeSwgY3k6IGN4IH0pIDpcclxuICAgICAgdGhpcy50cmFuc2Zvcm0oeyBzY2FsZVg6IHgsIHNjYWxlWTogeSwgY3g6IGN4LCBjeTogY3kgfSlcclxuICB9XHJcbiAgLy8gTWFwIHRyYW5zbGF0ZSB0byB0cmFuc2Zvcm1cclxuLCB0cmFuc2xhdGU6IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybSh7IHg6IHgsIHk6IHkgfSlcclxuICB9XHJcbiAgLy8gTWFwIGZsaXAgdG8gdHJhbnNmb3JtXHJcbiwgZmxpcDogZnVuY3Rpb24oYSwgbykge1xyXG4gICAgbyA9IHR5cGVvZiBhID09ICdudW1iZXInID8gYSA6IG9cclxuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybSh7IGZsaXA6IGEgfHwgJ2JvdGgnLCBvZmZzZXQ6IG8gfSlcclxuICB9XHJcbiAgLy8gTWFwIG1hdHJpeCB0byB0cmFuc2Zvcm1cclxuLCBtYXRyaXg6IGZ1bmN0aW9uKG0pIHtcclxuICAgIHJldHVybiB0aGlzLmF0dHIoJ3RyYW5zZm9ybScsIG5ldyBTVkcuTWF0cml4KGFyZ3VtZW50cy5sZW5ndGggPT0gNiA/IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSA6IG0pKVxyXG4gIH1cclxuICAvLyBPcGFjaXR5XHJcbiwgb3BhY2l0eTogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHJldHVybiB0aGlzLmF0dHIoJ29wYWNpdHknLCB2YWx1ZSlcclxuICB9XHJcbiAgLy8gUmVsYXRpdmUgbW92ZSBvdmVyIHggYXhpc1xyXG4sIGR4OiBmdW5jdGlvbih4KSB7XHJcbiAgICByZXR1cm4gdGhpcy54KG5ldyBTVkcuTnVtYmVyKHgpLnBsdXModGhpcyBpbnN0YW5jZW9mIFNWRy5GWCA/IDAgOiB0aGlzLngoKSksIHRydWUpXHJcbiAgfVxyXG4gIC8vIFJlbGF0aXZlIG1vdmUgb3ZlciB5IGF4aXNcclxuLCBkeTogZnVuY3Rpb24oeSkge1xyXG4gICAgcmV0dXJuIHRoaXMueShuZXcgU1ZHLk51bWJlcih5KS5wbHVzKHRoaXMgaW5zdGFuY2VvZiBTVkcuRlggPyAwIDogdGhpcy55KCkpLCB0cnVlKVxyXG4gIH1cclxuICAvLyBSZWxhdGl2ZSBtb3ZlIG92ZXIgeCBhbmQgeSBheGVzXHJcbiwgZG1vdmU6IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgIHJldHVybiB0aGlzLmR4KHgpLmR5KHkpXHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuUmVjdCwgU1ZHLkVsbGlwc2UsIFNWRy5DaXJjbGUsIFNWRy5HcmFkaWVudCwgU1ZHLkZYLCB7XHJcbiAgLy8gQWRkIHggYW5kIHkgcmFkaXVzXHJcbiAgcmFkaXVzOiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICB2YXIgdHlwZSA9ICh0aGlzLl90YXJnZXQgfHwgdGhpcykudHlwZTtcclxuICAgIHJldHVybiB0eXBlID09ICdyYWRpYWwnIHx8IHR5cGUgPT0gJ2NpcmNsZScgP1xyXG4gICAgICB0aGlzLmF0dHIoJ3InLCBuZXcgU1ZHLk51bWJlcih4KSkgOlxyXG4gICAgICB0aGlzLnJ4KHgpLnJ5KHkgPT0gbnVsbCA/IHggOiB5KVxyXG4gIH1cclxufSlcclxuXHJcblNWRy5leHRlbmQoU1ZHLlBhdGgsIHtcclxuICAvLyBHZXQgcGF0aCBsZW5ndGhcclxuICBsZW5ndGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubm9kZS5nZXRUb3RhbExlbmd0aCgpXHJcbiAgfVxyXG4gIC8vIEdldCBwb2ludCBhdCBsZW5ndGhcclxuLCBwb2ludEF0OiBmdW5jdGlvbihsZW5ndGgpIHtcclxuICAgIHJldHVybiB0aGlzLm5vZGUuZ2V0UG9pbnRBdExlbmd0aChsZW5ndGgpXHJcbiAgfVxyXG59KVxyXG5cclxuU1ZHLmV4dGVuZChTVkcuUGFyZW50LCBTVkcuVGV4dCwgU1ZHLlRzcGFuLCBTVkcuRlgsIHtcclxuICAvLyBTZXQgZm9udFxyXG4gIGZvbnQ6IGZ1bmN0aW9uKGEsIHYpIHtcclxuICAgIGlmICh0eXBlb2YgYSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICBmb3IgKHYgaW4gYSkgdGhpcy5mb250KHYsIGFbdl0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGEgPT0gJ2xlYWRpbmcnID9cclxuICAgICAgICB0aGlzLmxlYWRpbmcodikgOlxyXG4gICAgICBhID09ICdhbmNob3InID9cclxuICAgICAgICB0aGlzLmF0dHIoJ3RleHQtYW5jaG9yJywgdikgOlxyXG4gICAgICBhID09ICdzaXplJyB8fCBhID09ICdmYW1pbHknIHx8IGEgPT0gJ3dlaWdodCcgfHwgYSA9PSAnc3RyZXRjaCcgfHwgYSA9PSAndmFyaWFudCcgfHwgYSA9PSAnc3R5bGUnID9cclxuICAgICAgICB0aGlzLmF0dHIoJ2ZvbnQtJysgYSwgdikgOlxyXG4gICAgICAgIHRoaXMuYXR0cihhLCB2KVxyXG4gIH1cclxufSlcclxuXG5TVkcuU2V0ID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZVxyXG4gIGNyZWF0ZTogZnVuY3Rpb24obWVtYmVycykge1xyXG4gICAgLy8gU2V0IGluaXRpYWwgc3RhdGVcclxuICAgIEFycmF5LmlzQXJyYXkobWVtYmVycykgPyB0aGlzLm1lbWJlcnMgPSBtZW1iZXJzIDogdGhpcy5jbGVhcigpXHJcbiAgfVxyXG5cclxuICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xyXG4sIGV4dGVuZDoge1xyXG4gICAgLy8gQWRkIGVsZW1lbnQgdG8gc2V0XHJcbiAgICBhZGQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgaSwgaWwsIGVsZW1lbnRzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcblxyXG4gICAgICBmb3IgKGkgPSAwLCBpbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgdGhpcy5tZW1iZXJzLnB1c2goZWxlbWVudHNbaV0pXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gUmVtb3ZlIGVsZW1lbnQgZnJvbSBzZXRcclxuICAsIHJlbW92ZTogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICB2YXIgaSA9IHRoaXMuaW5kZXgoZWxlbWVudClcclxuXHJcbiAgICAgIC8vIHJlbW92ZSBnaXZlbiBjaGlsZFxyXG4gICAgICBpZiAoaSA+IC0xKVxyXG4gICAgICAgIHRoaXMubWVtYmVycy5zcGxpY2UoaSwgMSlcclxuXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcbiAgICAvLyBJdGVyYXRlIG92ZXIgYWxsIG1lbWJlcnNcclxuICAsIGVhY2g6IGZ1bmN0aW9uKGJsb2NrKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMubWVtYmVycy5sZW5ndGg7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGJsb2NrLmFwcGx5KHRoaXMubWVtYmVyc1tpXSwgW2ksIHRoaXMubWVtYmVyc10pXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gUmVzdG9yZSB0byBkZWZhdWx0c1xyXG4gICwgY2xlYXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBpbml0aWFsaXplIHN0b3JlXHJcbiAgICAgIHRoaXMubWVtYmVycyA9IFtdXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gICAgLy8gR2V0IHRoZSBsZW5ndGggb2YgYSBzZXRcclxuICAsIGxlbmd0aDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1lbWJlcnMubGVuZ3RoXHJcbiAgICB9XHJcbiAgICAvLyBDaGVja3MgaWYgYSBnaXZlbiBlbGVtZW50IGlzIHByZXNlbnQgaW4gc2V0XHJcbiAgLCBoYXM6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5kZXgoZWxlbWVudCkgPj0gMFxyXG4gICAgfVxyXG4gICAgLy8gcmV0dW5zIGluZGV4IG9mIGdpdmVuIGVsZW1lbnQgaW4gc2V0XHJcbiAgLCBpbmRleDogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5tZW1iZXJzLmluZGV4T2YoZWxlbWVudClcclxuICAgIH1cclxuICAgIC8vIEdldCBtZW1iZXIgYXQgZ2l2ZW4gaW5kZXhcclxuICAsIGdldDogZnVuY3Rpb24oaSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5tZW1iZXJzW2ldXHJcbiAgICB9XHJcbiAgICAvLyBHZXQgZmlyc3QgbWVtYmVyXHJcbiAgLCBmaXJzdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldCgwKVxyXG4gICAgfVxyXG4gICAgLy8gR2V0IGxhc3QgbWVtYmVyXHJcbiAgLCBsYXN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KHRoaXMubWVtYmVycy5sZW5ndGggLSAxKVxyXG4gICAgfVxyXG4gICAgLy8gRGVmYXVsdCB2YWx1ZVxyXG4gICwgdmFsdWVPZjogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1lbWJlcnNcclxuICAgIH1cclxuICAgIC8vIEdldCB0aGUgYm91bmRpbmcgYm94IG9mIGFsbCBtZW1iZXJzIGluY2x1ZGVkIG9yIGVtcHR5IGJveCBpZiBzZXQgaGFzIG5vIGl0ZW1zXHJcbiAgLCBiYm94OiBmdW5jdGlvbigpe1xyXG4gICAgICAvLyByZXR1cm4gYW4gZW1wdHkgYm94IG9mIHRoZXJlIGFyZSBubyBtZW1iZXJzXHJcbiAgICAgIGlmICh0aGlzLm1lbWJlcnMubGVuZ3RoID09IDApXHJcbiAgICAgICAgcmV0dXJuIG5ldyBTVkcuUkJveCgpXHJcblxyXG4gICAgICAvLyBnZXQgdGhlIGZpcnN0IHJib3ggYW5kIHVwZGF0ZSB0aGUgdGFyZ2V0IGJib3hcclxuICAgICAgdmFyIHJib3ggPSB0aGlzLm1lbWJlcnNbMF0ucmJveCh0aGlzLm1lbWJlcnNbMF0uZG9jKCkpXHJcblxyXG4gICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gdXNlciByYm94IGZvciBjb3JyZWN0IHBvc2l0aW9uIGFuZCB2aXN1YWwgcmVwcmVzZW50YXRpb25cclxuICAgICAgICByYm94ID0gcmJveC5tZXJnZSh0aGlzLnJib3godGhpcy5kb2MoKSkpXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gcmJveFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHBhcmVudCBtZXRob2RcclxuLCBjb25zdHJ1Y3Q6IHtcclxuICAgIC8vIENyZWF0ZSBhIG5ldyBzZXRcclxuICAgIHNldDogZnVuY3Rpb24obWVtYmVycykge1xyXG4gICAgICByZXR1cm4gbmV3IFNWRy5TZXQobWVtYmVycylcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG5TVkcuRlguU2V0ID0gU1ZHLmludmVudCh7XHJcbiAgLy8gSW5pdGlhbGl6ZSBub2RlXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihzZXQpIHtcclxuICAgIC8vIHN0b3JlIHJlZmVyZW5jZSB0byBzZXRcclxuICAgIHRoaXMuc2V0ID0gc2V0XHJcbiAgfVxyXG5cclxufSlcclxuXHJcbi8vIEFsaWFzIG1ldGhvZHNcclxuU1ZHLlNldC5pbmhlcml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIG1cclxuICAgICwgbWV0aG9kcyA9IFtdXHJcblxyXG4gIC8vIGdhdGhlciBzaGFwZSBtZXRob2RzXHJcbiAgZm9yKHZhciBtIGluIFNWRy5TaGFwZS5wcm90b3R5cGUpXHJcbiAgICBpZiAodHlwZW9mIFNWRy5TaGFwZS5wcm90b3R5cGVbbV0gPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU1ZHLlNldC5wcm90b3R5cGVbbV0gIT0gJ2Z1bmN0aW9uJylcclxuICAgICAgbWV0aG9kcy5wdXNoKG0pXHJcblxyXG4gIC8vIGFwcGx5IHNoYXBlIGFsaWFzc2VzXHJcbiAgbWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xyXG4gICAgU1ZHLlNldC5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSB0aGlzLm1lbWJlcnMubGVuZ3RoOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBpZiAodGhpcy5tZW1iZXJzW2ldICYmIHR5cGVvZiB0aGlzLm1lbWJlcnNbaV1bbWV0aG9kXSA9PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgdGhpcy5tZW1iZXJzW2ldW21ldGhvZF0uYXBwbHkodGhpcy5tZW1iZXJzW2ldLCBhcmd1bWVudHMpXHJcblxyXG4gICAgICByZXR1cm4gbWV0aG9kID09ICdhbmltYXRlJyA/ICh0aGlzLmZ4IHx8ICh0aGlzLmZ4ID0gbmV3IFNWRy5GWC5TZXQodGhpcykpKSA6IHRoaXNcclxuICAgIH1cclxuICB9KVxyXG5cclxuICAvLyBjbGVhciBtZXRob2RzIGZvciB0aGUgbmV4dCByb3VuZFxyXG4gIG1ldGhvZHMgPSBbXVxyXG5cclxuICAvLyBnYXRoZXIgZnggbWV0aG9kc1xyXG4gIGZvcih2YXIgbSBpbiBTVkcuRlgucHJvdG90eXBlKVxyXG4gICAgaWYgKHR5cGVvZiBTVkcuRlgucHJvdG90eXBlW21dID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFNWRy5GWC5TZXQucHJvdG90eXBlW21dICE9ICdmdW5jdGlvbicpXHJcbiAgICAgIG1ldGhvZHMucHVzaChtKVxyXG5cclxuICAvLyBhcHBseSBmeCBhbGlhc3Nlc1xyXG4gIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcclxuICAgIFNWRy5GWC5TZXQucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5zZXQubWVtYmVycy5sZW5ndGg7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIHRoaXMuc2V0Lm1lbWJlcnNbaV0uZnhbbWV0aG9kXS5hcHBseSh0aGlzLnNldC5tZW1iZXJzW2ldLmZ4LCBhcmd1bWVudHMpXHJcblxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcblxyXG5cblxyXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgLy8gU3RvcmUgZGF0YSB2YWx1ZXMgb24gc3ZnIG5vZGVzXHJcbiAgZGF0YTogZnVuY3Rpb24oYSwgdiwgcikge1xyXG4gICAgaWYgKHR5cGVvZiBhID09ICdvYmplY3QnKSB7XHJcbiAgICAgIGZvciAodiBpbiBhKVxyXG4gICAgICAgIHRoaXMuZGF0YSh2LCBhW3ZdKVxyXG5cclxuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmF0dHIoJ2RhdGEtJyArIGEpKVxyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdHRyKCdkYXRhLScgKyBhKVxyXG4gICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hdHRyKFxyXG4gICAgICAgICdkYXRhLScgKyBhXHJcbiAgICAgICwgdiA9PT0gbnVsbCA/XHJcbiAgICAgICAgICBudWxsIDpcclxuICAgICAgICByID09PSB0cnVlIHx8IHR5cGVvZiB2ID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdiA9PT0gJ251bWJlcicgP1xyXG4gICAgICAgICAgdiA6XHJcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeSh2KVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn0pXG5TVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCB7XHJcbiAgLy8gUmVtZW1iZXIgYXJiaXRyYXJ5IGRhdGFcclxuICByZW1lbWJlcjogZnVuY3Rpb24oaywgdikge1xyXG4gICAgLy8gcmVtZW1iZXIgZXZlcnkgaXRlbSBpbiBhbiBvYmplY3QgaW5kaXZpZHVhbGx5XHJcbiAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PSAnb2JqZWN0JylcclxuICAgICAgZm9yICh2YXIgdiBpbiBrKVxyXG4gICAgICAgIHRoaXMucmVtZW1iZXIodiwga1t2XSlcclxuXHJcbiAgICAvLyByZXRyaWV2ZSBtZW1vcnlcclxuICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSlcclxuICAgICAgcmV0dXJuIHRoaXMubWVtb3J5KClba11cclxuXHJcbiAgICAvLyBzdG9yZSBtZW1vcnlcclxuICAgIGVsc2VcclxuICAgICAgdGhpcy5tZW1vcnkoKVtrXSA9IHZcclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgLy8gRXJhc2UgYSBnaXZlbiBtZW1vcnlcclxuLCBmb3JnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMClcclxuICAgICAgdGhpcy5fbWVtb3J5ID0ge31cclxuICAgIGVsc2VcclxuICAgICAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcclxuICAgICAgICBkZWxldGUgdGhpcy5tZW1vcnkoKVthcmd1bWVudHNbaV1dXHJcblxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIC8vIEluaXRpYWxpemUgb3IgcmV0dXJuIGxvY2FsIG1lbW9yeSBvYmplY3RcclxuLCBtZW1vcnk6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX21lbW9yeSB8fCAodGhpcy5fbWVtb3J5ID0ge30pXHJcbiAgfVxyXG5cclxufSlcbi8vIE1ldGhvZCBmb3IgZ2V0dGluZyBhbiBlbGVtZW50IGJ5IGlkXHJcblNWRy5nZXQgPSBmdW5jdGlvbihpZCkge1xyXG4gIHZhciBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRGcm9tUmVmZXJlbmNlKGlkKSB8fCBpZClcclxuICByZXR1cm4gU1ZHLmFkb3B0KG5vZGUpXHJcbn1cclxuXHJcbi8vIFNlbGVjdCBlbGVtZW50cyBieSBxdWVyeSBzdHJpbmdcclxuU1ZHLnNlbGVjdCA9IGZ1bmN0aW9uKHF1ZXJ5LCBwYXJlbnQpIHtcclxuICByZXR1cm4gbmV3IFNWRy5TZXQoXHJcbiAgICBTVkcudXRpbHMubWFwKChwYXJlbnQgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpLCBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgIHJldHVybiBTVkcuYWRvcHQobm9kZSlcclxuICAgIH0pXHJcbiAgKVxyXG59XHJcblxyXG5TVkcuZXh0ZW5kKFNWRy5QYXJlbnQsIHtcclxuICAvLyBTY29wZWQgc2VsZWN0IG1ldGhvZFxyXG4gIHNlbGVjdDogZnVuY3Rpb24ocXVlcnkpIHtcclxuICAgIHJldHVybiBTVkcuc2VsZWN0KHF1ZXJ5LCB0aGlzLm5vZGUpXHJcbiAgfVxyXG5cclxufSlcbmZ1bmN0aW9uIHBhdGhSZWdSZXBsYWNlKGEsIGIsIGMsIGQpIHtcclxuICByZXR1cm4gYyArIGQucmVwbGFjZShTVkcucmVnZXguZG90cywgJyAuJylcclxufVxyXG5cclxuLy8gY3JlYXRlcyBkZWVwIGNsb25lIG9mIGFycmF5XHJcbmZ1bmN0aW9uIGFycmF5X2Nsb25lKGFycil7XHJcbiAgdmFyIGNsb25lID0gYXJyLnNsaWNlKDApXHJcbiAgZm9yKHZhciBpID0gY2xvbmUubGVuZ3RoOyBpLS07KXtcclxuICAgIGlmKEFycmF5LmlzQXJyYXkoY2xvbmVbaV0pKXtcclxuICAgICAgY2xvbmVbaV0gPSBhcnJheV9jbG9uZShjbG9uZVtpXSlcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGNsb25lXHJcbn1cclxuXHJcbi8vIHRlc3RzIGlmIGEgZ2l2ZW4gZWxlbWVudCBpcyBpbnN0YW5jZSBvZiBhbiBvYmplY3RcclxuZnVuY3Rpb24gaXMoZWwsIG9iail7XHJcbiAgcmV0dXJuIGVsIGluc3RhbmNlb2Ygb2JqXHJcbn1cclxuXHJcbi8vIHRlc3RzIGlmIGEgZ2l2ZW4gc2VsZWN0b3IgbWF0Y2hlcyBhbiBlbGVtZW50XHJcbmZ1bmN0aW9uIG1hdGNoZXMoZWwsIHNlbGVjdG9yKSB7XHJcbiAgcmV0dXJuIChlbC5tYXRjaGVzIHx8IGVsLm1hdGNoZXNTZWxlY3RvciB8fCBlbC5tc01hdGNoZXNTZWxlY3RvciB8fCBlbC5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGVsLm9NYXRjaGVzU2VsZWN0b3IpLmNhbGwoZWwsIHNlbGVjdG9yKTtcclxufVxyXG5cclxuLy8gQ29udmVydCBkYXNoLXNlcGFyYXRlZC1zdHJpbmcgdG8gY2FtZWxDYXNlXHJcbmZ1bmN0aW9uIGNhbWVsQ2FzZShzKSB7XHJcbiAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8tKC4pL2csIGZ1bmN0aW9uKG0sIGcpIHtcclxuICAgIHJldHVybiBnLnRvVXBwZXJDYXNlKClcclxuICB9KVxyXG59XHJcblxyXG4vLyBDYXBpdGFsaXplIGZpcnN0IGxldHRlciBvZiBhIHN0cmluZ1xyXG5mdW5jdGlvbiBjYXBpdGFsaXplKHMpIHtcclxuICByZXR1cm4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSlcclxufVxyXG5cclxuLy8gRW5zdXJlIHRvIHNpeC1iYXNlZCBoZXhcclxuZnVuY3Rpb24gZnVsbEhleChoZXgpIHtcclxuICByZXR1cm4gaGV4Lmxlbmd0aCA9PSA0ID9cclxuICAgIFsgJyMnLFxyXG4gICAgICBoZXguc3Vic3RyaW5nKDEsIDIpLCBoZXguc3Vic3RyaW5nKDEsIDIpXHJcbiAgICAsIGhleC5zdWJzdHJpbmcoMiwgMyksIGhleC5zdWJzdHJpbmcoMiwgMylcclxuICAgICwgaGV4LnN1YnN0cmluZygzLCA0KSwgaGV4LnN1YnN0cmluZygzLCA0KVxyXG4gICAgXS5qb2luKCcnKSA6IGhleFxyXG59XHJcblxyXG4vLyBDb21wb25lbnQgdG8gaGV4IHZhbHVlXHJcbmZ1bmN0aW9uIGNvbXBUb0hleChjb21wKSB7XHJcbiAgdmFyIGhleCA9IGNvbXAudG9TdHJpbmcoMTYpXHJcbiAgcmV0dXJuIGhleC5sZW5ndGggPT0gMSA/ICcwJyArIGhleCA6IGhleFxyXG59XHJcblxyXG4vLyBDYWxjdWxhdGUgcHJvcG9ydGlvbmFsIHdpZHRoIGFuZCBoZWlnaHQgdmFsdWVzIHdoZW4gbmVjZXNzYXJ5XHJcbmZ1bmN0aW9uIHByb3BvcnRpb25hbFNpemUoZWxlbWVudCwgd2lkdGgsIGhlaWdodCkge1xyXG4gIGlmICh3aWR0aCA9PSBudWxsIHx8IGhlaWdodCA9PSBudWxsKSB7XHJcbiAgICB2YXIgYm94ID0gZWxlbWVudC5iYm94KClcclxuXHJcbiAgICBpZiAod2lkdGggPT0gbnVsbClcclxuICAgICAgd2lkdGggPSBib3gud2lkdGggLyBib3guaGVpZ2h0ICogaGVpZ2h0XHJcbiAgICBlbHNlIGlmIChoZWlnaHQgPT0gbnVsbClcclxuICAgICAgaGVpZ2h0ID0gYm94LmhlaWdodCAvIGJveC53aWR0aCAqIHdpZHRoXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgd2lkdGg6ICB3aWR0aFxyXG4gICwgaGVpZ2h0OiBoZWlnaHRcclxuICB9XHJcbn1cclxuXHJcbi8vIERlbHRhIHRyYW5zZm9ybSBwb2ludFxyXG5mdW5jdGlvbiBkZWx0YVRyYW5zZm9ybVBvaW50KG1hdHJpeCwgeCwgeSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB4OiB4ICogbWF0cml4LmEgKyB5ICogbWF0cml4LmMgKyAwXHJcbiAgLCB5OiB4ICogbWF0cml4LmIgKyB5ICogbWF0cml4LmQgKyAwXHJcbiAgfVxyXG59XHJcblxyXG4vLyBNYXAgbWF0cml4IGFycmF5IHRvIG9iamVjdFxyXG5mdW5jdGlvbiBhcnJheVRvTWF0cml4KGEpIHtcclxuICByZXR1cm4geyBhOiBhWzBdLCBiOiBhWzFdLCBjOiBhWzJdLCBkOiBhWzNdLCBlOiBhWzRdLCBmOiBhWzVdIH1cclxufVxyXG5cclxuLy8gUGFyc2UgbWF0cml4IGlmIHJlcXVpcmVkXHJcbmZ1bmN0aW9uIHBhcnNlTWF0cml4KG1hdHJpeCkge1xyXG4gIGlmICghKG1hdHJpeCBpbnN0YW5jZW9mIFNWRy5NYXRyaXgpKVxyXG4gICAgbWF0cml4ID0gbmV3IFNWRy5NYXRyaXgobWF0cml4KVxyXG5cclxuICByZXR1cm4gbWF0cml4XHJcbn1cclxuXHJcbi8vIEFkZCBjZW50cmUgcG9pbnQgdG8gdHJhbnNmb3JtIG9iamVjdFxyXG5mdW5jdGlvbiBlbnN1cmVDZW50cmUobywgdGFyZ2V0KSB7XHJcbiAgby5jeCA9IG8uY3ggPT0gbnVsbCA/IHRhcmdldC5iYm94KCkuY3ggOiBvLmN4XHJcbiAgby5jeSA9IG8uY3kgPT0gbnVsbCA/IHRhcmdldC5iYm94KCkuY3kgOiBvLmN5XHJcbn1cclxuXHJcbi8vIFBhdGhBcnJheSBIZWxwZXJzXHJcbmZ1bmN0aW9uIGFycmF5VG9TdHJpbmcoYSkge1xyXG4gIGZvciAodmFyIGkgPSAwLCBpbCA9IGEubGVuZ3RoLCBzID0gJyc7IGkgPCBpbDsgaSsrKSB7XHJcbiAgICBzICs9IGFbaV1bMF1cclxuXHJcbiAgICBpZiAoYVtpXVsxXSAhPSBudWxsKSB7XHJcbiAgICAgIHMgKz0gYVtpXVsxXVxyXG5cclxuICAgICAgaWYgKGFbaV1bMl0gIT0gbnVsbCkge1xyXG4gICAgICAgIHMgKz0gJyAnXHJcbiAgICAgICAgcyArPSBhW2ldWzJdXHJcblxyXG4gICAgICAgIGlmIChhW2ldWzNdICE9IG51bGwpIHtcclxuICAgICAgICAgIHMgKz0gJyAnXHJcbiAgICAgICAgICBzICs9IGFbaV1bM11cclxuICAgICAgICAgIHMgKz0gJyAnXHJcbiAgICAgICAgICBzICs9IGFbaV1bNF1cclxuXHJcbiAgICAgICAgICBpZiAoYVtpXVs1XSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHMgKz0gJyAnXHJcbiAgICAgICAgICAgIHMgKz0gYVtpXVs1XVxyXG4gICAgICAgICAgICBzICs9ICcgJ1xyXG4gICAgICAgICAgICBzICs9IGFbaV1bNl1cclxuXHJcbiAgICAgICAgICAgIGlmIChhW2ldWzddICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICBzICs9ICcgJ1xyXG4gICAgICAgICAgICAgIHMgKz0gYVtpXVs3XVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcyArICcgJ1xyXG59XHJcblxyXG4vLyBEZWVwIG5ldyBpZCBhc3NpZ25tZW50XHJcbmZ1bmN0aW9uIGFzc2lnbk5ld0lkKG5vZGUpIHtcclxuICAvLyBkbyB0aGUgc2FtZSBmb3IgU1ZHIGNoaWxkIG5vZGVzIGFzIHdlbGxcclxuICBmb3IgKHZhciBpID0gbm9kZS5jaGlsZE5vZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxyXG4gICAgaWYgKG5vZGUuY2hpbGROb2Rlc1tpXSBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50KVxyXG4gICAgICBhc3NpZ25OZXdJZChub2RlLmNoaWxkTm9kZXNbaV0pXHJcblxyXG4gIHJldHVybiBTVkcuYWRvcHQobm9kZSkuaWQoU1ZHLmVpZChub2RlLm5vZGVOYW1lKSlcclxufVxyXG5cclxuLy8gQWRkIG1vcmUgYm91bmRpbmcgYm94IHByb3BlcnRpZXNcclxuZnVuY3Rpb24gZnVsbEJveChiKSB7XHJcbiAgaWYgKGIueCA9PSBudWxsKSB7XHJcbiAgICBiLnggICAgICA9IDBcclxuICAgIGIueSAgICAgID0gMFxyXG4gICAgYi53aWR0aCAgPSAwXHJcbiAgICBiLmhlaWdodCA9IDBcclxuICB9XHJcblxyXG4gIGIudyAgPSBiLndpZHRoXHJcbiAgYi5oICA9IGIuaGVpZ2h0XHJcbiAgYi54MiA9IGIueCArIGIud2lkdGhcclxuICBiLnkyID0gYi55ICsgYi5oZWlnaHRcclxuICBiLmN4ID0gYi54ICsgYi53aWR0aCAvIDJcclxuICBiLmN5ID0gYi55ICsgYi5oZWlnaHQgLyAyXHJcblxyXG4gIHJldHVybiBiXHJcbn1cclxuXHJcbi8vIEdldCBpZCBmcm9tIHJlZmVyZW5jZSBzdHJpbmdcclxuZnVuY3Rpb24gaWRGcm9tUmVmZXJlbmNlKHVybCkge1xyXG4gIHZhciBtID0gdXJsLnRvU3RyaW5nKCkubWF0Y2goU1ZHLnJlZ2V4LnJlZmVyZW5jZSlcclxuXHJcbiAgaWYgKG0pIHJldHVybiBtWzFdXHJcbn1cclxuXHJcbi8vIENyZWF0ZSBtYXRyaXggYXJyYXkgZm9yIGxvb3BpbmdcclxudmFyIGFiY2RlZiA9ICdhYmNkZWYnLnNwbGl0KCcnKVxuLy8gQWRkIEN1c3RvbUV2ZW50IHRvIElFOSBhbmQgSUUxMFxyXG5pZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gIC8vIENvZGUgZnJvbTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0N1c3RvbUV2ZW50XHJcbiAgdmFyIEN1c3RvbUV2ZW50ID0gZnVuY3Rpb24oZXZlbnQsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHsgYnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlLCBkZXRhaWw6IHVuZGVmaW5lZCB9XHJcbiAgICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpXHJcbiAgICBlLmluaXRDdXN0b21FdmVudChldmVudCwgb3B0aW9ucy5idWJibGVzLCBvcHRpb25zLmNhbmNlbGFibGUsIG9wdGlvbnMuZGV0YWlsKVxyXG4gICAgcmV0dXJuIGVcclxuICB9XHJcblxyXG4gIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGVcclxuXHJcbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnRcclxufVxyXG5cclxuLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIC8gY2FuY2VsQW5pbWF0aW9uRnJhbWUgUG9seWZpbGwgd2l0aCBmYWxsYmFjayBiYXNlZCBvbiBQYXVsIElyaXNoXHJcbihmdW5jdGlvbih3KSB7XHJcbiAgdmFyIGxhc3RUaW1lID0gMFxyXG4gIHZhciB2ZW5kb3JzID0gWydtb3onLCAnd2Via2l0J11cclxuXHJcbiAgZm9yKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgIHcucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICB3LmNhbmNlbEFuaW1hdGlvbkZyYW1lICA9IHdbdmVuZG9yc1t4XSArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXVxyXG4gIH1cclxuXHJcbiAgdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSlcclxuXHJcbiAgICAgIHZhciBpZCA9IHcuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpXHJcbiAgICAgIH0sIHRpbWVUb0NhbGwpXHJcblxyXG4gICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbFxyXG4gICAgICByZXR1cm4gaWRcclxuICAgIH1cclxuXHJcbiAgdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHcuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHwgdy5jbGVhclRpbWVvdXQ7XHJcblxyXG59KHdpbmRvdykpXHJcblxyXG5yZXR1cm4gU1ZHXHJcblxyXG59KSk7XHJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdmcuanMvZGlzdC9zdmcuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgZGF5c0luTW9udGggfSBmcm9tICcuL2hlbHBlcidcblxuY29uc3QgR0NHcmFwaCA9IGlkID0+IHtcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGVsZW1lbnQuaW5uZXJIVE1MID0gJ0NvbnRyaWJ1dGlvbnMnXG4gIGVsZW1lbnQuaWQgPSBpZFxuXG4gIHJldHVybiBlbGVtZW50XG59XG5cbmNvbnN0IGRyYXdHQ0dyYXBoID0gKGRyYXcsIHsgZm9udCwgY3VycmVudFllYXIsIGN1cnJlbnRNb250aCwgYm94U2l6ZSwgYm94ZXMsIGxpbWl0LCBwYWRkaW5nLCB0b29sdGlwLCBtb250aE5hbWVzIH0pID0+IHtcbiAgLy8gR2xvYmFsXG4gIGNvbnN0IGJveFNpemVQYWRkaW5nID0gYm94U2l6ZSArIHBhZGRpbmdcbiAgY29uc3QgbW9udGhIZWlnaHQgPSAyNFxuICBsZXQgb2Zmc2V0WCA9IDBcbiAgbGV0IG9mZnNldFkgPSAwXG5cbiAgLy8gRGF5c1xuICBjb25zdCBkYXlPZmZzZXRYID0gb2Zmc2V0WFxuICBjb25zdCBkYXlPZmZzZXRZID0gb2Zmc2V0WSArIG1vbnRoSGVpZ2h0XG4gIGxldCBkYXlZID0gYm94U2l6ZVBhZGRpbmcgLy8gU3RhcnQgYXQgU3VuZGF5XG4gIGNvbnN0IGRyYXdEYXlzID0gWydNb24nLCAnV2VkJywgJ0ZyaSddXG4gIGRyYXdEYXlzLm1hcCgoZGF5LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHRleHQgPSBkcmF3LnRleHQoZGF5KVxuICAgIHRleHQuZm9udChmb250KS5tb3ZlKGRheU9mZnNldFgsIGRheU9mZnNldFkgKyBkYXlZKVxuICAgIGRheVkgKz0gYm94U2l6ZVBhZGRpbmcgKiAyXG4gIH0pXG4gIG9mZnNldFggKz0gMjZcblxuICAvLyBNb250aHNcbiAgY29uc3QgbW9udGhPZmZzZXRYID0gb2Zmc2V0WFxuICBjb25zdCBtb250aE9mZnNldFkgPSBvZmZzZXRZICsgNlxuICBjb25zdCBtb250aHMgPSBtb250aE5hbWVzLm1hcCgobmFtZSwgaSkgPT4gKHsgbmFtZSwgZGF5czogZGF5c0luTW9udGgoaSwgY3VycmVudFllYXIpIH0pKVxuXG4gIGNvbnN0IHNsaWRlTW9udGhzID0gbW9udGhzLnNsaWNlKGN1cnJlbnRNb250aCwgMTIpLmNvbmNhdChtb250aHMuc2xpY2UoMCwgY3VycmVudE1vbnRoKSlcblxuICBsZXQgZGF5c0luTW9udGhTdW0gPSAwXG4gIHNsaWRlTW9udGhzLm1hcCgobW9udGgsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgbW9udGhYID0gTWF0aC5mbG9vcihkYXlzSW5Nb250aFN1bSAvIDcpICogYm94U2l6ZVBhZGRpbmdcbiAgICBsZXQgdGV4dCA9IGRyYXcudGV4dChzbGlkZU1vbnRoc1tpbmRleF0ubmFtZSlcbiAgICB0ZXh0LmZvbnQoZm9udCkubW92ZShtb250aE9mZnNldFggKyBtb250aFgsIG1vbnRoT2Zmc2V0WSlcblxuICAgIC8vIG5leHRcbiAgICBkYXlzSW5Nb250aFN1bSArPSBtb250aC5kYXlzXG4gIH0pXG4gIG9mZnNldFkgKz0gbW9udGhIZWlnaHRcblxuICAvLyBCb3hlc1xuICBjb25zdCBib3hPZmZzZXRYID0gb2Zmc2V0WFxuICBjb25zdCBib3hPZmZzZXRZID0gb2Zmc2V0WVxuICBib3hlcy5tYXAoKGJveCwgaW5kZXgpID0+IHtcbiAgICAvLyBQb3NpdGlvbnNcbiAgICBjb25zdCBpID0gYm94T2Zmc2V0WCArIGJveFNpemVQYWRkaW5nICogTWF0aC5mbG9vcihpbmRleCAvIGxpbWl0KVxuICAgIGNvbnN0IGogPSBib3hPZmZzZXRZICsgYm94U2l6ZVBhZGRpbmcgKiAoaW5kZXggJSBsaW1pdClcblxuICAgIC8vIFNoYXBlXG4gICAgY29uc3QgZWxlbWVudCA9IGRyYXcucmVjdChib3hTaXplLCBib3hTaXplKS5tb3ZlKGksIGopLmZpbGwoYm94LmNvbG9yKVxuICAgIGVsZW1lbnQuaWQgPSBib3guaWRcbiAgICBlbGVtZW50LmRhdGEgPSBib3guZGF0YVxuICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3Rvb2x0aXAnKVxuICAgIGNvbnN0IHBvc2l0aW9uID0geyB4OiBpICsgYm94U2l6ZSAtIHBhZGRpbmcgLyAyLCB5OiBqIH1cbiAgICBlbGVtZW50Lm1vdXNlb3ZlcigoKSA9PiB0b29sdGlwLnNob3coYm94LmlkLCBwb3NpdGlvbiwgZWxlbWVudC5kYXRhKSlcbiAgICBlbGVtZW50LmNsaWNrKCgpID0+IHRvb2x0aXAudG9nZ2xlKGJveC5pZCwgcG9zaXRpb24sIGVsZW1lbnQuZGF0YSkpXG4gICAgZWxlbWVudC5tb3VzZW91dCgoKSA9PiB0b29sdGlwLmhpZGUoKSlcbiAgfSlcbn1cblxuZXhwb3J0IHsgR0NHcmFwaCwgZHJhd0dDR3JhcGggfVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvZ3JhcGguanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgZGF5c0luTW9udGggPSAobW9udGgsIHllYXIpID0+IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXRlKClcblxuZXhwb3J0IHsgZGF5c0luTW9udGggfVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaGVscGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IEdDVG9vbHRpcCA9IGJ1YmJsZVdpZHRoID0+IHtcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBlbGVtZW50LmlkID0gJ3Rvb2x0aXB0ZXh0J1xuICBlbGVtZW50LmNsYXNzTmFtZSA9ICd0b29sdGlwdGV4dCdcbiAgZWxlbWVudC5pbm5lckhUTUwgPSAnSGlAISdcblxuICBlbGVtZW50LnNob3cgPSAoaWQsIHBvc2l0aW9uLCBkYXRhKSA9PiB7XG4gICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnXG4gICAgZWxlbWVudC5maXJzdENoaWxkLmRhdGEgPSBkYXRhXG4gICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7cG9zaXRpb24ueCAtIGJ1YmJsZVdpZHRoIC8gMn1weGBcbiAgICBlbGVtZW50LnN0eWxlLnRvcCA9IGAke3Bvc2l0aW9uLnl9cHhgXG4gICAgZWxlbWVudC50YXJnZXQgPSBpZFxuICB9XG5cbiAgZWxlbWVudC5oaWRlID0gKCkgPT4ge1xuICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nXG4gICAgZWxlbWVudC50YXJnZXQgPSBudWxsXG4gIH1cblxuICBlbGVtZW50LnRvZ2dsZSA9IChpZCwgcG9zaXRpb24sIGRhdGEpID0+IHtcbiAgICBjb25zb2xlLmxvZygpXG4gICAgaWYgKGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9PT0gJ2hpZGRlbicgJiYgZWxlbWVudC50YXJnZXQgIT09IGlkKSBlbGVtZW50LnNob3coaWQsIHBvc2l0aW9uLCBkYXRhKVxuICAgIGVsc2UgZWxlbWVudC5oaWRlKClcbiAgfVxuXG4gIGFkZFN0eWxlKGJ1YmJsZVdpZHRoKVxuXG4gIHJldHVybiBlbGVtZW50XG59XG5cbmNvbnN0IGFkZFN0eWxlID0gYnViYmxlV2lkdGggPT4ge1xuICBjb25zdCBjc3MgPSBgXG4udG9vbHRpcHRleHQge1xuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgICBmb250LWZhbWlseTonSGVsdmV0aWNhJztcbiAgICBmb250LXNpemU6IDAuOGVtO1xuICAgIHdpZHRoOiAke2J1YmJsZVdpZHRofXB4O1xuICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xuICAgIGNvbG9yOiAjZmZmO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBwYWRkaW5nOiA0cHg7XG4gICAgYm9yZGVyLXJhZGl1czogNnB4O1xuIFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB6LWluZGV4OiAxO1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuXG4udG9vbHRpcHRleHQ6OmFmdGVyIHtcbiAgICBjb250ZW50OiBcIiBcIjtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAxMDAlO1xuICAgIGxlZnQ6IDUwJTtcbiAgICBtYXJnaW4tbGVmdDogLTVweDtcbiAgICBib3JkZXItd2lkdGg6IDVweDtcbiAgICBib3JkZXItc3R5bGU6IHNvbGlkO1xuICAgIGJvcmRlci1jb2xvcjogYmxhY2sgdHJhbnNwYXJlbnQgdHJhbnNwYXJlbnQgdHJhbnNwYXJlbnQ7XG59XG5gXG4gIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF1cbiAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG5cbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2NzcydcbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3NcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKVxuICB9XG5cbiAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSlcbn1cbmV4cG9ydCB7IEdDVG9vbHRpcCB9XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90b29sdGlwLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGNvbmZpZyA9IHtcbiAgaWQ6ICdnY2cnLFxuICB3OiAnMTAwJScsXG4gIGg6ICcxMDAlJyxcbiAgZm9udDoge1xuICAgIGZhbWlseTogJ0hlbHZldGljYScsXG4gICAgc2l6ZTogOVxuICB9LFxuICBsaW1pdDogNyxcbiAgcGFkZGluZzogMixcbiAgYm94U2l6ZTogMTAsXG4gIGJ1YmJsZVdpZHRoOiAyMjAsXG4gIG1vbnRoTmFtZXM6IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLCAnT2N0JywgJ05vdicsICdEZWMnXVxufVxuZXhwb3J0IHsgY29uZmlnIH1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbmZpZy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBUaGlzIGlzIG1vY2sgZGF0YSBmb3IgdGVzdGluZyBwdXJwb3NlXG5jb25zdCBnZXRCb3hlcyA9IGN1cnJlbnRZZWFyID0+IHtcbiAgY29uc3QgY29udHJpYnV0ZU9yTm90ID0gKGNvdW50LCBhdCkgPT4gKGNvdW50ID09PSAwID8gJ05vIGNvbnRyaWJ1dGlvbnMnIDogYCR7Y291bnR9IGNvbnRyaWJ1dGlvbnNgKVxuICBjb25zdCBNQVhfREFZID0gMzY1XG4gIGxldCBib3hlcyA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgTUFYX0RBWTsgaSsrKSB7XG4gICAgYm94ZXMucHVzaCh7XG4gICAgICBpZDogYGIke2l9YCxcbiAgICAgIGNvbG9yOiBbJyNlY2YwZjEnLCAnIzJlY2M3MScsICcjZjFjNDBmJywgJyNmMzljMTInLCAnI2U2N2UyMicsICcjZDM1NDAwJywgJyNlNzRjM2MnXVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA3KV0sXG4gICAgICBkYXRhOiBgJHtjb250cmlidXRlT3JOb3QoTWF0aC5mbG9vcigxMCAqIE1hdGgucmFuZG9tKCkpKX0gb24gJHtuZXcgRGF0ZShjdXJyZW50WWVhciwgMCwgaSkudG9EYXRlU3RyaW5nKCl9YFxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gYm94ZXNcbn1cblxuZXhwb3J0IHsgZ2V0Qm94ZXMgfVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2VlZGVyLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=