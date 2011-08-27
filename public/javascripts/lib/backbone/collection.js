/*
 TODO: Actually, after looking @ SproutCore, i've got an idea about DataStore.
 it could be easily implemented on that level. All we need is 2 things: know wether the model
 is fully or partially loaded (to server-fetch modes that are loaded just partially) and
 persistence on the Object, not instance level (speaking more in OOP, not prototype terms) - ifesdjeen

 Turns out that before we can do so, we should implement a normal object model in JS.

 The main purpose of Store is to allow to use 1 instance of model all over the place
 */
Travis.Store = {};

Travis.Collections.Base = Backbone.Collection.extend({
  fetched: false,
  fetching: false,
  initialize: function() {
    Backbone.Collection.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'whenFetched', 'select', 'selectLast', 'selectLastBy', 'deselect', 'getOrFetchLast', 'getOrFetchLastBy', 'getBy', 'synchronousFetch', 'getOrFetch');
  },
  getStore: function() {
    var store = undefined;
    _.each(Travis.Collections, _.bind(function(model_klass, klass_name) {
      if (this instanceof model_klass) {
        if (Travis.Store[klass_name]) {
          store = Travis.Store[klass_name];
        }
        else {
          Travis.Store[klass_name] = new Backbone.Collection();
          store = Travis.Store[klass_name];
        }
      }
    }, this));
    return store;
  },
  add: function(models, options) {
    if (_.isArray(models)) {
      for (var i = 0, l = models.length; i < l; i++) {
        var model = this._add(models[i], options);
        if (model) {
          if (this.getStore().indexOf(model) > 0) {
            this.getStore().add(model);            
          } else {
            this.getStore().add(model, { at: this.getStore().indexOf(model) });
          }
        }
      }
    } else {
      var model = this._add(models, options);
      if (model) {
        if (this.getStore().indexOf(model) > 0) {
          this.getStore().add(model);            
        } else {
          this.getStore().add(model, { at: this.getStore().indexOf(model) });
        }
      }
    }
    return this;
  },
  get: function(id) {
    if (id == null) return null;
    var model = this._byId[id.id != null ? id.id : id];
    if (_.isUndefined(model)) {
      return this.getStore().get(id);
    } else {
      return model;
    }
  },
  fetch: function(options) {
    options || (options = {});
    var collection = this;
    this.startFetching();
    var success = function(resp) {
      collection[options.add ? 'add' : 'refresh'](collection.parse(resp));
      if (options.success) options.success(collection, resp);
    };
    var error = Backbone.wrapError(options.error, collection, options);
    (this.sync || Travis.sync)('read', this, success, error, options);
    this.finishFetching();
    return this;
  },
  whenFetched: function(callback, options) {
    if(!this.fetched || this.fetching) {
      var _callback = function() { this.unbind('fetched', _callback); return callback(this, options); }.bind(this);
      this.bind('fetched', _callback);
      if(!this.fetching) this.fetch();
    } else {
      callback(this, options);
    }
  },
  selected: function() {
    return this.detect(function(element) { return element.selected; }) || this.first();
  },
  select: function(id) {
    this.getOrFetch(id, function(element) { if(element) element.select(); });
  },
  selectLast: function() {
    this.getOrFetchLast(function(element) { if(element) element.select(); });
  },
  selectLastBy: function(options) {
    this.getOrFetchLastBy(options, function(element) { if(element) element.select(); });
  },
  deselect: function() {
    var element = this.selected();
    if(element) element.deselect();
  },
  getOrFetchLast: function(callback) {
    if(this.length > 0) {
      callback(this.last());
    } else {
      this.fetch({ success: function() { callback(this.last()); }.bind(this) });
    }
  },
  getOrFetchLastBy: function(options, callback) {
    var element = this.getBy(options);

    if(element) {
      callback(element);
    } else {
      // var model = new this.model(options, { collection: this });
      var model = this.synchronousFetch(options)
      callback(model);
      this.add(model, { silent: true })
      model.collection.trigger('select', model)

      // model.fetch({ success: function(model) {
      //   callback(model);
      //   this.add(model, { silent: true })
      //   model.collection.trigger('select', model)
      // }.bind(this) });
    }
  },
  synchronousFetchById: function(id) {
    return this.synchronousFetch({ id: id })
  },
  synchronousFetch: function(options) {
    var model = new this.model(options, { collection: this })
    model.fetch({ async: false })
    return model
  },
  getBy: function(options) {
    return this.detect(function(element) {
      return _.all(options, function(value, name) { return element.get(name) == value; })
    });
  },
  getOrFetch: function(id, callback) {
    var element = this.get(id);
    if(element) {
      callback(element);
    } else {
      var model = this.synchronousFetchById(id);
      if(model.get('parent_id')) {
        this.getOrFetch(model.get('parent_id'), function(parent) {
          callback(parent.matrix.get(id));
        });
      } else {
        this.add(model, { silent: true });
        callback(model);
      }
    }
    this.trigger('finish_get_or_fetch');
  },
  startFetching: function() {
    this.fetching = true;
    this.trigger('fetch');
  },
  finishFetching: function() {
    this.trigger('fetched');
    this.fetched = true;
    this.fetching = false;
  },
});

