Rails.application.config.middleware.use OmniAuth::Builder do
  #require 'omniauth-facebook'
  configure do |config|
    config.path_prefix = '/auth'
  end

  #old for server
  #provider :facebook, '222280634572524', '25d7fbbc976579512a48c28fb1800490'

  #new for dev
  provider :facebook, '636324466384812', 'f65a3e41c1c8d6d97038cdf638a15387'

  ##old for server
  #provider :twitter, 'KnWQoa66ltimDwt4SshMEA', 'cwcc6FWj3yuvMRcReSHQqfwGkYWasjuUIGRVA2vfbM'

  #new for dev
  provider :twitter, 'niPxGbAaE0VYqXbUbbqU2Q', 'T06zGce7p2hlOZuYLM1TqdJYTTlMwSXXQ6uCHBxKY'

end

