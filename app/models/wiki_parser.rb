class WikiParser < WikiCloth::Parser

  link_attributes_for do |page|
    {:href => url_for(page)}
  end

  template do |template|
    "Hello {{{1}}}" if template == "hello"
  end

  external_link do |url, text|
    "<a href=\"#{url}\" target=\"_blank\" class=\"exlink\">#{text.blank? ? url : text}</a>"
  end

end
