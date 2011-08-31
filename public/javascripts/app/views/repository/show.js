Travis.Views.Repository.Tabs = Backbone.View.extend({
  tabs: {},
  initialize: function() {
    _.extend(this, this.options);
    _.bindAll(this, 'createTab', 'renderTab', 'setTitle')
    this.template = Travis.templates['repository/show'];
    _.each(['current', 'history', 'build'], this.createTab);
  },
  render: function() {
    this.el = $(this.template({}));
    _.each(this.tabs, this.renderTab);
    return this;
  },
  repositorySelected: function(repository) {
    this.repository = repository;
    this.setTitle();
    _.each(this.tabs, function(tab) {
      tab.attachTo(repository);
    }.bind(this));
  },
  activateTab: function(name) {
    _.each(this.tabs, function(tab) { if(tab.name != name) tab.deactivate(); })
    this.tabs[name].activate();
  },
  createTab: function(name) {
    console.log (this.tabs)
    this.tabs[name] = new Travis.Views.Repository.Tab({ name: name, parent: this  });
  },
  renderTab: function(tab) {
    this.el.find('.tabs').append(tab.render().el);
  },
  setTitle: function() {
    this.el.find('h3 a:first-child').attr('href', 'http://github.com/' + this.repository.get('slug')).text(this.repository.get('slug'));
    this.el.updateGithubStats(this.repository);
  }
});
