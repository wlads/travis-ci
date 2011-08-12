Travis.Models.Base = Backbone.Model.extend({
  selected: false,
  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'select', 'deselect');
  },
  select: function() {
    this.collection.deselect();
    this.selected = true;
    this.trigger('select', this); // Backbone will make this trigger on the collection as well
  },
  deselect: function() {
    this.selected = false;
    this.trigger('deselect', this);
  },

  fetch : function(options) {
    options || (options = {});
    var model = this;
    var success = function(resp) {
      if (!model.set(model.parse(resp), options)) return false;
      if (options.success) options.success(model, resp);
    };
    var error = Backbone.wrapError(options.error, model, options);
    (this.sync || Travis.sync)('read', this, success, error);
    return this;
  },
});

Travis.sync = function(method, model, success, error, options) {
    var type = Backbone.methodMap[method];
    var modelJSON = (method === 'create' || method === 'update') ?
                    JSON.stringify(model.toJSON()) : null;

    // Default JSON-request options.
    var params = {
      url:          Backbone.getUrl(model) || urlError(),
      type:         type,
      contentType:  'application/json',
      data:         modelJSON,
      dataType:     'json',
      processData:  false,
      success:      success,
      error:        error
    };

    if (options && options.async == false) {
      params.async = false
    }

    // Make the request.
    $.ajax(params);
  }
