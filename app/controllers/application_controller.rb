class ApplicationController < ActionController::Base
  protect_from_forgery
  #before_filter :authenticate_user!
  skip_before_filter :verify_authenticity_token
  before_filter :set_cache_buster

  def set_cache_buster
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end


  def scrap_it(html,query_string)
    #For image search
    agent=Mechanize.new
    agent.get("http://blekko.com/ws/?q=#{query_string}/image&auth=1e50932d")
    page_html=agent.page.search(".images").to_html
    image_doc=Nokogiri::HTML(page_html)
    images=image_doc.css("div a").map { |i| i['href'] }

    #Nokogiri initialisation
    html_doc=Nokogiri::HTML(html)
    b=Array.new
    extra_link=Array.new
    extra_link_text= Array.new
    b[0]={"title" => query_string, "main" => html_doc.xpath('//p')[0].text}
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
    #To add images at each slide.
    b.each_with_index do |slide,index|
      slide["content_block"]= images[index]
    end

    #For the Feature of extra link from the 1st paragaraph
    html_doc.xpath('//p[1]//a/@href').each do |li|
      extra_link<<li.text
    end
    html_doc.xpath('//p[1]//a').each do |li|
      extra_link_text<<li.text
    end

    return b,extra_link,extra_link_text


  end

  #Function to extract in formation from link of the first paragraph of wiki documents
  def scrap_external(html)
    html_doc=Nokogiri::HTML(html)

    html_doc.css('.reference').remove
    html_doc.css('.editsection').remove
    html_doc.css('#toc').remove

    html_doc.xpath('//p[not(text())]').remove

    snippets=html_doc.xpath('//p[1]').text.to_s.gsub(/\n/, '')

    if snippets.blank?
      snippets="Could not find relevant data, try a different search?"
    end

    return snippets

  end


  def all_elements_between_two_h3(data, x, y)
    data=data.xpath('//*[(preceding-sibling::'+x+') and (following-sibling::'+y+')]')
  end



end
