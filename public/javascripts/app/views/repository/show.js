Travis.Views.Repository.Show = Backbone.View.extend({
  tabs: {},
  initialize: function() {
    _.extend(this, this.options);
    _.bindAll(this, 'repositorySelected', 'createTab', 'renderTab', 'activateTab', 'selectTab');

    this.template = Travis.templates['repository/show'];
  },
  render: function() {
    this.el = $(this.template({}));
    this.setTitle();
    return this;
  },
  activateTab: function(name) {
    _.each(this.tabs, function(tab) { if(tab.name != name) tab.deactivate(); })
    this.tabs[name].activate();
  },
  selectTab: function(name) {
    this.createTab(name)
    this.renderTab(name)
    this.activateTab(name)
  },
  createTab: function(name) {
    this.tabs[name] = new Travis.Views.Repository.Tab({ name: name, parent: this, model: this.model });
  },
  renderTab: function(name) {
    this.el.find('.tabs').append(this.tabs[name].render().el);
  },
  setTitle: function() {
    this.el.find('h3 a:first-child').attr('href', 'http://github.com/' + this.model.get('slug')).text(this.model.get('slug'));
    this.el.updateGithubStats(this.model);
  }
});
