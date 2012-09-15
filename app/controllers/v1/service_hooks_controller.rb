module V1
  class ServiceHooksController < ApiController
    include AbstractController::Callbacks
    include Devise::Controllers::Helpers

    rescue_from ActiveRecord::RecordInvalid, :with => Proc.new { head :not_acceptable }

    before_filter :authenticate_user!

    respond_to :json

    def index
      respond_with service(:hooks).find_all(params)
    end

    def update
      params.delete(:id) # TODO make sure the client uses a proper id
      respond_with service(:hooks).update(params)
    end
  end
end
