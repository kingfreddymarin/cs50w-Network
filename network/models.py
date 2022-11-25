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

    def serialize(self, user):
        return {
            "id": self.id,
            "username": self.user.username,
            "followerCount": self.followers.count(),
            "followerList": self.followers.all(),
            "following_count": self.following.count(),
            "followerList": self.followers.all(),
            "followAvailable": (not user.is_anonymous) and self.user != user
        }

    def __str__(self):
        return f"{self.user}"


# create post model


class Post(models.Model):
    content = models.CharField(max_length=280, default="")
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(
        "Profile", related_name="likedPost", null=True, blank=True)
    creator = models.ForeignKey(
        "Profile", on_delete=models.CASCADE, related_name="postCreator")

    def serialize(self, user):
        return {
            "id": self.id,
            "content": self.content,
            "post_creator": self.creator.username,
            "post_creator_id": self.creator.id,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "like_count": self.likes.count(),
            "like_list": self.likes.all(),
            "isEditable": self.creator.user == user
            # "isLiked": not user.is_anonymous and self in
        }

    def __str__(self):
        return f"{self.creator.user} tweeted {self.content} @ {self.timestamp}"
