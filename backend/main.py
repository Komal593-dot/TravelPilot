from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from data.places import (
    get_all_places,
    get_place_by_id,
    get_places_by_category,
    normalize_destination,
)

from data.planner import (
    generate_day_itinerary,
    generate_multi_day_itinerary,
)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------------
# REQUEST MODELS
# ----------------------------------------


class TripRequest(BaseModel):

    destination: str

    budget: float

    interests: list[str] = []

    start_date: str | None = None

    end_date: str | None = None


class ReplanRequest(BaseModel):

    destination: str

    budget: float

    interests: list[str] = []

    unavailable_place_ids: list[int] = []

    start_date: str | None = None

    end_date: str | None = None


# ----------------------------------------
# HOME
# ----------------------------------------


@app.get("/")
def home():

    return {
        "message":
            "TravelPilot backend is running!"
    }


# ----------------------------------------
# PLACES
# ----------------------------------------


@app.get("/places")
def places(
    destination: str = "Goa",
):

    normalized = normalize_destination(
        destination
    )

    results = get_all_places(
        normalized
    )

    return {
        "destination":
            normalized,

        "count":
            len(results),

        "places":
            results,
    }


@app.get("/places/{place_id}")
def place_details(
    place_id: int,
    destination: str = "Goa",
):

    normalized = normalize_destination(
        destination
    )

    place = get_place_by_id(
        place_id,
        normalized,
    )

    if place is None:

        return {
            "error":
                "Place not found"
        }

    return place


@app.get(
    "/places/category/{category}"
)
def places_by_category(
    category: str,
    destination: str = "Goa",
):

    normalized = normalize_destination(
        destination
    )

    results = get_places_by_category(
        category,
        normalized,
    )

    return {
        "destination":
            normalized,

        "category":
            category,

        "count":
            len(results),

        "places":
            results,
    }


# ----------------------------------------
# CREATE PLAN
# ----------------------------------------


@app.post("/plan")
def create_plan(
    trip: TripRequest
):

    destination = normalize_destination(
        trip.destination
    )


    available_places = get_all_places(
        destination
    )


    if not available_places:

        return {
            "destination":
                trip.destination,

            "budget":
                trip.budget,

            "interests":
                trip.interests,

            "error":
                (
                    "TravelPilot currently "
                    "supports Goa and Mumbai "
                    "in the demo dataset."
                ),
        }


    # ------------------------------------
    # MULTI-DAY PLAN
    # ------------------------------------

    if (
        trip.start_date
        and trip.end_date
    ):

        itinerary = (
            generate_multi_day_itinerary(

                destination=
                    destination,

                interests=
                    trip.interests,

                budget=
                    trip.budget,

                start_date=
                    trip.start_date,

                end_date=
                    trip.end_date,

            )
        )


    # ------------------------------------
    # FALLBACK SINGLE-DAY PLAN
    # ------------------------------------

    else:

        itinerary = (
            generate_day_itinerary(

                destination=
                    destination,

                interests=
                    trip.interests,

                budget=
                    trip.budget,

            )
        )


    return {

        "destination":
            trip.destination,

        "budget":
            trip.budget,

        "interests":
            trip.interests,

        "start_date":
            trip.start_date,

        "end_date":
            trip.end_date,

        "itinerary":
            itinerary,

    }


# ----------------------------------------
# REPLAN
# ----------------------------------------


@app.post("/replan")
def replan_trip(
    trip: ReplanRequest
):

    destination = normalize_destination(
        trip.destination
    )


    available_places = get_all_places(
        destination
    )


    if not available_places:

        return {

            "destination":
                trip.destination,

            "error":
                (
                    "TravelPilot currently "
                    "supports Goa and Mumbai "
                    "in the demo dataset."
                ),

        }


    # ------------------------------------
    # MULTI-DAY REPLAN
    # ------------------------------------

    if (
        trip.start_date
        and trip.end_date
    ):

        itinerary = (
            generate_multi_day_itinerary(

                destination=
                    destination,

                interests=
                    trip.interests,

                budget=
                    trip.budget,

                start_date=
                    trip.start_date,

                end_date=
                    trip.end_date,

                unavailable_place_ids=
                    trip.unavailable_place_ids,

            )
        )


    # ------------------------------------
    # SINGLE-DAY REPLAN
    # ------------------------------------

    else:

        itinerary = (
            generate_day_itinerary(

                destination=
                    destination,

                interests=
                    trip.interests,

                budget=
                    trip.budget,

                unavailable_place_ids=
                    trip.unavailable_place_ids,

            )
        )


    return {

        "destination":
            trip.destination,

        "budget":
            trip.budget,

        "interests":
            trip.interests,

        "start_date":
            trip.start_date,

        "end_date":
            trip.end_date,

        "unavailable_place_ids":
            trip.unavailable_place_ids,

        "itinerary":
            itinerary,

        "message":
            (
                "TravelPilot detected "
                "a disruption and "
                "replanned the itinerary."
            ),

    }