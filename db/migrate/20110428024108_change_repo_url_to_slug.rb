class ChangeRepoUrlToSlug < ActiveRecord::Migration
  def self.up
    rename_column :repositories, :url, :slug
  end

  def self.down
    rename_column :repositories, :slug, :url
  end
end
