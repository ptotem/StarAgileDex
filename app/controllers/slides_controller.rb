class SlidesController < ApplicationController

  # GET /slides/1
  # GET /slides/1.json
  def builder
    @slide = Slide.find(params[:id])
    @export=FALSE # This is the Screen View

    # Create the Widget List from en.yml and the User Inputs
    # If there is no WYSIWYG entry and no content blocks, it is a Simple Title Slide
    # If there is a WYSIWYG entry, it is a WYSIWYG Slide
    # Else it is a content block slide
    # -------------------------
    @widget_list=Array.new
    if @slide.ppt.exists?
      s=:ppt_plugin
      @plugin_category="Powerpoint_Plugins"
    elsif @slide.content_blocks.blank? and @slide.main.blank?
      s=:title_plugin
      @plugin_category="Title_Slide_Plugins"
    elsif @slide.content_blocks.blank?
      s=:wysiwyg_plugin
      @plugin_category="WYSIWYG_Slide_Plugins"
      @wysiwyg=TRUE
    else
      s=:content_plugin
      @plugin_category="Content_Blocks_Slide_Plugins"
      @wysiwyg=FALSE
    end
    t(:plugins)[s].each do |k, v|
      if (v[:working]=="true")
        @widget_list<<k.to_s
      end
    end
    @widget_list=@widget_list.map { |i| i.gsub(':', '') }
    # ----------------------------

    # Pick the Plugin based on the params in the URL and the category it belongs to
    @plugin="#{@plugin_category}/#{@widget_list[params[:plugin].to_i]}"
    #For including best suited layout for selected plugins and executing it's function
    #TODO: Check for plugins
    @plugin_layout=t(:plugins)[s][:"#{@widget_list[params[:plugin].to_i]}"][:layout]
    gon.plugin_layout="#{@plugin_layout}()"
    # Put the contents into JS variables to be processed by master_init.js
    # ----------------------------------------

    gon.slide_id=@slide.id
    gon.title=@slide.title
    gon.mode=@slide.mode
    gon.nosub=@slide.nosub

    # If there is no titlepic or subtitle, don't show either
    # If there is subtitle, show subtitle in subtitle_block and adjust text size with Textfill plugin
    # If there is titlepic, show titlepic in subtitle_block and adjust size of the image to fit
    if @slide.titlepic_file_name.blank? and @slide.subtitle.blank?
      gon.no_subtitle=TRUE
      gon.no_titlepic=TRUE
    elsif @slide.titlepic_file_name.blank?
      gon.subtitle=@slide.subtitle
      gon.no_titlepic=TRUE
    else
      gon.titlepic=@slide.titlepic.path.gsub("#{Rails.root}/public", "")
      gon.no_subtitle=TRUE
    end

    # If the WYSIWYG editor was used, show Main Block else show the Plugins
    if @wysiwyg
      gon.main=@slide.main
    else
      gon.image_list=@slide.content_blocks.map { |t|
        if !t.image.blank?
          t.image.path.gsub("#{Rails.root}/public", "")
        end
      }
      gon.caption=@slide.content_blocks.map { |t| t.caption }
    end

    # --------------------------------------------

    # Setup the DropDown List for Theme, Font and Plugin
    @themelist=Array.new
    t(:themes).each do |k,v|
      @themelist<<v
    end

    @fontarray=Array.new
    t(:fonts).each do |k,v|
      @fontarray<<v
    end


    gon.widget_list=@widget_list
    gon.fontarray = @fontarray
    gon.fontadjustment = @fontadjustment
    gon.themelist = @themelist

    # Currently active
    gon.font = params[:font]
    gon.background = params[:background]
    gon.plugin=params[:plugin].to_i

    # ---------------------------------------


    if !params[:plugin].is_a?(Integer)
      @widget_list.each_with_index do |i, index|
        if (i==params[:plugin].to_i)
          params[:plugin]=index
        end
      end
    end


  end

  # GET /slides/1
  # GET /slides/1.json
  def show
    @slide = Slide.find(params[:id])
  end

  # GET /slides/new
  # GET /slides/new.json
  def new
    if params[:presentation_id].nil?
      @presentation=Presentation.new
    else
      @presentation=Presentation.find(params[:presentation_id])
    end
    @slide = Slide.new
    @slide.content_blocks.build
    render :layout => false
  end

  # GET /slides/1/edit
  def edit
    if params[:presentation_id].nil?
      @presentation=Presentation.new
    else
      @presentation=Presentation.find(params[:presentation_id])
    end
    @slide = Slide.find(params[:id])
    render :layout => false
  end

  # POST /slides
  # POST /slides.json
  def create
    @slide = Slide.new(params[:slide])
    respond_to do |format|
      if @slide.save
        @slide.remove_redundancy
        format.html { redirect_to builder_path(@slide, @slide.layout, @slide.font, @slide.background), notice: 'Slide was successfully created.' }
        format.json { render json: @slide, status: :created, location: @slide }
      else
        format.html { redirect_to builder_path(@slide, @slide.layout, @slide.font, @slide.background), notice: 'Slide could not be created.' }
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
        @slide.remove_redundancy
        format.html { redirect_to builder_path(@slide, @slide.layout, @slide.font, @slide.background), notice: 'Slide was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { redirect_to builder_path(@slide, @slide.layout, @slide.font, @slide.background), notice: 'Slide could not be updated.' }
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
    render :text => 'success'
    return
  end


end
