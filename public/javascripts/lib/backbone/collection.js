Travis.Collections.Base = Backbone.Collection.extend({
  fetched: false,
  fetching: false,
  initialize: function() {
    Backbone.Collection.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'whenFetched', 'select', 'selectLast', 'selectLastBy', 'deselect', 'getOrFetchLast', 'getOrFetchLastBy', 'getBy', 'synchronousFetch', 'getOrFetch');
  },
  fetchSynchronosly: function(options) {
    return this.fetch(options, false)
  },
  fetch: function(options, async) {
    options || (options = {});
    var collection = this;
    this.startFetching();

    if (async === false) {
      var resp = (this.sync || Travis.sync)('read', this, null, error, false).responseText
      collection[options.add ? 'add' : 'refresh'](JSON.parse(resp));
      this.finishFetching();
    } else {
      var success = _.bind(function(resp) {
        collection[options.add ? 'add' : 'refresh'](collection.parse(resp));
        if (options.success) options.success(collection, resp);
        this.finishFetching();
      }, this);
      var error = Backbone.wrapError(options.error, collection, options);
      (this.sync || Travis.sync)('read', this, success, error, options);
    }
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
    this.getOrFetchLast(function(element) { if(element) element.select(); })
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
    }
  },
  synchronousFetchById: function(id) {
    return this.synchronousFetch({ id: id })
  },
  synchronousFetch: function(options) {
    var model = new this.model(options, { collection: this })
    model.fetchSynchronosly(options)
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

