from schema import *
from database import db
import typing
from datetime import datetime, timedelta
from ruamel.yaml import YAML

raw_scrape_results = db["raw-scrape-results"]
raw_scrape_results.create_index([("scraping_result.menu_items.hash", 1)])
raw_scrape_results.create_index([("slug", 1), ("menu_type_slug", 1), ("date", 1), ("scraping_date", 1)])

latest_item_version_cache = db["latest-item-version-cache"]
latest_item_version_cache.create_index("cache_date", expireAfterSeconds=60 * 60 * 24)
latest_item_version_cache.create_index("hashes")

food_versions = {}
food_properties = {}
locations = {}

def hash_unhashed_scraped_results():
    query = {
        "scraping_result.menu_items.hash": {"$exists": False}
    }

    for result in raw_scrape_results.find(query):
        menu_items = result["scraping_result"]["menu_items"]
        new_menu_items = []
        for item in menu_items:
            menu_item = scrape_to_menu_item(item)
            if menu_item is None:
                continue
            item["hash"] = menu_item.hash
            
            new_menu_items.append(item)

        raw_scrape_results.update_one(
            {"_id": result["_id"]},
            {"$set": {"scraping_result.menu_items": menu_items}}
        )

def find_best_scrape_result(date_str: Date, slug: str, menu_type_slug: str) -> Optional[dict[str, Any]]:
    date = datetime.strptime(date_str, "%Y-%m-%d")
    # First, find the youngest scrape result that is on or before the date
    query = {
        "scraping_date": {"$lte": date + timedelta(days=1)},
        "date": date_str,
        "slug": slug,
        "menu_type_slug": menu_type_slug
    }

    results = list(raw_scrape_results.find(query).sort("scraping_date", -1).limit(1))

    if len(results) == 0:
        # if there are no scrape results on or before the date, find the oldest scrape result that is on or after the date
        query = {
            "scraping_date": {"$gte": date - timedelta(days=1)},
            "date": date_str,
            "slug": slug,
            "menu_type_slug": menu_type_slug
        }

        results = list(raw_scrape_results.find(query).sort("scraping_date", 1).limit(1))

    if len(results) == 0:
        return None
    
    return results[0]

    
def get_unique_hashes() -> list[dict[str, Any]]:
    result = raw_scrape_results.aggregate([
        {
            '$unwind': {
                'path': '$scraping_result.menu_items', 
                'preserveNullAndEmptyArrays': False
            }
        }, {
            '$group': {
                '_id': '$scraping_result.menu_items.hash', 
                'foodName': {
                    '$first': '$scraping_result.menu_items.food.name'
                }
            }
        }
    ])

    return list(result)

def get_food_properties() -> list[FoodProperty]:
    result = raw_scrape_results.aggregate([
        {
            '$unwind': {
                'path': '$scraping_result.menu_items', 
                'preserveNullAndEmptyArrays': False
            }
        }, {
            '$unwind': {
                'path': '$scraping_result.menu_items.food.icons.food_icons', 
                'preserveNullAndEmptyArrays': False
            }
        }, {
            '$group': {
                '_id': '$scraping_result.menu_items.food.icons.food_icons.slug', 
                'foodName': {
                    '$first': '$scraping_result.menu_items.food.icons.food_icons.name'
                }, 
                'description': {
                    '$first': '$scraping_result.menu_items.food.icons.food_icons.help_text'
                }
            }
        }
    ])

    return [FoodProperty(slug=food_property["_id"], name=food_property["foodName"], description=food_property["description"], displayed=False) for food_property in result]

def get_locations() -> list[Location]:
    result = raw_scrape_results.aggregate([
        {
            '$group': {
                '_id': [
                    '$slug', '$menu_type_slug'
                ]
            }
        }
    ])

    locations = {}

    for raw_location in result:
        slug, menu_type_slug = raw_location["_id"]
        if slug not in locations:
            locations[slug] = Location(slug=slug, name=slug, menu_types=[], displayed=False)
        
        locations[slug].menu_types.append(MenuType(slug=menu_type_slug, name=menu_type_slug, displayed=False))

    return list(locations.values())

def reload_food_versions():
    global food_versions

    file_path = "config/food_versions.yml"

    yaml = YAML()
    
    with open(file_path, 'r') as file:
        food_versions = yaml.load(file)

    if food_versions is None:
        food_versions = {}
    
    unique_hashes = get_unique_hashes()

    existing_hashes = set([hash for hashes in food_versions.values() for hash in hashes])
    for unique_hash in unique_hashes:
        hash = unique_hash["_id"]
        food_name = unique_hash["foodName"]

        if hash is None:
            continue

        
        if hash not in existing_hashes:
            if food_name not in food_versions:
                food_versions[food_name] = []

            food_versions[food_name].append(hash)

    with open(file_path, 'w') as file:
        yaml.dump(dict(sorted(food_versions.items())), file)

    print("Food versions reloaded", flush=True)

reload_food_versions()

def reload_food_properties():
    global food_properties

    file_path = "config/food_properties.yml"

    yaml = YAML()

    yaml.register_class(FoodProperty)

    with open(file_path, 'r') as file:
        food_properties = yaml.load(file)

    if food_properties is None:
        food_properties = {}

    food_properties = {key: FoodProperty(**value) for key, value in food_properties.items()}
    
    unique_food_properties = get_food_properties()

    existing_food_properties = set([food_property.slug for food_property in food_properties.values()])
    for food_property in unique_food_properties:
        if food_property.slug not in existing_food_properties:
            food_properties[food_property.slug] = food_property

    with open(file_path, 'w') as file:
        yaml.dump(dict(sorted([(key, value.model_dump()) for key, value in food_properties.items()])), file)

    print("Food properties reloaded", flush=True)

reload_food_properties()

def reload_locations():
    global locations

    file_path = "config/locations.yml"

    yaml = YAML()

    yaml.register_class(Location)

    with open(file_path, 'r') as file:
        locations = yaml.load(file)

    if locations is None:
        locations = {}

    locations = {key: Location(**value) for key, value in locations.items()}
    
    unique_locations = get_locations()

    existing_locations = set([location.slug for location in locations.values()])
    for location in unique_locations:
        if location.slug not in existing_locations:
            locations[location.slug] = location

    with open(file_path, 'w') as file:
        yaml.dump(dict(sorted([(key, value.model_dump()) for key, value in locations.items()])), file)

    print("Locations reloaded", flush=True)

reload_locations()

def find_latest_item_version(hash: MenuItemHash) -> Optional[DatedMenuItem]:
    result = latest_item_version_cache.find_one({"hashes": hash})

    if result is not None:
        del result["_id"]
        del result["cache_date"]
        del result["hashes"]

        return DatedMenuItem(**result)

    sibling_hashes = None

    for food_name, hashes in food_versions.items():
        if hash in hashes:
            sibling_hashes = hashes
            break

    if sibling_hashes is None:
        sibling_hashes = [hash]
    
    query = [
        {
            '$match': {
                'scraping_result.menu_items.hash': {
                    '$in': sibling_hashes
                }
            }
        },
        {
            '$unwind': {
                'path': '$scraping_result.menu_items', 
                'preserveNullAndEmptyArrays': False
            }
        }, {
            '$match': {
                'scraping_result.menu_items.hash': {
                    '$in': sibling_hashes
                }
            }
        }, {
            '$addFields': {
                'date': {
                    '$toDate': '$date'
                }
            }
        }, {
            '$sort': {
                'scraping_date': -1, 
                'date': -1
            }
        }, {
            '$limit': 1
        }
    ]

    result = list(raw_scrape_results.aggregate(query))

    if len(result) == 0:
        return None
    
    result = result[0]

    menu_item = scrape_to_menu_item(result["scraping_result"]["menu_items"])

    if menu_item is None:
        return None
    
    dated_menu_item = DatedMenuItem(menu_item=menu_item, date=result["scraping_result"]["date"], latest_version=None)

    cache_item = dated_menu_item.model_dump()
    cache_item["cache_date"] = datetime.now()
    cache_item["hashes"] = sibling_hashes
    latest_item_version_cache.insert_one(cache_item)

    return dated_menu_item

def scrape_to_menu(scraping_result: dict[str, Any]) -> Optional[MenuItem]:
    if "menu_info" not in scraping_result or "menu_items" not in scraping_result:
        return None
    date = scraping_result["date"]
    menu_info = scraping_result["menu_info"]
    menu_items = scraping_result["menu_items"]

    raw_sections = [{"id": key, "items": [], **value} for key, value in menu_info.items()]
    raw_sections.sort(key=lambda x: x["position"])

    for item in menu_items:
        for section in raw_sections:
            if str(item["menu_id"]) == str(section["id"]):
                section["items"].append(item)

    for section in raw_sections:
        section["items"].sort(key=lambda x: x["position"])

    menu = Menu(date = date, sections = [])

    for raw_section in raw_sections:
        if "section_options" not in raw_section or raw_section["section_options"] is None:
            raw_section["section_options"] = {"display_name": "None"}

        section = Menu.Section(name=str(raw_section["section_options"]["display_name"]), menu_items=[])
        for item in raw_section["items"]:
            menu_item = scrape_to_menu_item(item)
            if menu_item is None:
                continue
            section.menu_items.append(DatedMenuItem(menu_item=menu_item, date=date, latest_version=find_latest_item_version(menu_item.hash)))
        menu.sections.append(section)

    return menu

def get_menu(date: Date, slug: str, menu_type_slug: str) -> Optional[Menu]:
    result = find_best_scrape_result(date, slug, menu_type_slug)

    if result is None:
        return None
    
    return scrape_to_menu(result["scraping_result"])

