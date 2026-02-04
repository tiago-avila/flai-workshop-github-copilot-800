from django.core.management.base import BaseCommand
from pymongo import MongoClient
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        db = client['octofit_db']

        # Delete existing data
        self.stdout.write('Deleting existing data...')
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Create unique index on email
        self.stdout.write('Creating unique index on email...')
        db.users.create_index([("email", 1)], unique=True)

        # Sample superhero data - Team Marvel
        marvel_heroes = [
            {
                "name": "Iron Man",
                "email": "tony.stark@marvel.com",
                "password": "hashed_password",
                "team": "Team Marvel",
                "created_at": datetime.now()
            },
            {
                "name": "Captain America",
                "email": "steve.rogers@marvel.com",
                "password": "hashed_password",
                "team": "Team Marvel",
                "created_at": datetime.now()
            },
            {
                "name": "Thor",
                "email": "thor.odinson@marvel.com",
                "password": "hashed_password",
                "team": "Team Marvel",
                "created_at": datetime.now()
            },
            {
                "name": "Black Widow",
                "email": "natasha.romanoff@marvel.com",
                "password": "hashed_password",
                "team": "Team Marvel",
                "created_at": datetime.now()
            },
            {
                "name": "Hulk",
                "email": "bruce.banner@marvel.com",
                "password": "hashed_password",
                "team": "Team Marvel",
                "created_at": datetime.now()
            }
        ]

        # Sample superhero data - Team DC
        dc_heroes = [
            {
                "name": "Batman",
                "email": "bruce.wayne@dc.com",
                "password": "hashed_password",
                "team": "Team DC",
                "created_at": datetime.now()
            },
            {
                "name": "Superman",
                "email": "clark.kent@dc.com",
                "password": "hashed_password",
                "team": "Team DC",
                "created_at": datetime.now()
            },
            {
                "name": "Wonder Woman",
                "email": "diana.prince@dc.com",
                "password": "hashed_password",
                "team": "Team DC",
                "created_at": datetime.now()
            },
            {
                "name": "Flash",
                "email": "barry.allen@dc.com",
                "password": "hashed_password",
                "team": "Team DC",
                "created_at": datetime.now()
            },
            {
                "name": "Aquaman",
                "email": "arthur.curry@dc.com",
                "password": "hashed_password",
                "team": "Team DC",
                "created_at": datetime.now()
            }
        ]

        # Insert users
        self.stdout.write('Inserting users...')
        users_result = db.users.insert_many(marvel_heroes + dc_heroes)
        user_ids = users_result.inserted_ids

        # Create teams
        self.stdout.write('Inserting teams...')
        teams = [
            {
                "name": "Team Marvel",
                "description": "Earth's Mightiest Heroes",
                "members": [users_result.inserted_ids[i] for i in range(5)],
                "created_at": datetime.now()
            },
            {
                "name": "Team DC",
                "description": "Justice League",
                "members": [users_result.inserted_ids[i] for i in range(5, 10)],
                "created_at": datetime.now()
            }
        ]
        teams_result = db.teams.insert_many(teams)

        # Create activities
        self.stdout.write('Inserting activities...')
        activities = []
        activity_types = ["running", "cycling", "swimming", "gym", "yoga", "walking"]
        
        for i, user_id in enumerate(user_ids):
            # Each user has 5-10 activities
            for _ in range(random.randint(5, 10)):
                activity_type = random.choice(activity_types)
                activities.append({
                    "user_id": user_id,
                    "type": activity_type,
                    "duration": random.randint(15, 120),  # minutes
                    "distance": round(random.uniform(1.0, 20.0), 2) if activity_type in ["running", "cycling", "walking"] else 0,
                    "calories": random.randint(100, 800),
                    "date": datetime.now() - timedelta(days=random.randint(0, 30)),
                    "notes": f"Great {activity_type} session!"
                })
        
        db.activities.insert_many(activities)

        # Create leaderboard entries
        self.stdout.write('Inserting leaderboard entries...')
        leaderboard = []
        
        for i, user_id in enumerate(user_ids):
            user_activities = [a for a in activities if a['user_id'] == user_id]
            total_calories = sum(a['calories'] for a in user_activities)
            total_duration = sum(a['duration'] for a in user_activities)
            total_distance = sum(a['distance'] for a in user_activities)
            
            leaderboard.append({
                "user_id": user_id,
                "team": "Team Marvel" if i < 5 else "Team DC",
                "total_calories": total_calories,
                "total_duration": total_duration,
                "total_distance": round(total_distance, 2),
                "rank": 0,  # Will be calculated
                "last_updated": datetime.now()
            })
        
        # Sort by total calories and assign ranks
        leaderboard.sort(key=lambda x: x['total_calories'], reverse=True)
        for idx, entry in enumerate(leaderboard):
            entry['rank'] = idx + 1
        
        db.leaderboard.insert_many(leaderboard)

        # Create workout suggestions
        self.stdout.write('Inserting workout suggestions...')
        workouts = [
            {
                "name": "Superhero Strength Training",
                "type": "gym",
                "duration": 60,
                "difficulty": "advanced",
                "description": "High-intensity strength training for superhero-level power",
                "exercises": ["bench press", "squats", "deadlifts", "pull-ups"]
            },
            {
                "name": "Speedster Cardio",
                "type": "running",
                "duration": 30,
                "difficulty": "intermediate",
                "description": "Speed training for enhanced endurance",
                "exercises": ["sprint intervals", "hill runs", "tempo runs"]
            },
            {
                "name": "Warrior Flexibility",
                "type": "yoga",
                "duration": 45,
                "difficulty": "beginner",
                "description": "Flexibility and balance training",
                "exercises": ["warrior pose", "downward dog", "tree pose", "meditation"]
            },
            {
                "name": "Aquatic Power",
                "type": "swimming",
                "duration": 45,
                "difficulty": "intermediate",
                "description": "Swimming workout for full-body strength",
                "exercises": ["freestyle", "backstroke", "butterfly", "diving"]
            },
            {
                "name": "City Patrol Cycling",
                "type": "cycling",
                "duration": 90,
                "difficulty": "intermediate",
                "description": "Endurance cycling for city heroes",
                "exercises": ["hill climbs", "sprint intervals", "long distance"]
            }
        ]
        
        db.workouts.insert_many(workouts)

        self.stdout.write(self.style.SUCCESS(f'Successfully populated database with:'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(user_ids)} users'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(teams)} teams'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(activities)} activities'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(leaderboard)} leaderboard entries'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(workouts)} workout suggestions'))
