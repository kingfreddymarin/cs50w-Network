
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # APIS
    path("tweet/", views.tweet, name="tweet"),
    path("posts/", views.getPosts, name="posts"),
    path("profiles/", views.getProfiles, name="profiles"),
    path("current/", views.current_user, name="currentUser")


]
