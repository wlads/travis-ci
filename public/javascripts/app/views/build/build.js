Travis.Views.Build.Build = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'attachTo', 'buildSelected', 'buildConfigured', 'updateTab', '_update', 'render');
    _.extend(this, this.options);

    this.el = $('<div></div>');
    this.repository.bind('change', this.render)

  },
  render: function() {
    this.el.empty();
    this._renderSummary();
    if(this.build.matrix.length > 1) {
        this._renderMatrix();
    } else {
      this._renderLog();
    }

    this.view.append(this.el)
    return this;
  },
  updateTab: function() {
    if(this.build) {
      $('#tab_build h5 a').attr('href', '#!/' + this.repository.get('slug') + '/builds/' + this.build.id).html('Build ' + this.build.get('number'));
      $('#tab_parent').hide();
      this.build.parent(function(parent) {
        $('#tab_parent').show().find('h5 a').attr('href', '#!/' + parent.repository.get('slug') + '/builds/' + parent.id).html('Build ' + parent.get('number'));
      });
    }
  },
  _update: function() {
    if(this.build) {
    }
  },
  _renderSummary: function() {
    this.el.append(new Travis.Views.Build.Summary({ model: this.build, parent: this.repository }).render().el);
  },
  _renderLog: function() {
    this.log = new Travis.Views.Build.Log({ model: this.build, parent: this })
    this.el.append(this.log.render().el);
    this.log.initializeEvents();
    this.log.activateCurrentLine();
  },
  _renderMatrix: function() {
    this.el.append(new Travis.Views.Build.Matrix.Table({ builds: this.build.matrix }).render().el);
  },
});
