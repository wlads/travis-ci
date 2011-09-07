Dir['spec/client/support/**/*.rb'].sort.each { |path| require File.expand_path(path) }

require 'spec_helper'
require 'rspec'
require 'capybara/rspec'
require 'webmock'

RSpec.configure do |config|
  # set javascript driver for capybara
  Capybara.javascript_driver = :webkit
end

Capybara.default_selector = :css


