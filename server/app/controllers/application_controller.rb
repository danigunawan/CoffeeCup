class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :detect_device_variant

private

  def detect_device_variant
    case request.user_agent
    when /CoffeeCup/i
      request.variant = :native
    end
  end

  def current_user
    @current_user ||= (current_user_from_session || current_user_from_doorkeeper_token)
  end
  helper_method :current_user

  def current_user_from_session
    User.find(session[:user_id]) if session[:user_id]
  end

  def current_user_from_doorkeeper_token
    User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
  end

  def authorize
    puts ("User Agent: #{request.user_agent}")
    unless current_user
      session[:return_to] = request.original_url
      redirect_to login_url
    end
  end

end
