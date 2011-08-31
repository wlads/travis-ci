Travis.Controllers.Application = Backbone.Controller.extend({
  routes: {
    '':                                          'recent',
    // '!/:owner':               'byOwner',
    // FIXME: I would suggest to use !/repositories/:owner/:name, to make it more rest-like.
    // Because, for instance, now we should put myRepositories on top so that it could get matched. Unambigous routes rule!
    '!/:owner/:name/L:line_number':              'repository',
    '!/:owner/:name':                            'repository',
    '!/:owner/:name/builds':                     'repositoryHistory',
    '!/:owner/:name/builds/:id/L:line_number':   'repositoryBuild',
    '!/:owner/:name/builds/:id':                 'repositoryBuild'
  },
  _queues: [ 'builds', 'rails'],
  before_filter: [ 'reset', 'trackPage' ],
  initialize: function() {
    _.bindAll(this, 'recent', 'byUser', 'repository', 'repositoryHistory', 'repositoryBuild', 'repositoryShow', 'repositorySelected', 'buildQueued', 'buildStarted', 'buildLogged', 'buildFinished', 'buildRemoved', 'route');
  },
  route: function() {
    if (this.before_filter) {
      _.each(this.before_filter, _.bind(function(filter){
        this[filter]();
      }, this));
    }
    Backbone.Controller.prototype.route.apply(this, arguments);
  },
  run: function() {
    this.repositories = new Travis.Collections.Repositories();
    this.workers      = new Travis.Collections.Workers();

    this.repositoriesList = new Travis.Views.Repositories.List();
    this.workersView      = new Travis.Views.Workers.List();

    _.each(this._queues, _.bind(function(queue_name){
      this["queue" + name ] = new Travis.Collections.Jobs([], { queue: queue_name });
      this["queueView" + name ] = new Travis.Views.Jobs.List({ queue: queue_name });
      this["queueView" + name ].attachTo(this["queue" + name]);
      this["queue" + name ].fetch();
    }, this));

    $('#left #tab_recent .tab').append(this.repositoriesList.render().el);

    this.repositoriesList.attachTo(this.repositories);
    this.workersView.attachTo(this.workers);

    // This bindings should move models, since they're model-specific. We always have an instance of application, so we can bind to it any time we want to.
    this.bind('build:started',    this.buildStarted);
    this.bind('build:finished',   this.buildFinished);
    this.bind('build:configured', this.buildConfigured);
    this.bind('build:log',        this.buildLogged);
    this.bind('build:queued',     this.buildQueued);
    this.bind('build:removed',    this.buildRemoved); /* UNTESTED */

    this.repositories.fetch();
    this.workers.fetch();
  },

  // actions

  recent: function() {
    this.followBuilds = true;
    this.selectTab('current');
    this.repositories.selectLast();
  },
  repository: function(owner, name, line_number) {
    console.log ("application#repository: ", arguments);
    window.params = { owner: owner, name: name, line_number: line_number, action: 'repository' };

    // $("#main").html( new Travis.Views.Repository.Tabs().render().el)
    var repository = new Travis.Models.Repository({ slug: owner + '/' + name })
    new Travis.Views.Build.Build({ repository: repository, build: repository.builds.first(), view: $("#main")  })
    repository.fetch()
      // .fetch({ success: _.bind(function(repository) {
      // $('#main').append(.render().el)
      // this.stopLoading();
    // }, this)});
  },
  repositoryHistory: function(owner, name) {
    console.log ("application#repositoryHistory: ", arguments);

    new Travis.Models.Repository({ slug: owner + '/' + name }).fetch({ success: _.bind(function(repository) {
      repository.builds.fetch({ success: _.bind(function(builds) {
        $("#main").append(new Travis.Views.Build.History.Table({ builds: builds, repository: repository }).render().el);
        this.stopLoading();
      }, this) });

    }, this)});
  },
  repositoryBuild: function(owner, name, buildId, line_number) {
    console.log ("application#repositoryBuild: ", arguments);
    window.params = { owner: owner, name: name, build_id: buildId, line_number: line_number, action: 'repositoryBuild' };

    new Travis.Models.Repository({ slug: owner + '/' + name }).fetch({ success: _.bind(function(repository) {
      repository.builds.fetch({ success: _.bind(function(builds) {
        $("#main").append(new Travis.Views.Build.Build({ build: builds.get(parseInt(buildId)), repository: repository }).render().el);
        this.stopLoading();
      }, this) });
    }, this)});
  },

  // helpers
  reset: function() {
    delete this.buildId;
    delete this.tab;
    this.followBuilds = false;
    window.params = {};
  },
  startLoading: function() {
    $('#main').addClass('loading');
  },
  stopLoading: function() {
    $('#main').removeClass('loading');
  },
  trackPage: function() {
    window._gaq = _gaq || [];
    window._gaq.push(['_trackPageview']);
  },


  // external events

  buildQueued: function(data) {
    console.log ("application#buildQueued: ", arguments)
    this.addJob(data);
  },
  buildStarted: function(data) {
    console.log ("application#buildStarted: ", arguments)
    this.removeJob(data);
    this.repositories.update(data);

    if((this.followBuilds || this.tab == 'current' && this.repositories.selected().get('slug') == data.slug) && !this.buildId && !data.build.parent_id) {
      var repository = this.repositories.get(data.id);
      if(!repository.selected) repository.select();
      repository.builds.select(data.build.id);
    }
  },
  buildConfigured: function(data) {
    console.log ("application#buildConfigured: ", arguments)
    this.removeJob(data);
    this.repositories.update(data);
  },
  buildFinished: function(data) {
    console.log ("application#buildFinished: ", arguments)
    this.repositories.update(data);
  },
  buildRemoved: function(data) {
    console.log ("application#buildRemoved: ", arguments)
    this.removeJob(data);
  },
  buildLogged: function(data) {
    console.log ("application#buildLogged: ", arguments)
    this.repositories.update(data);
  },

  selectTab: function(tab) {
    this.tab = tab;
    this.repositoryShow.activateTab(this.tab);
  },
  addJob: function(data) {
    this.jobsCollection(data).add({ number: data.build.number, id: data.build.id, repository: { slug: data.slug } });
  },
  removeJob: function(data) {
    this.jobsCollection(data).remove({ id: data.build.id });
  },
  jobsCollection: function(data) {
    return this["queue" + this.getQueueName(data)];
  },
  getQueueName: function (data) {
    if (data.slug && data.slug == 'rails/rails')
      return 'rails'
    return 'builds'
  }

});


