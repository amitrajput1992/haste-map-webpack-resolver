// volontary written in ES5, so that it works with Node 4.x
var buildHasteMap = require('haste-map-provider');

function HasteMapResolverPlugin(configuration) {
    this._configuration = configuration;
    this._hasteMapPromise = null;

    var self = this;
    this.resolver = {
        apply: function(resolver) {
            resolver.plugin('module', function(request, callback) {
                self._buildHasteMap().then(function (hasteMap) {
                    var module = hasteMap.moduleMap.getModule(request.request);
                    if (module) {
                        callback(null, {
                            path: module,
                            query: request.query,
                            file: true,
                            resolved: true
                        });
                    } else {
                        callback();
                    }
                }).catch(function(error) {
                    console.log(error);
                    throw error;
                });
            });
        }
    };
}

HasteMapResolverPlugin.prototype.apply = function(compiler) {
    var self = this;

    compiler.plugin("emit", function(compilation, callback) {
        self._deleteHasteMap();
        callback();
    });
};

HasteMapResolverPlugin.prototype._buildHasteMap = function() {
    if (!this._hasteMapPromise) {
        this._hasteMapPromise = buildHasteMap(
            this._configuration.rootPath, 'haste-map-webpack-resolver');
    }

    return this._hasteMapPromise;
};

HasteMapResolverPlugin.prototype._deleteHasteMap = function() {
    this._hasteMapPromise = null;
};

module.exports = HasteMapResolverPlugin;
