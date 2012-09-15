require 'responders'

module V1
  class WorkersController < ApiController
    responders :json
    respond_to :json

    def index
      respond_with service(:workers).find_all
    end
  end
end
