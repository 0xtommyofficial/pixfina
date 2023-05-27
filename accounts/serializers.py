from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password


User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    captcha = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password', 'captcha')
        extra_kwargs = {'password': {'write_only': True}}

    def to_internal_value(self, data):
        # call the parent method to get the validated_data
        validated_data = super().to_internal_value(data)

        # add the 'captcha' field to the validated_data
        validated_data['captcha'] = data.get('captcha', '')

        return validated_data

    def create(self, validated_data):

        user = User(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    new_password_repeat = serializers.CharField(required=True)

    def validate(self, data):
        if data.get('new_password') != data.get('new_password_repeat'):
            raise serializers.ValidationError({"new_password_repeat': 'Password fields didn't match."})
        return data

    def validate_new_password(self, value):
        validate_password(value)
        return value


class EmailChangeSerializer(serializers.Serializer):
    password = serializers.CharField(required=True)
    new_email = serializers.EmailField(required=True)
    # TODO: repeat email check to ensure user does not misspell their new email
