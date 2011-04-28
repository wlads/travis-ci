class User < ActiveRecord::Base
  devise :omniauthable, :api_token_authenticatable

  has_many :tokens

  attr_accessible :name, :login, :email

  serialize :watched_repositories, Array

  after_create :create_a_token

  def self.find_for_github_oauth(user_hash)
    data = user_hash['extra']['user_hash']
    if user = User.find_by_login(data["login"])
      user
    else
      create!(data.slice(*%w(name login email)))
    end
  end

  def profile_image_hash
    self.email? ? Digest::MD5.hexdigest(self.email) : '00000000000000000000000000000000'
  end

  def watched_repositories
    super || []
  end

  def watched
    reload_watched_repositories! if self.watched_repositories.empty?

    Repository.where(:slug => watched_repositories.map { |r| "#{r['owner']}/#{r['name']}" })
  end

  def reload_watched_repositories!
    self.watched_repositories = Octokit.watched(self.login).map { |r| r.slice(:name, :owner).to_hash }
    save
  end

  private

    def create_a_token
      self.tokens.create!
    end
end
