class PresentationsController < ApplicationController

  def new
    @presentation=Presentation.new
  end

  def create
    @presentation = Presentation.new(params[:presentation])

    respond_to do |format|
      if @presentation.save
        #After presentation create redirect to console page
        format.html { redirect_to "/console", notice: 'Presentation was successfully created.' }
        format.json { render json: @presentation, status: :created, location: @slide }
      else
        format.html { render action: "new" }
        format.json { render json: @presentation.errors, status: :unprocessable_entity }
      end
    end
  end

  #function to export the file as html
  def export
    require 'find'
    require 'fileutils'
    require 'pathname'
    @presentation=Presentation.find(params[:id])

    #Make Directory in public file copy all the component of assets/master,assets/background in public/slides/assets directory.
    system "mkdir #{Rails.root}/public/slides/assets"
    system "mkdir #{Rails.root}/public/slides/assets/img"
    FileUtils.cp_r("#{Rails.root}/app/assets/master/.", "#{Rails.root}/public/slides/assets/")
    FileUtils.cp_r("#{Rails.root}/app/assets/backgrounds/.", "#{Rails.root}/public/slides/assets/")
    FileUtils.cp_r("#{Rails.root}/public/favicon.ico", "#{Rails.root}/public/slides/assets/")

    @presentation.slides.each do |slide|
      #################################################
      @widget_list=[slide.layout]
      @themelist = [slide.background]
      @fontarray = [slide.font]
      @fontadjustment= [0, 0, 0, 0]
      @export=TRUE
      #Make directory with slide.id name in public/slides/assets/img and copying the slides images in to that directory
      system "mkdir #{Rails.root}/public/slides/assets/img/#{slide.id}"
      FileUtils.cp_r("#{Rails.root}/public/userdata/#{@presentation.user.name.downcase.gsub(" ", "_")}/#{@presentation.name}/#{slide.id}/images/content_blocks/","#{Rails.root}/public/slides/assets/img/#{slide.id}/" )

      #Making javascript varriables
      gon.slide_id=slide.id
      gon.title=slide.title
      gon.titlepic="@slide.titlepic"
      gon.subtitle=slide.subtitle
      gon.font = slide.font
      gon.background = slide.background
      gon.plugin=0

      gon.image_list=slide.content_blocks.map{|t| t.image.path.gsub("#{Rails.root}/public/userdata/#{@presentation.user.name.downcase.gsub(" ", "_")}/#{@presentation.name}/#{slide.id}/images","assets/img/#{slide.id}")}
      gon.caption=slide.content_blocks.map{|t| t.caption}
      gon.fontarray = @fontarray
      gon.fontadjustment = @fontadjustment
      gon.widget_list=[slide.layout]
      FileUtils.cp_r("#{Rails.root}/app/assets/plugins/#{slide.layout}/","#{Rails.root}/public/slides/assets/" )
      ##################################################

      File.open("#{Rails.root}/public/slides/#{slide.id}.html", 'w') {|f| f.write(render_to_string(:file => 'slides/builder').gsub('/assets','assets').gsub('themes.css','theme.css')) }

    end
    render :text=>'success'
  end

end
