class RoomsController < ApplicationController
	protect_from_forgery except: :create

	def create
		name = params["name"]
		library = params["library"]
		room = Room.find_by_name(name)
		if room == nil
			room = Room.create(name: name, library: library.to_s, queue: '')
			render :json => room.name.to_json
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
		respond_to do |format|
			format.html
		format.json { render :json => @room.to_json }
		end
	end

	def send_mp3
		file_path = "#{Rails.root}/public/#{params[:filename]}"
		send_file file_path, :filename => params[:filename], :disposition => 'attachment'
	end

	def next
		room = Room.find(params[:id])
		queue = JSON.parse(room.queue)
		popular = queue.first.last
		pop_key = queue.first.first
		queue.each do |key, value|
			if value[:popularity] > popular[:popularity]
				popular = value
				pop_key = key
			end
		end
		queue.delete(pop_key)
		queue = queue.to_json
		room.update_attribute(:queue, queue)
		render :json => popular.to_json
	end

	def upvote
		name = params[:name]
		song_id = params[:song_id]
		room = Room.find_by_name(name)
		queue = JSON.parse(room.queue)
		song = queue[song_id]
		popularity = song[:popularity]
		song[:popularity] = popularity + 1
		room.update_attribute(:queue, queue)
		render :json => song.to_json
	end

	def downvote
		name = params[:name]
		song_id = params[:song_id]
		room = Room.find_by_name(name)
		queue = JSON.parse(room.queue)
		song = queue[song_id]
		popularity = song[:popularity]
		song[:popularity] = popularity - 1
		room.update_attribute(:queue, queue)
		render :json => song.to_json
	end

	def add_to_queue
		name = params[:name]
		song_id = params[:song_id]
		room = Room.find_by_name(name)
		library = JSON.parse(room.library)
		queue = JSON.parse(room.queue)
		song = nil
		if (!queue.has_key?(song_id))
			song = library[song_id]
			queue[song_id] = {name: song[:name], artist: song[:artist], popularity: 0}
		end
		render :json => song.to_json
	end

end