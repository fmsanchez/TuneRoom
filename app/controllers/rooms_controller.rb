class RoomsController < ApplicationController
	def create
	end

	def view
		@room = Room.where(id: params[:id]).first
	end
end