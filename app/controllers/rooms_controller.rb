class RoomsController < ApplicationController
	protect_from_forgery except: :create

	def create
		name = params["name"]
		name = name.sub!(' ', '-')
		library = params["library"]
		room = Room.find_by_name(name)
		if room == nil
			room = Room.create(name: name, library: library.to_s, queue: '{}')
			render :json => room.name.to_json
		else
			render :json => nil
		end
	end

	def view
		@name = params[:name]
		@room = Room.find_by_name(@name)
		if @room == nil
			render "not_found"
			return
		end
		@library = eval(@room.library || "") || []
		@queue = eval(@room.queue || "") || []
		@queue.sort_by{|k,v| v['popularity'].to_i}.reverse
	end

	def queue
		@name = params[:name]
		@room = Room.find_by_name(@name)
		if @room == nil
			render "not_found"
			return
		end
		@queue = eval(@room.queue || "") || []
		@queue.sort_by{|k,v| -v['popularity'].to_i}
		render :partial => "songs_partial", :locals => {:songs => @queue, :queue => true}
	end

	def send_mp3
		file_path = "#{Rails.root}/public/#{params[:filename]}"
		send_file file_path, :filename => params[:filename], :disposition => 'attachment'
	end

	def next
		room = Room.find_by_name(params[:name])
		queue = eval(room.queue)
		if queue.count > 0
			popular = queue.first.last
			pop_key = queue.first.first
			queue.each do |key, value|
				if value['popularity'] > popular['popularity']
					popular = value
					pop_key = key
				end
			end
			ret = queue[pop_key]
			ret['id'] = pop_keyg
			queue.delete(pop_key)
			queue = queue.to_s
			room.update_attribute(:queue, queue)
			response.headers['Content-Type'] = 'application/json'
			render :json => ret.to_json
		else
			render :json => nil
		end
	end

	def up_vote
		name = params[:name]
		song_id = params[:song_id].to_s
		room = Room.find_by_name(name)
		queue = eval(room.queue)
		song = queue[song_id]
		popularity = song[:popularity]
		song["popularity"] = (song["popularity"].to_i + params[:ammount].to_i).to_s
		room.update_attribute(:queue, queue.to_s)
		render :json => song.to_json
	end

	def down_vote
		name = params[:name]
		song_id = params[:song_id].to_s
		room = Room.find_by_name(name)
		queue = eval(room.queue)
		song = queue[song_id]
		popularity = song[:popularity]
		song["popularity"] = (song["popularity"].to_i - params[:ammount].to_i).to_s
		room.update_attribute(:queue, queue.to_s)
		render :json => song.to_json
	end

	def add_to_queue
		name = params[:name]
		song_id = params[:song_id].to_s
		room = Room.find_by_name(name)

		if song_id.include?"youtube"
			video_id = song_id.split("youtube-")[1]
			puts video_id
			url = "http://www.youtube.com/watch?v="+video_id
			command = `youtube-dl --extract-audio --audio-format mp3 #{url} -o #{Rails.root}/public/#{song_id}.mp3
`
			puts command
		end

		library = eval(room.library)
		queue = eval(room.queue)
		song = nil
		if queue == nil
			queue = {}
		end
		if (!queue.has_key?(song_id))
			song = library[song_id]
			queue[song_id] = song
			room.update_attribute(:queue, queue.to_s)
		end
		render :json => song.to_json
	end

	def song_template
		songs = params[:data]
		render :partial => "songs_partial", :locals => {:songs => songs, :queue => false}
	end

end