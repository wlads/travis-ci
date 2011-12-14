//= require app/helpers/urls
//
Travis.View = SC.View.extend(Travis.Helpers.Urls);

Travis.Views.Repository = SC.View.extend({
  urlRepository: function() {
    var repository = this.getPath('repository') || this.getPath('content');
    if(repository) return Travis.Helpers.Urls.urlRepository(repository);
  }.property('repository.id'),

  urlBuilds: function() {
    var repository = this.getPath('repository');
    if(repository) return Travis.Helpers.Urls.urlBuilds(repository);
  }.property('repository.id', 'build.id'),

  urlLastBuild: function() {
    var repository = this.getPath('content');
    if(repository) return Travis.Helpers.Urls.urlLastBuild(repository);
  }.property('repository.id', 'build.id'),

  urlBuild: function() {
    var repository = this.getPath('repository');
    var build = this.get('build');
    if(repository && build) return Travis.Helpers.Urls.urlBuild(repository, build);
  }.property('repository.id', 'build.id'),

  urlJob: function() {
    var repository = this.getPath('repository');
    var job = this.get('job');
    if(repository && job) return Travis.Helpers.Urls.urlJob(repository, job);
  }.property('repository.id', 'job.id'),

  urlGithub: function() {
    var repository = this.getPath('repository');
    if(repository) return Travis.Helpers.Urls.urlGithub(repository);
  }.property('repository.id'),

  urlGithubWatchers: function() {
    var repository = this.getPath('repository');
    if(repository) return Travis.Helpers.Urls.urlGithubWatchers(repository);
  }.property('repository.id'),

  urlGithubNetwork: function() {
    var repository = this.getPath('repository');
    if(repository) return Travis.Helpers.Urls.urlGithubNetwork(repository);
  }.property('repository.id'),

  urlGithubAdmin: function() {
    var repository = this.getPath('repository');
    if(repository) return Travis.Helpers.Urls.urlGithubAdmin(repository);
  }.property('repository.id'),
});

Travis.Views.Build = SC.View.extend({
  urlBuild: function() {
    var repository = this.getPath('build.repository');
    var build = this.get('build');
    if(repository && build) return Travis.Helpers.Urls.urlBuild(repository, build);
  }.property('build.repository.id', 'build.id'),

  urlAuthor: function() {
    var build = this.get('build');
    if(build) return Travis.Helpers.Urls.urlAuthor(build);
  }.property('build.id'),

  urlCommitter: function() {
    var build = this.get('build');
    if(build) return Travis.Helpers.Urls.urlCommitter(build);
  }.property('build.id'),

  urlGithubCommit: function() {
    var repository = this.getPath('build.repository');
    var build = this.get('build');
    if(repository && build) return Travis.Helpers.Urls.urlGithubCommit(repository, build);
  }.property('build.repository.id', 'build.id'),

  formattedDuration: function() {
    var build = this.get('build');
    if(build) return Travis.Helpers.Formats.formattedDuration(build);
  }.property('build.id'),

  formattedFinishedAt: function() {
    var build = this.get('build');
    if(build) return Travis.Helpers.Formats.formattedFinishedAt(build);
  }.property('build.id'),

  formattedCommit: function() {
    var build = this.get('build');
    if(build) return Travis.Helpers.Formats.formattedCommit(build);
  }.property('build.id'),

  formattedCompareUrl: function() {
    var build = this.get('build');
    if(build) return Travis.Helpers.Formats.formattedCompareUrl(build);
  }.property('build.id'),

  formattedConfig: function() {
    var build = this.get('build');
    if(build) return Travis.Helpers.Formats.formattedConfig(build);
  }.property('build.id'),

  formattedMatrixHeaders: function() {
    var build = this.get('build');
    if(build) return Travis.Helpers.Formats.formattedMatrixHeaders(build);
  }.property('build.id'),
});
