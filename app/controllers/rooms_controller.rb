class RoomsController < ApplicationController
	def create
		name = params[:name]
		room = Room.find_by_name(name)
		if room == nil
			room = Room.create(:name => name)
			render :json => room.id
		else
			render :json => nil
		end
	end

	def view
		name = params[:name]
		@room = Room.find_by_name(name)
		if @room == nil
			raise ActionController::RoutingError.new("Not Found")
		end
	end

	def send_mp3
		file_path = "#{Rails.root}/public/#{params[:filename]}"
		send_file file_path, :filename => params[:filename], :disposition => 'attachment'
	end
end