from djongo import models


class User(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    team = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.name


class Team(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    members = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class Activity(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    user_id = models.CharField(max_length=24)
    type = models.CharField(max_length=50)
    duration = models.IntegerField()
    distance = models.FloatField(default=0)
    calories = models.IntegerField()
    date = models.DateTimeField()
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'activities'
        verbose_name_plural = 'Activities'

    def __str__(self):
        return f"{self.type} - {self.duration}min"


class Leaderboard(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    user_id = models.CharField(max_length=24)
    team = models.CharField(max_length=100)
    total_calories = models.IntegerField()
    total_duration = models.IntegerField()
    total_distance = models.FloatField()
    rank = models.IntegerField()
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'leaderboard'
        ordering = ['rank']

    def __str__(self):
        return f"Rank {self.rank} - {self.team}"


class Workout(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=50)
    duration = models.IntegerField()
    difficulty = models.CharField(max_length=50)
    description = models.TextField()
    exercises = models.JSONField()

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name
