Rails.application.config.middleware.use OmniAuth::Builder do
  #require 'omniauth-facebook'
  configure do |config|
    config.path_prefix = '/auth'
  end

  provider :facebook, '222280634572524', '25d7fbbc976579512a48c28fb1800490'
  provider :twitter, 'KnWQoa66ltimDwt4SshMEA', 'cwcc6FWj3yuvMRcReSHQqfwGkYWasjuUIGRVA2vfbM'
end

