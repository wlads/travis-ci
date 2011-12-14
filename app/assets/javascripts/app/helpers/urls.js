Travis.Helpers.Urls = {
  urlRepository: function(repository) {
    return '#!/' + repository.get('slug');
  },
  urlBuilds: function(repository) {
    return '#!/' + repository.get('slug') + '/builds';
  },
  urlLastBuild: function(repository) {
    return '#!/' + repository.get('slug') + '/builds/' + repository.get('last_build_id');
  },
  urlBuild: function(repository, build) {
    return '#!/' + repository.get('slug') + '/builds/' + build.get('id');
  },
  urlJob: function(repository, job) {
    return '#!/' + repository.get('slug') + '/jobs/' + job.get('id');
  },
  urlAuthor: function(object) {
    return 'mailto:' + object.get('author_email');
  },
  urlCommitter: function(object) {
    return 'mailto:' + object.get('committer_email');
  },
  urlGithubCommit: function(repository, build) {
    return repository.get('url') + '/commit/' + build.get('commit');
  },
  urlGithub: function(repository) {
    return repository.get('url');
  },
  urlGithubWatchers: function(repository) {
    return repository.get('url') + '/watchers';
  },
  urlGithubNetwork: function(repository) {
    return repository.get('url') + '/network';
  },
  urlGithubAdmin: function(repository) {
    return repository.get('url') + '/admin/hooks#travis_minibucket';
  }
}
