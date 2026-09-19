import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MUMBAI_COORDINATES = {
  "Gateway of India": [18.921984, 72.834654],
  "Marine Drive": [18.943131, 72.823463],
  CSMT: [18.94017, 72.83559],
  "Sanjay Gandhi National Park": [19.214706, 72.91062],
  "Elephanta Caves": [18.963347, 72.931591],
  "Juhu Beach": [19.0883, 72.8265],
  "Bandra Fort": [19.0437, 72.8198],
  "Crawford Market": [18.9478, 72.83],
  "Colaba Causeway": [18.9227, 72.8317],
  "Siddhivinayak Temple": [19.0169, 72.8306],
};

const GOA_COORDINATES = {
  "Baga Beach": [15.5557, 73.7517],
  "Calangute Beach": [15.5439, 73.7553],
  "Fort Aguada": [15.492, 73.7736],
  "Basilica of Bom Jesus": [15.5009, 73.9117],
  "Dudhsagar Falls": [15.3144, 74.3148],
  "Anjuna Beach": [15.5736, 73.7405],
  "Chapora Fort": [15.6133, 73.7396],
  "Palolem Beach": [15.01, 74.0232],
};

function MapAutoFit({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions.length) return;

    if (positions.length === 1) {
      map.setView(positions[0], 13);
      return;
    }

    const bounds = L.latLngBounds(positions);

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [map, positions]);

  return null;
}

function MapView({ trip, selectedDay }) {
  const days = trip?.itinerary?.days || [];

  const selectedDayData =
    days.find(
      (day) => day.day_number === selectedDay
    ) || days[0];

  const activities =
    selectedDayData?.activities || [];

  const destination =
    trip?.destination?.toLowerCase() || "";

  const coordinates = destination.includes("goa")
    ? GOA_COORDINATES
    : MUMBAI_COORDINATES;

  const mappedActivities = activities
    .map((activity) => {
      const coords = coordinates[activity.name];

      if (!coords) return null;

      return {
        ...activity,
        coords,
      };
    })
    .filter(Boolean);

  const positions = mappedActivities.map(
    (activity) => activity.coords
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
              Live Trip Map
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Day {selectedDayData?.day_number || 1} Route
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Showing activities and estimated travel for this day.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            {mappedActivities.length} stops
          </div>
        </div>
      </div>

      <div className="h-[420px] w-full">
        {mappedActivities.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <div className="text-4xl mb-3">
                🗺️
              </div>

              <h3 className="font-semibold text-slate-800">
                No mapped activities
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                There are no activities with map coordinates
                for this day.
              </p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={positions[0]}
            zoom={12}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapAutoFit positions={positions} />

            {positions.length > 1 && (
              <Polyline
                positions={positions}
                pathOptions={{
                  color: "#2563eb",
                  weight: 5,
                  opacity: 0.8,
                }}
              />
            )}

            {mappedActivities.map(
              (activity, index) => (
                <Marker
                  key={`${activity.place_id}-${index}`}
                  position={activity.coords}
                  icon={markerIcon}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <p className="text-xs font-semibold text-blue-600 uppercase">
                        Stop {index + 1}
                      </p>

                      <h3 className="font-bold text-slate-900 mt-1">
                        {activity.name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {activity.location}
                      </p>

                      <div className="mt-2 text-xs text-slate-600">
                        <div>
                          🕐 {activity.start_time} –{" "}
                          {activity.end_time}
                        </div>

                        <div className="mt-1">
                          💰{" "}
                          {activity.cost === 0
                            ? "Free"
                            : `₹${activity.cost}`}
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            )}
          </MapContainer>
        )}
      </div>

      {mappedActivities.length > 0 && (
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              TravelPilot route
            </div>

            <div className="text-sm text-slate-500">
              {selectedDayData?.total_travel_distance_km || 0} km
              {" • "}
              {selectedDayData?.total_travel_time_minutes || 0} min travel
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;