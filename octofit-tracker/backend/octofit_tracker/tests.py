from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            name="Test Hero",
            email="test@test.com",
            password="test_password",
            team="Test Team"
        )

    def test_user_creation(self):
        self.assertEqual(self.user.name, "Test Hero")
        self.assertEqual(self.user.email, "test@test.com")
        self.assertEqual(self.user.team, "Test Team")

    def test_user_str(self):
        self.assertEqual(str(self.user), "Test Hero")


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name="Test Team",
            description="Test Description",
            members=[]
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, "Test Team")
        self.assertEqual(self.team.description, "Test Description")

    def test_team_str(self):
        self.assertEqual(str(self.team), "Test Team")


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user_id="507f1f77bcf86cd799439011",
            type="running",
            duration=30,
            distance=5.0,
            calories=300,
            date=datetime.now(),
            notes="Great run!"
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.type, "running")
        self.assertEqual(self.activity.duration, 30)
        self.assertEqual(self.activity.calories, 300)


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(
            user_id="507f1f77bcf86cd799439011",
            team="Test Team",
            total_calories=1000,
            total_duration=120,
            total_distance=10.0,
            rank=1
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.entry.rank, 1)
        self.assertEqual(self.entry.total_calories, 1000)
        self.assertEqual(self.entry.team, "Test Team")


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name="Test Workout",
            type="gym",
            duration=60,
            difficulty="intermediate",
            description="Test description",
            exercises=["push-ups", "squats"]
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, "Test Workout")
        self.assertEqual(self.workout.type, "gym")
        self.assertEqual(self.workout.difficulty, "intermediate")

    def test_workout_str(self):
        self.assertEqual(str(self.workout), "Test Workout")


class UserAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            "name": "API Test User",
            "email": "apitest@test.com",
            "password": "test_password",
            "team": "API Team"
        }

    def test_create_user(self):
        response = self.client.post('/api/users/', self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

    def test_get_users(self):
        User.objects.create(**self.user_data)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TeamAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.team_data = {
            "name": "API Test Team",
            "description": "Test team description",
            "members": []
        }

    def test_create_team(self):
        response = self.client.post('/api/teams/', self.team_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_teams(self):
        Team.objects.create(**self.team_data)
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.activity_data = {
            "user_id": "507f1f77bcf86cd799439011",
            "type": "running",
            "duration": 30,
            "distance": 5.0,
            "calories": 300,
            "date": datetime.now().isoformat(),
            "notes": "Test run"
        }

    def test_create_activity(self):
        response = self.client.post('/api/activities/', self.activity_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_activities(self):
        Activity.objects.create(
            user_id=self.activity_data['user_id'],
            type=self.activity_data['type'],
            duration=self.activity_data['duration'],
            distance=self.activity_data['distance'],
            calories=self.activity_data['calories'],
            date=datetime.now(),
            notes=self.activity_data['notes']
        )
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.leaderboard_data = {
            "user_id": "507f1f77bcf86cd799439011",
            "team": "Test Team",
            "total_calories": 1000,
            "total_duration": 120,
            "total_distance": 10.0,
            "rank": 1
        }

    def test_create_leaderboard_entry(self):
        response = self.client.post('/api/leaderboard/', self.leaderboard_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_leaderboard(self):
        Leaderboard.objects.create(**self.leaderboard_data)
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.workout_data = {
            "name": "API Test Workout",
            "type": "gym",
            "duration": 60,
            "difficulty": "intermediate",
            "description": "Test workout",
            "exercises": ["push-ups", "squats"]
        }

    def test_create_workout(self):
        response = self.client.post('/api/workouts/', self.workout_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_workouts(self):
        Workout.objects.create(**self.workout_data)
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class APIRootTest(APITestCase):
    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)
