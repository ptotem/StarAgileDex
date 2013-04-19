Rails.application.config.middleware.use OmniAuth::Builder do
  #require 'omniauth-facebook'
  configure do |config|
    config.path_prefix = '/auth'
  end

  provider :facebook, '636324466384812', 'f65a3e41c1c8d6d97038cdf638a15387'
  provider :twitter, 'KnWQoa66ltimDwt4SshMEA', 'cwcc6FWj3yuvMRcReSHQqfwGkYWasjuUIGRVA2vfbM'
end

