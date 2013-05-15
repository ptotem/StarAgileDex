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


  def scrap_it(html)
    tables=Array.new
    snippets=Array.new
    image_list=Array.new
    headings=Array.new
    extra_link_text=Array.new
    extra_link=Array.new

    html_doc=Nokogiri::HTML(html)

    html_doc.css('.reference').remove
    html_doc.css('.editsection').remove
    html_doc.css('#toc').remove

    html_doc.xpath('//p[not(text())]').remove
    html_doc.xpath('//table').each do |table|
      tables<<table.to_html.gsub!(/\n/, "")
      table.remove
    end
    @s
    html_doc.xpath('//p').each_with_index do |el,index|
      snippets<<el.text.to_s.gsub(/\n/,'')
      if index < 1
        @s=el
        el.xpath('//p[1]//a/@href').each do |li|
          extra_link<<li.text
          end
        el.xpath('//p[1]//a').each do |li|
          extra_link_text<<li.text
        end
      end
    end

    html_doc.xpath('//h2/span').each do |el|
      headings<<el.text.to_s.gsub(/\n/,'')
    end

    html_doc.xpath('//img/@src').each do |el|
      agent=Mechanize.new
      agent.get("http://en.wikipedia.org/w/api.php?action=query&titles=Image:#{el.text().gsub(/ /,"%20")}&prop=imageinfo&iiprop=url")
      @page=agent.page.search('span>a').to_s
      html_doc=Nokogiri::HTML(@page)
      @a=Array.new
      html_doc.xpath('//a/@href').each do |el|
        @a<<el
      end
      image_list<<@a[0].to_s
    end

    if snippets.blank?
      snippets<<"Could not find relevant data, try a different search?"
    end
    if tables.blank?
      tables<<"Could not find relevant data, try a different search?"
    end

    return snippets, tables, image_list, headings, extra_link,extra_link_text

  end

  #Function to extract in formation from link of the first paragraph of wiki documents
  def scrap_external(html)
    html_doc=Nokogiri::HTML(html)

    html_doc.css('.reference').remove
    html_doc.css('.editsection').remove
    html_doc.css('#toc').remove

    html_doc.xpath('//p[not(text())]').remove

    snippets=html_doc.xpath('//p[1]').text.to_s.gsub(/\n/,'')

    if snippets.blank?
      snippets="Could not find relevant data, try a different search?"
    end

    return snippets

  end

end
