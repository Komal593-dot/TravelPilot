const API_URL = "http://127.0.0.1:8000";


export async function generateTripPlan(trip) {

  const response = await fetch(
    `${API_URL}/plan`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        destination:
          trip.destination,

        budget:
          Number(trip.budget),

        interests:
          trip.interests,

        start_date:
          trip.startDate,

        end_date:
          trip.endDate,

      }),
    }
  );


  const data =
    await response.json();


  if (
    !response.ok ||
    data.error
  ) {

    throw new Error(
      data.error ||
      "Failed to generate trip plan"
    );

  }


  return data;

}


export async function replanTrip(
  trip,
  unavailablePlaceIds
) {

  const response = await fetch(
    `${API_URL}/replan`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({

        destination:
          trip.destination,

        budget:
          Number(trip.budget),

        interests:
          trip.interests,

        start_date:
          trip.startDate,

        end_date:
          trip.endDate,

        unavailable_place_ids:
          unavailablePlaceIds,

      }),
    }
  );


  const data =
    await response.json();


  if (
    !response.ok ||
    data.error
  ) {

    throw new Error(
      data.error ||
      "Failed to replan trip"
    );

  }


  return data;

}