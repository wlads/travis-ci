Travis.Views.Repositories.Tab = Backbone.View.extend({
  initialize: function() {
    _.extend(this, this.options);
    _.bindAll(this, 'render', 'attachTo', 'activate', 'deactivate', 'updateTab');

    this.template = Travis.templates['repositories/tab'];
  },
  render: function() {
    this.el = $(this.template({name: this.name, label: this.label}));
    this.content = new Travis.Views.Repositories.List();
    this.el.find('.tab').html(this.content.render().el);
    return this;
  },
  detach: function() {
    this.content.detach();
  },
  attachTo: function(repositoryList) {
    this.detach();
    this.content.attachTo(repositoryList);
  },
  activate: function() {
    this.el.last().addClass('active');
  },
  deactivate: function() {
    this.el.last().removeClass('active');
  },
  updateTab: function(el) {
    this.content.updateTab(this.el);
  }    
});
