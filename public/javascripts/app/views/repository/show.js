Travis.Views.Repository.Show = Backbone.View.extend({
  tabs: {},
  initialize: function() {
    _.extend(this, this.options);
    _.bindAll(this, 'repositorySelected', 'createTab', 'renderTab', 'activateTab', 'selectTab');
    this.model.builds.fetchSynchronosly()
    this.template = Travis.templates['repository/show'];
  },
  render: function() {
    this.el = $(this.template({}));
    this.setTitle();

    _.each(this.tab_names, _.bind(function(tab_name){
      this.renderTab(tab_name)
    }, this));
    return this;
  },
  activateTab: function(name) {
    _.each(this.tabs, function(tab) { if(tab.name != name) tab.deactivate(); })
    this.tabs[name].activate();
  },
  // Somewhat ambiguous functions
  selectTab: function(name) {
    this.tabs[name].activate()
  },
  renderTab: function(name) {
    this.tabs[name] = new Travis.Views.Repository.Tab({ name: name, parent: this, model: this.model });
    this.el.find('.tabs').append(this.tabs[name].render().el);
    return this.tabs[name]
  },
  setTitle: function() {
    this.el.find('h3 a:first-child').attr('href', 'http://github.com/' + this.model.get('slug')).text(this.model.get('slug'));
    this.el.updateGithubStats(this.model);
  }
});
