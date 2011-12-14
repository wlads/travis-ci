Travis.Helpers.Formats = {
  formattedCommit: function(object) {
    var branch = object.get('branch');
    return (object.get('commit') || '').substr(0, 7) + (branch ? ' (%@)'.fmt(branch) : '');
  },

  formattedDuration: function(object) {
    var duration = object.get('duration');
    if(!duration) duration = object.durationFrom(object.get('started_at'), object.get('finished_at'));
    return object.readableTime(duration);
  },

  formattedFinishedAt: function(object) {
    return object.timeAgoInWords(object.get('finished_at')) || '-';
  },

  formattedCompareUrl: function(object) {
    var parts = (object.get('compare_url') || '').split('/');
    return parts[parts.length - 1];
  },

  formattedConfig: function(object) {
    var config = $.only(object.get('config'), 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js');
    var values = $.map(config, function(value, key) { return '%@: %@'.fmt($.camelize(key), value.join ? value.join(', ') : value); });
    return values.length == 0 ? '-' : values.join(', ');
  },

  formattedMatrixHeaders: function(build) {
    var keys = $.keys($.only(build.get('config'), 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js'));
    return $.map(['Job', 'Duration', 'Finished'].concat(keys), function(key) { return $.camelize(key) });
  }.property('config').cacheable(),
};
