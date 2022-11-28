from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

# create profile model


class Profile(models.Model):
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="UserProfile")
    followers = models.ManyToManyField(
        "User", related_name="userFollowers", null=True, blank=True)
    following = models.ManyToManyField(
        "User", related_name="userFollowing", null=True, blank=True)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.user,
            "followerCount": self.followers.count(),
            "followerList": self.followers.all(),
            "followingCount": self.following.count(),
            "followingList": self.following.all()
        }


# create post model


class Post(models.Model):
    content = models.CharField(max_length=280, default="")
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(
        "Profile", related_name="likedPost", null=True, blank=True)
    creator = models.ForeignKey(
        "Profile", on_delete=models.PROTECT, related_name="postCreator")

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "creator": self.creator.user,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "like_count": self.likes.count(),
            "like_list": self.likes.all()
        }
