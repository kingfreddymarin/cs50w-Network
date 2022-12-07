from rest_framework import serializers
from .models import Post, Profile


# class LikeListingField(serializers.RelatedField):
#     def to_representation(self, value):
#         return value.likes.profile.username

class PostSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source='creator.user.username')
    likes = serializers.StringRelatedField(many=True)

    class Meta:
        model = Post
        fields = ('id', 'content', 'timestamp', 'creator', 'likes')


class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    followers = serializers.StringRelatedField(many=True)
    following = serializers.StringRelatedField(many=True)

    class Meta:
        model = Profile
        fields = ('id', 'user', 'followers', 'following')
