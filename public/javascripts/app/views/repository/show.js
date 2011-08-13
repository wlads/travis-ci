Travis.Views.Repository.Show = Backbone.View.extend({
  tabs: {},
  initialize: function() {
    _.extend(this, this.options);
    _.bindAll(this, 'repositorySelected', 'createTab', 'renderTab', 'activateTab');

    this.template = Travis.templates['repository/show'];
  },
  render: function() {
    this.el = $(this.template({}));

    _.each(['current', 'history', 'build'], this.createTab);
    _.each(this.tabs, this.renderTab);

    this.setTitle();

    this.activateTab('current')
    return this
  },
  activateTab: function(name) {
    _.each(this.tabs, function(tab) { if(tab.name != name) tab.deactivate(); })
    this.tabs[name].activate();
  },
  createTab: function(name) {
    this.tabs[name] = new Travis.Views.Repository.Tab({ name: name, parent: this, model: this.model });
  },
  renderTab: function(tab) {
    this.el.find('.tabs').append(tab.render().el);
  },
  setTitle: function() {
    this.el.find('h3 a:first-child').attr('href', 'http://github.com/' + this.model.get('slug')).text(this.model.get('slug'));
    this.el.updateGithubStats(this.model);
  }
});
