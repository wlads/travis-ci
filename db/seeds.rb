# encoding: utf-8
# truncate all tables for test and development

# TODO: This is the wrong place for seed data, for now
#       it has been commented out, but this needs a new home
if Rails.env.development? || Rails.env.jasmine?
  Repository.delete_all
  Build.delete_all
  minimal = Repository.create!({
    :owner_name => 'svenfuchs',
    :name => 'minimal',
    :url => 'https://github.com/svenfuchs/minimal',
    :last_duration => 10
  })

  Build.create!({
    :repository => minimal,
    :number => 1,
    :status => 1,
    :commit => '1a738d9d6f297c105ae2',
    :ref => 'refs/heads/develop',
    :branch => 'master',
    :message => 'add Gemfile',
    :committed_at => '2010-11-12 11:58:00',
    :committer_name => 'Sven Fuchs',
    :committer_email => 'svenfuchs@artweb-design.de',
    :started_at => '2010-11-12 12:00:00',
    :finished_at => '2010-11-12 12:00:08',
    :agent => '76f4f2ba',
    :log => File.read("#{Rails.root}/db/seeds/logs/svenfuchs.minimal.log")
  })

  Build.create!({
    :repository => minimal,
    :number => 2,
    :status => 0,
    :commit => '91d1b7b2a310131fe3f8',
    :ref => 'refs/heads/master',
    :branch => 'master',
    :message => 'Bump to 0.0.22',
    :committed_at => '2010-11-12 12:28:00',
    :committer_name => 'Sven Fuchs',
    :committer_email => 'svenfuchs@artweb-design.de',
    :started_at => '2010-11-12 12:30:00',
    :finished_at => '2010-11-12 12:30:08',
    :agent => 'a1732e4f',
    :log => File.read("#{Rails.root}/db/seeds/logs/svenfuchs.minimal.2.log")
  })

  Build.create!(
    :number => '3',
    :repository => minimal,
    :status => '',
    :commit => 'add057e66c3e1d59ef1f',
    :ref => 'refs/heads/master',
    :branch => 'master',
    :message => 'unignore Gemfile.lock',
    :committed_at => '2010-11-12 12:58:00',
    :committer_name => 'Sven Fuchs',
    :committer_email => 'svenfuchs@artweb-design.de',
    :started_at => '2010-11-12 13:00:00',
    :agent => '76f4f2ba',
    :log => File.read("#{Rails.root}/db/seeds/logs/svenfuchs.minimal.log"),
    :config => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] }
  )

  enginex = Repository.create!({
    :owner_name => 'josevalim',
    :name => 'enginex',
    :url => 'https://github.com/josevalim/enginex',
    :last_duration => 30
  })

  Build.create!({
    :repository => enginex,
    :number => 1,
    :status => 1,
    :commit => '565294c05913cfc23230',
    :message => 'Update Capybara',
    :committed_at => '2010-11-11 11:58:00',
    :author_name => 'Jose Valim',
    :author_email => 'jose@email.com',
    :committer_name => 'Jose Valim',
    :committer_email => 'jose@email.com',
    :started_at => '2010-11-11 12:00:00',
    :finished_at => '2010-11-11 12:00:20',
    :agent => 'a1732e4f',
    :log => File.read("#{Rails.root}/db/seeds/logs/svenfuchs.minimal.2.log")
  })

  matrix_build_repository = Repository.create!(
    :name => "travis-ci",
    :url => "https://github.com/ifesdjeen/travis-ci",
    :last_duration => nil,
    :created_at => "2011-06-15 15:15:51",
    :updated_at => "2011-08-04 17:53:48",
    :last_build_number => "17",
    :last_build_status => 1,
    :last_build_started_at => "2011-08-04 17:48:43",
    :last_build_finished_at => "2011-08-04 17:53:47",
    :owner_name => "ifesdjeen",
    :owner_email => "alexp@coffeenco.de",
    :is_active => true)

  matrix_build = Build.create(
    :repository => matrix_build_repository,
    :number => "17",
    :status => 1,
    :started_at => "2011-08-04 17:48:43",
    :finished_at => "2011-08-04 17:53:47",
    :log => "",
    :commit => "ad81a635f98de21865f90d8c1f937cc7abb6dca0",
    :message => "Missing templates and json file for repository test...",
    :committed_at => "2011-06-12 12:44:31",
    :committer_name => nil,
    :committer_email => nil,
    :author_name => "Oleksandr Petrov",
    :author_email => "oleksandr.petrov@gmail.com",
    :agent => nil,
    :created_at => "2011-08-04 17:48:33",
    :updated_at => "2011-08-04 17:53:48",
    :parent_id => nil,
    :config => {"script"=>"bundle exec rake db:drop db:create db:migrate test", "rvm"=>["1.8.7", "rbx-2.0", "ree"], ".configured"=>"true"},
    :ref => nil,
    :branch => "master",
    :github_payload => "{\"pusher\":{\"name\":\"none\"},\"repository\":{\"name\":\"tra...",
    :compare_url => "https://github.com/ifesdjeen/travis-ci/compare/47d0...",
    :token => "QhVLbv8862HxRa45JrBq")


  matrix_build.matrix<< Build.create!(
    :repository => matrix_build_repository,
    :number => "17.1",
    :status => 1,
    :started_at => "2011-08-04 17:48:42",
    :finished_at => "2011-08-04 17:50:44",
    :log => "Using worker => staging:worker-1\n\n$ git clone --depth...",
    :commit => "ad81a635f98de21865f90d8c1f937cc7abb6dca0",
    :message => "Missing templates and json file for repository test...",
    :committed_at => "2011-06-12 12:44:31",
    :committer_name => nil,
    :committer_email => nil,
    :author_name => "Oleksandr Petrov",
    :author_email => "oleksandr.petrov@gmail.com",
    :agent => nil,
    :created_at => "2011-08-04 17:48:33",
    :updated_at => "2011-08-04 17:50:45",
    :config => {"script"=>"bundle exec rake db:drop db:create db:migrate test", "rvm"=>"1.8.7", ".configured"=>"true"},
    :ref => nil,
    :branch => "master",
    :github_payload => "{\"pusher\":{\"name\":\"none\"},\"repository\":{\"name\":\"tra...",
    :compare_url => "https://github.com/ifesdjeen/travis-ci/compare/47d0...",
    :token => "QhVLbv8862HxRa45JrBq")

  matrix_build.matrix<< Build.create!(
    :repository => matrix_build_repository,
    :number => "17.2",
    :status => 1,
    :started_at => "2011-08-04 17:48:43",
    :finished_at => "2011-08-04 17:53:47",
    :log => "Using worker => staging:worker-5\n\n$ git clone --depth...",
    :commit => "ad81a635f98de21865f90d8c1f937cc7abb6dca0",
    :message => "Missing templates and json file for repository test...",
    :committed_at => "2011-06-12 12:44:31",
    :committer_name => nil,
    :committer_email => nil,
    :author_name => "Oleksandr Petrov",
    :author_email => "oleksandr.petrov@gmail.com",
    :agent => nil,
    :created_at => "2011-08-04 17:48:33",
    :updated_at => "2011-08-04 17:53:48",
    :config => {"script"=>"bundle exec rake db:drop db:create db:migrate test", "rvm"=>"rbx-2.0", ".configured"=>"true"},
    :ref => nil,
    :branch => "master",
    :github_payload => "{\"pusher\":{\"name\":\"none\"},\"repository\":{\"name\":\"tra...",
    :compare_url => "https://github.com/ifesdjeen/travis-ci/compare/47d0...",
    :token => "QhVLbv8862HxRa45JrBq")

  matrix_build.matrix<< Build.create!(
    :repository => matrix_build_repository,
    :number => "17.3",
    :status => 1,
    :started_at => "2011-08-04 17:48:43",
    :finished_at => "2011-08-04 17:51:09",
    :log => "Using worker => staging:worker-3\n\n$ git clone --depth...",
    :commit => "ad81a635f98de21865f90d8c1f937cc7abb6dca0",
    :message => "Missing templates and json file for repository test...",
    :committed_at => "2011-06-12 12:44:31",
    :committer_name => nil,
    :committer_email => nil,
    :author_name => "Oleksandr Petrov",
    :author_email => "oleksandr.petrov@gmail.com",
    :agent => nil,
    :created_at => "2011-08-04 17:48:33",
    :updated_at => "2011-08-04 17:51:10",
    :config => {"script"=>"bundle exec rake db:drop db:create db:migrate test", "rvm"=>"ree", ".configured"=>"true"},
    :ref => nil,
    :branch => "master",
    :github_payload => "{\"pusher\":{\"name\":\"none\"},\"repository\":{\"name\":\"tra...",
    :compare_url => "https://github.com/ifesdjeen/travis-ci/compare/47d0...",
    :token => "QhVLbv8862HxRa45JrBq")
end
