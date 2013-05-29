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
    #render :text=>@wikied.to_html.
    #return

    if @wikied.to_html.blank?
      render :text=>"Sorry can not create presentation on this topic"
      return
    else
      setData(@wikied)
      $query_string=@search_string
      redirect_to wiki_create_path
    end
    #@slides,@external_link,@external_text = scrap_it(@wikied.to_html,@search_string)

    #redirect_to view_deck_path(@presentation.id)
    #return
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

  def wiki_create
    @data=getData.to_html

    render :layout => 'layouts/present'
    return
  end

  def wiki_convert
    #For image search


    #Nokogiri initialisation
    html_doc=Nokogiri::HTML(getData.to_html)
    b=Array.new
    extra_link=Array.new
    extra_link_text= Array.new
    b[0]={"title" => $query_string, "main" => html_doc.xpath('//p')[0].text}
    #For each h2 tags
    html_doc.css('h2').each_with_index do |h2, index|
      if index < html_doc.css('h2').count-3
        #Find out the data between two succseeding h2 tags
        data=html_doc.xpath('//*[(preceding-sibling::h2/span/@id="'+html_doc.css('h2')[index].text.gsub('[edit] ', '').gsub(/ /, '_')+'") and (following-sibling::h2/span/@id="'+html_doc.css('h2')[(index+1)].text.gsub('[edit] ', '').gsub(/ /, '_')+'")]')
        #Check whether H3 tags are present in the data
        subtitle=data.css('h3')
        if !subtitle.nil?
          #Creaating the list of all h3 tag as subtitle and H2 as title
          b<<{"title" => html_doc.css('h2')[index].text.gsub('[edit] ', ''), "main" => subtitle.map { |p| p.text.gsub('[edit] ', '') }}
          #If data is present for h2 tag then create a slide for h2 tag
          if data.first == data.css('p').first
            if !data.first==""
              b<<{"title" => html_doc.css('h2')[index].text.gsub('[edit] ', ''), "main" => data.css('p').first.text.gsub(/\n/, '')}
            else
              b<<{"title" => html_doc.css('h2')[index].text.gsub('[edit] ', ''), "main" => data.css('p').text.gsub(/\n/, '')}
            end
          end
        end
        #For each H3 tag
        subtitle.each_with_index do |e, index|
          #To find out the 1st P tag
          main=e.next_element.text.gsub(/\n/, '')
          main1=e.next_element.next_element.text.gsub(/\n/, '')
          #Feting the data between two H3 tags
          if index<subtitle.count-1
            hdata=all_elements_between_two_h3(data, 'h3/span/@id="'+subtitle[index].text.gsub('[edit] ', '').gsub(/ /, '_')+'"', 'h3/span/@id="'+subtitle[(index+1)].text.gsub('[edit] ', '').gsub(/ /, '_')+'"')
          else
            hdata=all_elements_between_two_h3(data, 'h3/span/@id="'+subtitle[index].text.gsub('[edit] ', '').gsub(/ /, '_')+'"', 'h2/span/@id="'+html_doc.css('h2')[(index)].text.gsub('[edit] ', '')+'"')
          end
          #Checking whether H4 IS Present in hdata if yes then processing
          if hdata.css('h4').blank?
            if main.blank?
              main=main1
            end
            b<<{"title" => e.text.gsub('[edit] ',''), "main" => main}
          else
            b<<{"title" => e.text.gsub('[edit] ',''), "main" => hdata.css('h4').map { |p| p.text.gsub('[edit] ', '') }}
            hdata.css('h4').each do |h4|
              main=h4.next_element.text.gsub(/\n/, '')
              if main.blank?
                main=h4.next_element.next_element.text.gsub(/\n/, '')
              end
              b<<{"title" => h4.text.gsub('[edit] ', ''), "main" => main}
            end
          end
        end
      end
    end
    b=b.flatten

    #For the Feature of extra link from the 1st paragaraph
    html_doc.xpath('//p[1]//a/@href').each do |li|
      extra_link<<li.text
    end
    html_doc.xpath('//p[1]//a').each do |li|
      extra_link_text<<li.text
    end
    $slides=b
    render :text=>'Information extracted and transformed'
    #return b,extra_link,extra_link_text
  end

  def image_search
    agent=Mechanize.new
    agent.get("http://blekko.com/ws/?q=#{$query_string}/image&auth=1e50932d")
    page_html=agent.page.search(".images").to_html
    image_doc=Nokogiri::HTML(page_html)
    $images=image_doc.css("div a").map { |i| i['href'] }
    render :text=>"Finish Searching Images...."
  end

  def wiki_combine
    #To add images at each slide.
    $slides.each_with_index do |slide,index|
      slide["content_block"]= $images[index]
    end

    render :text=>"Finish combining Images and Information"
  end

  def wiki_make
    @presentation=Presentation.create!(:user_id => current_user.id, :name => $query_string)
    $slides.each do |i|
      if i["main"]==[] or i["main"]=='null'
        $slides.delete(i)
      end
    end
    $slides.each_with_index do |i, index|
      @count=1
      if index<1
        Slide.create!(:presentation_id => @presentation.id, :title => i["title"],:mode => "HTML", :layout => ['allcentered','left','right','top','bottom'].sample, :sequence => (@count))
        @count=@count+1
        @slide=Slide.create!(:presentation_id => @presentation.id, :title => i["title"], :main => i["main"].summarize,:mode => "HTML",:titlepic=>URI.parse(i["content_block"]), :layout => ['simple_title_content','fancy_title_content','left_fancy_title_content','centered_content'].sample, :sequence => (@count))
        #ContentBlock.create!(:slide_id => @slide.id, :image => URI.parse(i["content_block"]), :caption => "")
      else
        @count=@count+1
        Slide.create!(:presentation_id => @presentation.id, :title => i["title"], :main => (i["main"].summarize rescue i["main"]),:mode => "HTML",:titlepic=>URI.parse(i["content_block"]), :layout => ['fancy_title_content','left_fancy_title_content'].sample, :sequence => (@count))
        #ContentBlock.create!(:slide_id => @slide.id, :image => URI.parse(i["content_block"]), :caption => "")
      end
    end
    render :text=>"#{@presentation.id}|#{@slide.id}"
  end

end
