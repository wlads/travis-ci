require 'travis'

Travis::Services.constants.each do |name|
  Travis.services[name.to_s.underscore.to_sym] = Travis::Services.const_get(name) unless name == :Base
end
