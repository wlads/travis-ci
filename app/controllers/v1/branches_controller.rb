module V1
  class BranchesController < ApiController
    respond_to :json

    def index
      render :json => data.data if stale? data
    end

    protected

      def data
        Travis::Api.new(branches, :type => :branches, :params => params, :version => 'v1')
      end

      def branches
        service(:branches).find_all(params)
      end
  end
end
