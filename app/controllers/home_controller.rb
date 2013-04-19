class HomeController < ApplicationController

  def index
    @themelist = ['Blackboard', 'Bluebird', 'Red Velvet']
    @fontarray = ['Century Gothic', 'Canela', 'Verdana', 'Arial']
    @fontadjustment= [0, 0, 0, 0]
    gon.fontarray = @fontarray
    gon.fontadjustment = @fontadjustment
    render :layout => false
  end

  def console
    #todo:Guest logout delete
    #todo:Counter on how many user logged in.(Analytics)
    if user_signed_in?
      @presentations = Presentation.order('created_at DESC').find_all_by_user_id(current_user.id)
    end

    if params[:slide_id].blank?
      @slide=Slide.new
      gon.edit=false
    else
      @slide=Slide.find(params[:slide_id])
      gon.edit=true
      gon.fieldset_id=@slide.content_blocks.map{|t| t.id}
      gon.presentation=@slide.presentation.name
      gon.presentation_id=@slide.presentation.id
      gon.slide_id=@slide.id
      gon.nosub=@slide.nosub
    end
    gon.titlepic=(@slide.titlepic.nil? ? false:true)
    render :layout => false
  end

  def get_slides
    @presentation = Presentation.find(params[:this_presentation_id][0])
    @slides = @presentation.slides.order(:sequence)
    @returning_data =Array.new
    @slides.each do |i|
      @returning_data<<"#{i.id}|#{i.title.titlecase}"
    end
    render :text => @returning_data
    return
  end

  def move_slide_up
    @slide = Slide.find(params[:slide_id][0])
    @prev_slide=Slide.find_by_next_slide(@slide.id)

    s=@slide.sequence
    @slide.sequence=@prev_slide.sequence
    @prev_slide.sequence=s

    @prev_slide.next_slide=@slide.next_slide
    @slide.next_slide=@prev_slide.id

    @slide.save
    @prev_slide.save

    render :text => @new_slide_sequence
    return
  end

  def move_slide_down
    @slide = Slide.find(params[:slide_id][0])
    @next_slide=Slide.find(@slide.next_slide)

    s=@slide.sequence

    @slide.sequence=@next_slide.sequence
    @slide.next_slide=@next_slide.next_slide

    @next_slide.sequence=s
    @next_slide.next_slide=@slide.id

    @slide.save
    @next_slide.save

    render :text => @new_slide_sequence
    return
  end


  def create_guest_user
    @user=User.create!(:email => "guest_#{Time.now.to_i}#{rand(99)}@agileDex.com", :role => "guest", :name => "guest_#{Time.now.to_i}#{rand(99)}")
    sign_in(:user, @user)
    redirect_to console_path
  end

  def del_slide
    @slide = Slide.find(params[:slide_id][0])
    @slide.destroy
    render :text => "Slide deletion successful."
    return
  end

  def create_new_presentation
    @presentation = Presentation.new
    @presentation.name=params[:presentation_name][0]
    if !user_signed_in?
      @user=User.create!(:email => "guest_#{Time.now.to_i}#{rand(99)}@agileDex.com", :role => "guest", :name => "guest_#{Time.now.to_i}#{rand(99)}")
      sign_in(:user, @user)
    end
    @presentation.user_id=current_user.id
    if @presentation.save
      if @presentation.user.email.include?("guest")
        render :text => "#{@presentation.id}|guest"
      else
        render :text=> "#{@presentation.id}|normal"
      end
    else
      render :text => "error in creating presentation"
    end
  end

  def delete_presentation
    @presentation = Presentation.find(params[:this_presentation_id][0])
    @presentation.destroy
    render :text => "Presentation Deleted"
  end


  def view_deck
    @presentation = Presentation.find(params[:id])
    if params[:slide_id].nil?
      @slide = @presentation.slides.order(:sequence).first
    else
      @slide = Slide.find(params[:slide_id])
    end

    @export=TRUE # This is the Screen View
    @view_deck=TRUE
    #@view_deck=FALSE
    gon.view_deck=@view_deck
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
    @plugin="#{@plugin_category}/#{@slide.layout}"
    #For including best suited layout for selected plugins and executing it's function
    #TODO: Check for plugins
    @plugin_layout=t(:plugins)[s][:"#{@slide.layout}"][:layout]
    gon.plugin_layout="#{@plugin_layout}()"
    # Put the contents into JS variables to be processed by master_init.js
    # ----------------------------------------


    gon.presentation_id=@slide.presentation.id
    gon.slide_id=@slide.id
    gon.next_slide = @slide.next_slide
    @prev_slide = Slide.find_by_next_slide(@slide.id) rescue nil
    gon.prev_slide = @prev_slide.id rescue nil

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
    gon.font = @slide.font
    gon.background = @slide.background
    gon.plugin=params[:plugin].to_i

    # ---------------------------------------

  end

end
