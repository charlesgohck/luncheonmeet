import uuid
import random
from datetime import datetime, timedelta
import lorem
import lorem
import random
import string

def generate_unique_sentence(length):
    """
    Generate a unique random sentence of a specific length.
    
    Parameters:
    n (int): Number of unique sentences to generate.
    length (int): Length of each sentence in characters.
    existing_sentences (set): A set of sentences already generated.
    
    Returns:
    set: A set of n unique random sentences.
    """
    return ''.join(random.choices(string.ascii_letters + ' ', k=length)).strip()

def generate_random_datetime(start, end):
    delta = end - start
    random_seconds = random.randint(0, int(delta.total_seconds()))
    random_datetime = start + timedelta(seconds=random_seconds)
    return random_datetime.isoformat()

def generate_city():
    cities = [
    "Tokyo, Japan",
    "New York, USA",
    "Paris, France",
    "London, United Kingdom",
    "Sydney, Australia",
    "Cape Town, South Africa",
    "Rio de Janeiro, Brazil",
    "Moscow, Russia",
    "Beijing, China",
    "Mumbai, India",
    "Los Angeles, USA",
    "Berlin, Germany",
    "Madrid, Spain",
    "Rome, Italy",
    "Toronto, Canada",
    "Mexico City, Mexico",
    "Seoul, South Korea",
    "Bangkok, Thailand",
    "Istanbul, Turkey",
    "Dubai, UAE"
    ]
    return random.choice(cities)

def generate_guid():
    return str(uuid.uuid4())


def generate_meetups(number_of_rows, start_time, end_time, last_updated_at, last_updated_by, created_by):
    for i in range(number_of_rows):
        title = lorem.sentence()
        description = lorem.sentence()
        query = f"INSERT INTO dbo.meetup (title, description, start_time, end_time, location, last_updated_at, last_updated_by, created_by) \
                VALUES ('{title}', '{description}', '{start_time}', '{end_time}', '{generate_city()}', '{last_updated_at}', '{last_updated_by}', '{created_by}');"
        print(query)

generate_meetups(200, '2025-12-12T00:00:00Z', '2025-12-12T08:00:00Z', '2024-12-12T00:00:00Z', 'test@gmail.com', 'test@gmail.com')
