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

    def __str__(self):
        return str(self.user)


# create post model


class Post(models.Model):
    content = models.CharField(max_length=280, default="")
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(
        "Profile", related_name="likedPost", null=True, blank=True)
    creator = models.ForeignKey(
        "Profile", on_delete=models.PROTECT, related_name="postCreator")

    def __str__(self):
        return f"post by {self.creator} at {self.timestamp}"
