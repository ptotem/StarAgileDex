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

  def wiki_prez
    #Todo add layout we have to create separate pluins list for wiki because we are mensioning the layout in en.yml file, to apply it here just change :layout=><cHANGE> in each create
    #of this function.
    #Todo we also have to add condition in builder action so that it can pick from wiki plug in list.
    @wiki_snippets=Array.new
    @external_link=Array.new
    @external_text=Array.new
    @search_string=params[:name]
    # Wiki Extraction
    doc=Nokogiri::XML(open("http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=xml&titles=#{@search_string.gsub(" ", "%20")}").read)
    wiki_entry = doc.xpath("//revisions//rev").text
    check=wiki_entry.scan(/(?<=\#REDIRECT \[\[).+?(?=\]\])/m)[0]
    unless check.blank?
      doc=Nokogiri::XML(open("http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=xml&titles=#{check.gsub(" ", "%20")}").read)
      wiki_entry = doc.xpath("//revisions//rev").text
    end

    @wikied=WikiParser.new({:data => "#{wiki_entry}"})
    @slides,@external_link,@external_text = scrap_it(@wikied.to_html,@search_string)
    @presentation=Presentation.create!(:user_id => current_user.id, :name => @search_string)
    @slides.each do |i|
      if i["main"]==[] or i["main"]=='null'
        @slides.delete(i)
      end
    end
    @slides.each_with_index do |i, index|
      @count=1
      if index<1
        @slide=Slide.create!(:presentation_id => @presentation.id, :title => i["title"], :subtitle => i["main"].summarize, :mode => "Blocks", :layout => 'imagecube', :sequence => (@count))
        ContentBlock.create!(:slide_id => @slide.id, :image => URI.parse(i["content_block"]), :caption => "")
        @wiki_external_snipets=Array.new

        @external_link.each_with_index do |link,index1|
          if @slides[0]["main"].summarize.summarize.include?(@external_text[index])
            doc1=Nokogiri::XML(open("http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=xml&titles=#{link.gsub(" ", "%20")}").read)
            wiki_entry1 = doc1.xpath("//revisions//rev").text
            check1=wiki_entry1.scan(/(?<=\#REDIRECT \[\[).+?(?=\]\])/m)[0]
            unless check1.blank?
              doc1=Nokogiri::XML(open("http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=xml&titles=#{check1.gsub(" ", "%20")}").read)
              wiki_entry1 = doc1.xpath("//revisions//rev").text
            end
            @wikied1=WikiParser.new({:data => "#{wiki_entry1}"})
            @count=@count+1
            Slide.create!(:presentation_id=>@presentation.id,:title=>@external_text[index1],:subtitle=>scrap_external(@wikied1.to_html),:mode=>"HTML",:layout=>'allcentered',:sequence=>(@count))
          end
        end
      else
        @count=@count+1
        @slide=Slide.create!(:presentation_id => @presentation.id, :title => i["title"], :subtitle => (i["main"].summarize rescue i["main"]), :mode => "Blocks", :layout => 'imagecube', :sequence => (@count))
        ContentBlock.create!(:slide_id => @slide.id, :image => URI.parse(i["content_block"]), :caption => "")
      end
    end
    redirect_to view_deck_path(@presentation.id)
    return
  end

  #function to export the file as html
  #TODO: Export needs to be build for guest
  def export
    require 'find'
    require 'fileutils'
    require 'pathname'
    @presentation=Presentation.find(params[:id])
    system("rm -rf #{Rails.root}/public/slides/*.zip")
    #Please, make slides directory in public folder
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
      @view_deck=FALSE
      gon.view_deck=@view_deck
      #Make directory with slide.id name in public/slides/assets/img and copying the slides images in to that directory
      system "mkdir #{Rails.root}/public/slides/assets/img/#{slide.id}"
      if !slide.content_blocks.blank?
        FileUtils.cp_r("#{Rails.root}/public/userdata/#{@presentation.user.name.downcase.gsub(" ", "_")}/#{@presentation.name.downcase.gsub(" ", "_")}/#{slide.id}/content_blocks/", "#{Rails.root}/public/slides/assets/img/#{slide.id}/")
      end


      #Making javascript varriables
      gon.slide_id=slide.id
      gon.title=slide.title


      gon.next_slide = slide.next_slide
      @prev_slide = Slide.find_by_next_slide(gon.slide_id) rescue nil
      gon.prev_slide = @prev_slide.id rescue nil


      if slide.titlepic_file_name.blank? and slide.subtitle.blank?
        gon.no_subtitle=TRUE
        gon.no_titlepic=TRUE
      elsif slide.titlepic_file_name.blank?
        gon.subtitle=slide.subtitle
        gon.no_titlepic=TRUE
      else
        gon.titlepic=slide.titlepic.url(:ie).gsub("#{Rails.root}/public", "")
        FileUtils.cp_r("#{Rails.root}/public/userdata/#{@presentation.user.name.downcase.gsub(" ", "_")}/#{@presentation.name.downcase.gsub(" ", "_")}/images/title_pic/.", "#{Rails.root}/public/slides/assets/img/")
        gon.no_subtitle=TRUE
        gon.no_titlepic=FALSE
      end

      if slide.ppt.exists?
        s=:ppt_plugin
        @plugin_category="Powerpoint_Plugins"
      elsif slide.content_blocks.blank? and slide.main.blank?
        s=:title_plugin
        @plugin_category="Title_Slide_Plugins"
      elsif slide.content_blocks.blank?
        s=:wysiwyg_plugin
        @plugin_category="WYSIWYG_Slide_Plugins"
        @wysiwyg=TRUE
      else
        s=:content_plugin
        @plugin_category="Content_Blocks_Slide_Plugins"
        @wysiwyg=FALSE
      end

      # If the WYSIWYG editor was used, show Main Block else show the Plugins
      if @wysiwyg
        gon.main=slide.main
      else
        gon.image_list=slide.content_blocks.map { |t|
          if !t.image.blank?
            t.image.path.gsub("#{Rails.root}/public", "")
          end
        }
        gon.caption=slide.content_blocks.map { |t| t.caption }
      end

      gon.titlepic=slide.titlepic
      gon.subtitle=slide.subtitle
      gon.font = slide.font
      gon.background = slide.background
      gon.plugin=0

      gon.image_list=slide.content_blocks.map { |t| t.image.path.gsub("#{Rails.root}/public/userdata/#{@presentation.user.name.downcase.gsub(" ", "_")}/#{@presentation.name.downcase.gsub(" ", "_")}/#{slide.id}", "assets/img/#{slide.id}") }

      gon.caption=slide.content_blocks.map { |t| t.caption }
      gon.fontarray = @fontarray
      gon.fontadjustment = @fontadjustment
      gon.widget_list=[slide.layout]
      @plugin="#{@plugin_category}/#{slide.layout}"
      #If you are getting error in this line, you haven't saved the slide, save the slide first
      plugin_layout=t(:plugins)[s][:"#{slide.layout}"][:layout]

      #For including best suited layout for selected plugins and executing it's function
      @plugin_layout=t(:plugins)[s][:"#{slide.layout}"][:layout]
      gon.plugin_layout="#{@plugin_layout}()"

      FileUtils.cp_r("#{Rails.root}/app/assets/plugins/#{@plugin_category}/#{slide.layout}/", "#{Rails.root}/public/slides/assets/")
      FileUtils.cp_r("#{Rails.root}/app/assets/layouts/#{plugin_layout}.css", "#{Rails.root}/public/slides/assets/")
      ##################################################
      @slide=slide
      File.open("#{Rails.root}/public/slides/#{slide.id}.html", 'w') { |f| f.write(render_to_string(:file => 'home/view_deck').gsub('/assets', 'assets').gsub('themes.css', 'theme.css').gsub("#{@plugin_category}/", '').gsub("/userdata/#{@presentation.user.name.downcase.gsub(" ", "_")}/#{@presentation.name.downcase.gsub(" ", "_")}/images/title_pic/", "assets/img/")) }
    end
    @zipped_name = (@presentation.name).gsub(" ", "_")
    Dir.chdir("#{Rails.root}/public/slides/")
    system("zip -r #{@zipped_name} . ")
    send_file "#{Rails.root}/public/slides/#{@zipped_name}.zip"
    system("rm -rf #{Rails.root}/public/slides/assets/")
    system("rm -rf #{Rails.root}/public/slides/*.html")
    #render :text=>'success'
  end



  def view_prez
    @presentation=Presentation.find(params[:id])
    redirect_to builder_path(@presentation.slides.first.id, @presentation.slides.first.layout, @presentation.slides.first.font, @presentation.slides.first.background, TRUE)
  end
end
