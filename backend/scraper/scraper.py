# scraper.py
# Author: Larry Qiu
# Date: 1/9/2023
# Purpose: Periodically scrape the Tufts Dining website for 
# the menu and store it in MongoDB

import requests
from pymongo import MongoClient
import datetime
import pytz
import time

PREFIX = "https://tufts.api.nutrislice.com"

client = MongoClient('mongodb://mongo:27017/')
db = client['jumbo-appetit']
raw_scrape_results = db['raw-scrape-results']


def get_scraping_date_range():
    # Scraping Policy:
    # - All dates start on a Monday
    # - Begin scraping on the first Monday after a week ago
    # - If no dates are present in the database, begin scraping
    #   on the first Monday after one year ago
    # - End scraping on the first Monday after a month from now

    now = datetime.datetime.now(pytz.timezone('US/Eastern'))

    def first_monday_on_or_after(date):
        while date.weekday() != 0:
            date += datetime.timedelta(days=1)
        return date
    
    if raw_scrape_results.count_documents({}) == 0:
        start_date = first_monday_on_or_after(now - datetime.timedelta(days=365))

    else:
        start_date = first_monday_on_or_after(now - datetime.timedelta(days=7))

    end_date = first_monday_on_or_after(now + datetime.timedelta(days=30))

    return start_date, end_date


def get_schools():
    url = f"{PREFIX}/menu/api/schools/"
    r = requests.get(url, headers={"Accept": "application/json"})
    return r.json()

def get_weekly_menu(slug, menu_type, monday):
    url = f"{PREFIX}/menu/api/weeks/school/{slug}/menu-type/{menu_type}/{monday.year}/{monday.month}/{monday.day}/"
    r = requests.get(url, headers={"Accept": "application/json"})
    return r.json()

def scrape_all():
    schools = get_schools()
    start_date, end_date = get_scraping_date_range()
    result = {
        "scraping_start_date": start_date, 
        "scraping_end_date": end_date, 
        "scraping_date": datetime.datetime.now(),
    }

    for school in schools:
        slug = school['slug']

        result["slug"] = slug

        for menu_type in school["active_menu_types"]:
            monday = start_date
            menu_type_slug = menu_type["slug"]

            result["menu_type_slug"] = menu_type_slug

            while monday < end_date + datetime.timedelta(days=1):
                print(f"Scraping {slug} {menu_type_slug} {monday.year}/{monday.month}/{monday.day}")
                menu = get_weekly_menu(slug, menu_type_slug, monday)

                for day in menu["days"]:
                    result["date"] = day["date"]
                    result["scraping_result"] = day

                    raw_scrape_results.insert_one(result.copy())      
                monday += datetime.timedelta(days=7)
                time.sleep(1)

    return result

if __name__ == "__main__":
    result = scrape_all()
    raw_scrape_results.insert_one(result)