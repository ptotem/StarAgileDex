class SlidesController < ApplicationController

  # GET /slides/1
  # GET /slides/1.json
  def builder
    @slide = Slide.find(params[:id])
    @widget_list=Array.new
    if @slide.content_blocks.blank?
      s=:title_plugin
    else
      s=:content_plugin
    end

    t(:plugins)[s].each do |k,v|
      if(v[:working]=="true")
        @widget_list<<k.to_s
      end
    end

    @widget_list=@widget_list.map{|i| i.gsub(':','')}
    gon.slide_id=@slide.id
    gon.title=@slide.title
    gon.subtitle=@slide.subtitle
    gon.font = params[:font]
    gon.background = params[:background]
    gon.plugin=params[:plugin].to_i
    gon.image_list=@slide.content_blocks.map{|t|
                                                 if !t.image.blank?
                                                   t.image.path.gsub("#{Rails.root}/public","")
                                                 end
                                            }
    gon.caption=@slide.content_blocks.map{|t| t.caption}
    @themelist = ['Blackboard', 'Bluebird', 'Red Velvet']
    @fontarray = ['Century Gothic', 'Canela', 'Verdana', 'Arial']
    @fontadjustment= [0, 0, 0, 0]
    @export=FALSE
    gon.widget_list=@widget_list
    gon.fontarray = @fontarray
    gon.fontadjustment = @fontadjustment
  end

  # GET /slides/1
  # GET /slides/1.json
  def show
    @slide = Slide.find(params[:id])
  end

  # GET /slides/new
  # GET /slides/new.json
  def new
    unless params[:presentation_id].nil?
      @presentation=Presentation.find(params[:presentation_id])
    end
    @slide = Slide.new
    render :layout => false
  end

  # GET /slides/1/edit
  def edit
    unless params[:presentation_id].nil?
      @presentation=Presentation.find(params[:presentation_id])
    end
    @slide = Slide.find(params[:id])
    render :layout=>false
  end

  # POST /slides
  # POST /slides.json
  def create
    @slide = Slide.new(params[:slide])
    respond_to do |format|
      if @slide.save
        format.html { redirect_to builder_path(@slide,"basic","Arial","bluebird"), notice: 'Slide was successfully created.' }
        format.json { render json: @slide, status: :created, location: @slide }
      else
        format.html { render action: "new" }
        format.json { render json: @slide.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /slides/1
  # PUT /slides/1.json
  def update

    @slide = Slide.find(params[:id])

    respond_to do |format|
      if @slide.update_attributes(params[:slide])
        format.html { redirect_to builder_path(@slide,@slide.layout,@slide.font,@slide.background), notice: 'Slide was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @slide.errors, status: :unprocessable_entity }
      end
    end
  end


  # DELETE /slides/1
  # DELETE /slides/1.json
  def destroy
    @slide = Slide.find(params[:id])
    @slide.destroy

    respond_to do |format|
      format.html { redirect_to slides_url }
      format.json { head :no_content }
    end
  end

  def save_slide
    @slide=Slide.find(params[:id][0])
    @slide.layout=params[:plugin][0]
    @slide.font= params[:font][0]
    @slide.background=params[:background][0]
    @slide.save
    render :text=>'success'
    return
  end


end
