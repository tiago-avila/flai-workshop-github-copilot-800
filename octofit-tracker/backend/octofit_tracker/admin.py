from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'team', 'created_at']
    search_fields = ['name', 'email', 'team']
    list_filter = ['team', 'created_at']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name', 'description']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'type', 'duration', 'distance', 'calories', 'date']
    search_fields = ['user_id', 'type']
    list_filter = ['type', 'date']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['rank', 'user_id', 'team', 'total_calories', 'total_duration', 'total_distance', 'last_updated']
    search_fields = ['user_id', 'team']
    list_filter = ['team']
    ordering = ['rank']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'duration', 'difficulty']
    search_fields = ['name', 'type', 'difficulty']
    list_filter = ['type', 'difficulty']
