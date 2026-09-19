const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

async function request(
  endpoint,
  options = {}
) {
  let response;

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      }
    );
  } catch (error) {
    throw new Error(
      `Cannot connect to TravelPilot backend at ${API_URL}. Make sure FastAPI is running on port 8000.`
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Backend returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok || data.error) {
    throw new Error(
      data.error ||
        `TravelPilot backend error (${response.status}).`
    );
  }

  return data;
}

export async function generateTripPlan(trip) {
  return request("/plan", {
    method: "POST",
    body: JSON.stringify({
      destination: trip.destination,
      budget: Number(trip.budget),
      interests: trip.interests || [],
      start_date: trip.startDate,
      end_date: trip.endDate,
    }),
  });
}

export async function replanTrip(
  trip,
  unavailablePlaceIds = []
) {
  return request("/replan", {
    method: "POST",
    body: JSON.stringify({
      destination: trip.destination,
      budget: Number(trip.budget),
      interests: trip.interests || [],
      unavailable_place_ids:
        unavailablePlaceIds,
      start_date: trip.startDate,
      end_date: trip.endDate,
    }),
  });
}

export async function checkBackendHealth() {
  return request("/health");
}