AgileDex::Application.routes.draw do

  match 'feedbacks' => 'feedbacks#create', :as => :feedback

  match 'feedbacks/new' => 'feedbacks#new', :as => :new_feedback

  mount Ckeditor::Engine => '/ckeditor'

  # Authentication Routes
  mount RailsAdmin::Engine => '/admin', :as => 'rails_admin'

  devise_for :users
  #devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  match '/wiki_prez/:name'=>'presentations#wiki_prez'
  match '/wiki_theme/:name/:id'=>'presentations#wiki_theme',:as=>'wiki_theme'
  match '/wiki_extract/:name/:id'=>'presentations#wiki_extract',:as=>'wiki_extract'
  match '/wiki_create/:name'=>'presentations#wiki_create',:as=>'wiki_create'
  match '/wiki_convert'=>'presentations#wiki_convert',:as=>'wiki_convert'
  match '/image_search/:name/:id'=>'presentations#image_search',:as=>'image_search'
  match '/wiki_combine'=>'presentations#wiki_combine',:as=>'wiki_combine'
  match '/wiki_make'=>'presentations#wiki_make',:as=>'wiki_make'

  match '/users/auth/:provider/callback' => 'authentications#create'
  match '/users/sign_in' => 'home#console'

  match 'get_slides'=>'home#get_slides',:as=>'get_slides'
  match 'move_slide_up'=>'home#move_slide_up',:as=>'move_slide_up'
  match 'move_slide_down'=>'home#move_slide_down',:as=>'move_slide_down'
  match 'delete_slide/(:presentation_id)'=>'home#delete_slide',:as=>'delete_slide'
  match 'create_guest_user'=>'home#create_guest_user',:as=>'create_guest_user'
  match 'slides/new/:presentation_id'=>'slides#new',:as=>'new_slide'

  # Page Routes
  match '/console/(:slide_id)', :to=>"home#console", :as=>"console"
  match '/demo', :to=>"home#index", :as=>"demo"

  # Slide Surfer Routes
  match '/slides/:id/:plugin/:font/:background/(:view)', :to=>"slides#builder", :as=>"builder"
  match '/save_slide', :to=>"slides#save_slide", :as=>"save_slide"
  match '/export/:id',:to=>'presentations#export',:as=>"export"
  match '/view_prez/:id',:to=>'presentations#view_prez',:as=>"view_prez"
  match '/view_deck/:id/(:slide_id)',:to=>'home#view_deck',:as=>"view_deck"

  # Ajax routes
  match '/presentations/new', :to=>"home#create_new_presentation", :as=>"new_presentation"
  match '/delete_presentation', :to=>"home#delete_presentation", :as=>"delete_presentation"
  match '/slides/new/(:presentation_id)', :to=>"slides#new"
  match '/slides/:id/edit/(:presentation_id)', :to=>"slides#edit"


  # CRUD Routes
  resources :authentications
  resources :slides

  # Root Route
  root :to => 'home#console'


end
