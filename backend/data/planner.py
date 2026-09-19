from math import radians, sin, cos, sqrt, atan2

from data.places import get_all_places


def time_to_minutes(time_string):
    hours, minutes = map(int, time_string.split(":"))
    return hours * 60 + minutes


def minutes_to_time(total_minutes):
    hours = total_minutes // 60
    minutes = total_minutes % 60

    return f"{hours:02d}:{minutes:02d}"


def calculate_distance_km(
    lat1,
    lon1,
    lat2,
    lon2,
):
    earth_radius_km = 6371

    lat1 = radians(lat1)
    lon1 = radians(lon1)

    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a),
    )

    return earth_radius_km * c


def estimate_travel_time(distance_km):

    average_speed_kmh = 25

    minutes = (
        distance_km
        / average_speed_kmh
        * 60
    )

    return max(
        5,
        round(minutes),
    )


def place_matches_interests(
    place,
    interests,
):

    if not interests:
        return True

    normalized_interests = [
        interest.lower()
        for interest in interests
    ]

    category = place[
        "category"
    ].lower()

    for interest in normalized_interests:

        clean_interest = (
            interest
            .replace("🏖", "")
            .replace("🍴", "")
            .replace("🏛", "")
            .replace("🌿", "")
            .replace("🛍", "")
            .replace("🎉", "")
            .strip()
        )

        if category in clean_interest:
            return True

    return False


def choose_nearest_place(
    current_place,
    available_places,
):

    if not available_places:
        return None

    if current_place is None:
        return available_places[0]

    return min(
        available_places,
        key=lambda place:
        calculate_distance_km(
            current_place["latitude"],
            current_place["longitude"],
            place["latitude"],
            place["longitude"],
        ),
    )


def generate_single_day_itinerary(
    destination,
    interests,
    budget,
    unavailable_place_ids=None,
    used_place_ids=None,
):

    places = get_all_places(
        destination
    )

    if unavailable_place_ids is None:
        unavailable_place_ids = []

    if used_place_ids is None:
        used_place_ids = []


    places = [
        place
        for place in places
        if place["id"]
        not in unavailable_place_ids
        and place["id"]
        not in used_place_ids
    ]


    matching_places = [
        place
        for place in places
        if place_matches_interests(
            place,
            interests,
        )
    ]


    if not matching_places:
        matching_places = places


    available_places = (
        matching_places.copy()
    )


    itinerary = []


    current_time = 9 * 60

    remaining_budget = float(
        budget
    )

    previous_place = None


    while available_places:

        place = choose_nearest_place(
            previous_place,
            available_places,
        )

        if place is None:
            break


        available_places.remove(
            place
        )


        opening = time_to_minutes(
            place["opening_time"]
        )

        closing = time_to_minutes(
            place["closing_time"]
        )


        distance_km = 0

        travel_minutes = 0


        if previous_place:

            distance_km = calculate_distance_km(
                previous_place[
                    "latitude"
                ],
                previous_place[
                    "longitude"
                ],
                place[
                    "latitude"
                ],
                place[
                    "longitude"
                ],
            )

            travel_minutes = (
                estimate_travel_time(
                    distance_km
                )
            )

            current_time += (
                travel_minutes
            )


        start_time = max(
            current_time,
            opening,
        )


        duration = place[
            "duration_minutes"
        ]

        end_time = (
            start_time + duration
        )


        # Keep the daytime schedule
        # inside 09:00–18:00.
        if start_time >= 18 * 60:
            continue


        if end_time > 18 * 60:
            continue


        if end_time > closing:
            continue


        if (
            place["cost"]
            > remaining_budget
        ):
            continue


        itinerary.append(
            {
                "place_id":
                    place["id"],

                "name":
                    place["name"],

                "category":
                    place["category"],

                "location":
                    place["location"],

                "start_time":
                    minutes_to_time(
                        start_time
                    ),

                "end_time":
                    minutes_to_time(
                        end_time
                    ),

                "duration_minutes":
                    duration,

                "cost":
                    place["cost"],

                "distance_from_previous_km":
                    round(
                        distance_km,
                        1,
                    ),

                "travel_time_minutes":
                    travel_minutes,
            }
        )


        remaining_budget -= (
            place["cost"]
        )

        current_time = end_time

        previous_place = place


    total_cost = sum(
        activity["cost"]
        for activity in itinerary
    )


    total_travel_distance = sum(
        activity[
            "distance_from_previous_km"
        ]
        for activity in itinerary
    )


    total_travel_time = sum(
        activity[
            "travel_time_minutes"
        ]
        for activity in itinerary
    )


    return {
        "activities":
            itinerary,

        "total_cost":
            total_cost,

        "remaining_budget":
            remaining_budget,

        "total_travel_distance_km":
            round(
                total_travel_distance,
                1,
            ),

        "total_travel_time_minutes":
            total_travel_time,
    }


def generate_multi_day_itinerary(
    destination,
    interests,
    budget,
    start_date,
    end_date,
    unavailable_place_ids=None,
):

    if unavailable_place_ids is None:
        unavailable_place_ids = []


    # Convert dates into Python dates.
    from datetime import date, timedelta

    start = date.fromisoformat(
        start_date
    )

    end = date.fromisoformat(
        end_date
    )


    if end < start:
        return {
            "error":
                "End date must be after start date."
        }


    number_of_days = (
        end - start
    ).days + 1


    # Split the activity budget across
    # the trip days.
    daily_budget = (
        float(budget)
        / number_of_days
    )


    days = []

    used_place_ids = []

    total_cost = 0

    total_distance = 0

    total_travel_time = 0


    for day_number in range(
        number_of_days
    ):

        current_date = (
            start
            + timedelta(
                days=day_number
            )
        )


        day_plan = (
            generate_single_day_itinerary(
                destination=destination,
                interests=interests,
                budget=daily_budget,
                unavailable_place_ids=(
                    unavailable_place_ids
                ),
                used_place_ids=(
                    used_place_ids
                ),
            )
        )


        day_activities = (
            day_plan["activities"]
        )


        # Remember activities already
        # assigned to previous days.
        for activity in day_activities:

            used_place_ids.append(
                activity["place_id"]
            )


        day_cost = day_plan[
            "total_cost"
        ]

        day_distance = day_plan[
            "total_travel_distance_km"
        ]

        day_travel_time = day_plan[
            "total_travel_time_minutes"
        ]


        total_cost += day_cost

        total_distance += (
            day_distance
        )

        total_travel_time += (
            day_travel_time
        )


        days.append(
            {
                "day_number":
                    day_number + 1,

                "date":
                    current_date.isoformat(),

                "activities":
                    day_activities,

                "total_cost":
                    day_cost,

                "remaining_budget":
                    day_plan[
                        "remaining_budget"
                    ],

                "total_travel_distance_km":
                    day_distance,

                "total_travel_time_minutes":
                    day_travel_time,
            }
        )


    return {
        "days":
            days,

        "total_cost":
            total_cost,

        "remaining_budget":
            float(budget) - total_cost,

        "total_travel_distance_km":
            round(
                total_distance,
                1,
            ),

        "total_travel_time_minutes":
            total_travel_time,

        "number_of_days":
            number_of_days,
    }


# Backwards-compatible function.
# Existing code can still call
# generate_day_itinerary().
def generate_day_itinerary(
    destination,
    interests,
    budget,
    unavailable_place_ids=None,
):

    return generate_single_day_itinerary(
        destination=destination,
        interests=interests,
        budget=budget,
        unavailable_place_ids=(
            unavailable_place_ids
        ),
    )