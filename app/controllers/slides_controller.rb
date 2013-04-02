class SlidesController < ApplicationController

  # GET /slides/1
  # GET /slides/1.json
  def builder
    @slide = Slide.find(params[:id])
    gon.title=@slide.title
    gon.titlepic="@slide.titlepic"
    gon.subtitle=@slide.subtitle
    gon.font = params[:font]
    gon.background = params[:background]
    gon.plugin=params[:plugin].to_i
    gon.image_list=@slide.content_blocks.map{|t| t.image.path.gsub("#{Rails.root}/public","")}
    gon.caption=@slide.content_blocks.map{|t| t.caption}
    @themelist = ['Blackboard', 'Bluebird', 'Red Velvet']
    @fontarray = ['Century Gothic', 'Canela', 'Verdana', 'Arial']
    @fontadjustment= [0, 0, 0, 0]
    gon.widget_list=['imagecube','jimpress']
    @widget_list=['imagecube','jimpress']
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
    @slide = Slide.new
    @presentation = Presentation.find(params[:presentation_id])
    @slide.content_blocks.build
    render :layout => "custom_layout"
    #respond_to do |format|
    #  format.html # new.html.erb
    #  format.json { render json: @slide }
    #end
  end

  # GET /slides/1/edit
  def edit
    @slide = Slide.find(params[:id])
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


end
