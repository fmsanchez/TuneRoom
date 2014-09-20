class RoomsController < ApplicationController
	def create
		@room = Room.create(name: params[:name], library: params[:library], queue: params[:queue])
		render :json => @room.id
	end

	def view
	end

	def next
		room = Room.find(params[:id])
		queue = JSON.parse(room.queue)
		
	end
end