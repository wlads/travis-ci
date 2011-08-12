Travis.Collections.Base = Backbone.Collection.extend({
  fetched: false,
  fetching: false,
  initialize: function() {
    Backbone.Collection.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'whenFetched', 'select', 'selectLast', 'selectLastBy', 'deselect', 'getOrFetchLast', 'getOrFetchLastBy', 'getBy', 'synchronousFetch', 'getOrFetch');
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

    // options = options || {};
    // var collection = this;
    // this.startFetching();
    // return Backbone.Collection.prototype.fetch.call(this, {
    //   success: function() {
    //     if(options.success) options.success.apply(this, arguments);
    //     collection.finishFetching();
    //   }.bind(this),
    //   error: function(e) {
    //     if(options.error) options.error.apply(this, arguments);
    //     collection.finishFetching();
    //   }.bind(this)
    // });
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

