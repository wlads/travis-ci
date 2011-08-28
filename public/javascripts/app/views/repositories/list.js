Travis.Views.Repositories.List = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'elementAdded', 'collectionRefreshed');
    this.template = Travis.templates['repositories/list']
  },
  detach: function() {
    if(this.collection) {
      this.collection.unbind('add', this.elementAdded);
      this.collection.unbind('refresh', this.collectionRefreshed);
    }
  },
  attachTo: function(collection) {
    this.detach();
    this.collection = collection;
    this.collection.bind('add', this.elementAdded);
    this.collection.bind('refresh', this.collectionRefreshed);
  },
  render: function() {
    this.el = $(this.template({}));
    return this;
  },
  elementAdded: function(element) {
    this.el.prepend(this._renderItem(element));
  },
  collectionRefreshed: function() {
    this.el.empty();
    this.collection.each(function(element) {
      this.el.prepend(this._renderItem(element));
    }.bind(this));
  },
  _renderItem: function(element) {
    return new Travis.Views.Repositories.Item({ model: element }).render().el
  }
});

Travis.Views.Repositories.Lists = Backbone.View.extend({
  tabs: {},
  initialize: function() {
    _.bindAll(this, '_createTab', '_renderTab');
    this.template = Travis.templates['repositories/lists'];
    
    this._createTab('recent', 'Recent');
    this._createTab('mine',   'My Repositories');
  },
  attachTo: function(tabName, collection) {
    this.tabs[tabName].attachTo(collection);
  },
  activateTab: function(name) {
    _.each(this.tabs, function(tab) { if(tab.name != name) tab.deactivate(); });
    this.tabs[name].activate();
  },  
  render: function() {
    this.el = $(this.template({}));
    _.each(this.tabs, this._renderTab);
    return this;
  },
  _createTab: function(name, label) {
    this.tabs[name] = new Travis.Views.Repositories.Tab({ name: name, parent: this, label: label  });
  },
  _renderTab: function(tab) {
    this.el.append(tab.render().el);
  }
});
