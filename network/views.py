import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.serializers import serialize
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.paginator import Paginator

from .models import User, Profile, Post
from .serializers import PostSerializer, ProfileSerializer


def index(request):
    return render(request, "network/posts.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            profile = Profile(user=user)
            user.save()
            profile.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def tweet(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    content = request.POST["content"]
    creator = request.user
    user = User.objects.get(username=creator)
    creator = Profile.objects.get(user=user)
    newTweet = Post(
        content=content,
        creator=creator
    )
    newTweet.save()
    return HttpResponseRedirect(reverse("index"))


def following(request):
    return render(request, "network/following.html")


@api_view(['GET'])
def getPosts(request):
    posts = Post.objects.all().order_by('-timestamp')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProfiles(request):
    profiles = Profile.objects.all()
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data)
# get current user


@api_view(['GET'])
def current_user(request):
    user = request.user
    profile = Profile.objects.get(user=user)
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)


@api_view(['POST'])
def like(request):
    postId = request.data["id"]
    post = Post.objects.get(id=postId)
    currentUser = request.data["currentUser"]
    user = User.objects.get(username=currentUser)
    userId = user.id
    profile = Profile.objects.get(user=userId)
    post.likes.add(profile)
    return Response(request.data)


@api_view(['POST'])
def dislike(request):
    postId = request.data["id"]
    post = Post.objects.get(id=postId)
    currentUser = request.data["currentUser"]
    user = User.objects.get(username=currentUser)
    userId = user.id
    profile = Profile.objects.get(user=userId)
    post.likes.remove(profile)
    return Response(request.data)


@api_view(['POST'])
def follow(request):
    currentUser = User.objects.get(username=request.data["currentUser"])
    currentUserId = currentUser.id
    currentUserProfile = Profile.objects.get(user=currentUserId)
    targetUser = User.objects.get(username=request.data["targetUser"])
    targetUserId = targetUser.id
    targetUserProfile = Profile.objects.get(user=targetUserId)
    currentUserProfile.following.add(targetUser)
    targetUserProfile.followers.add(currentUser)
    return Response(request.data)


@api_view(['POST'])
def unfollow(request):
    currentUser = User.objects.get(username=request.data["currentUser"])
    currentUserId = currentUser.id
    currentUserProfile = Profile.objects.get(user=currentUserId)
    targetUser = User.objects.get(username=request.data["targetUser"])
    targetUserId = targetUser.id
    targetUserProfile = Profile.objects.get(user=targetUserId)
    currentUserProfile.following.remove(targetUser)
    targetUserProfile.followers.remove(currentUser)
    return Response(request.data)


@api_view(['POST'])
def edit(request):
    postId = request.data["id"]
    post = Post.objects.get(id=postId)
    newContent = request.data["newContent"]
    post.content = newContent
    post.save()
    return Response(request.data)
