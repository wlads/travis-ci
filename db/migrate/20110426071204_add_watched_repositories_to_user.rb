class AddWatchedRepositoriesToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :watched_repositories, :text
  end

  def self.down
    remove_column :users, :watched_repositories
  end
end
