namespace :travis do
  desc "set the first User as an admin"
  task :create_admin_user => :environment do
    u = User.first
    u.is_admin = true
    u.save(false)
  end

  desc "fetch the list of watched repositories from GitHub"
  task :reload_watched_repositories => :environment do
    User.find_each do |user|
      ActiveRecord::Base.transaction do
        user.reload_watched_repositories!
      end
    end
  end
end
