import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FitBounds({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (!locations.length) return;

    const bounds = L.latLngBounds(
      locations.map((place) => [place.lat, place.lon])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [locations, map]);

  return null;
}

function MapView({ trip, selectedDay }) {
  // Support both frontend and backend formats
  const allDays = trip?.itinerary || trip?.days || [];

  const day = allDays.find(
    (item) =>
      item.day_number === selectedDay ||
      item.day === selectedDay
  );

  const activities = day?.activities || [];

  // Accept lat/lon or latitude/longitude
  const locations = activities
    .map((activity) => ({
      ...activity,
      lat: Number(activity.lat ?? activity.latitude),
      lon: Number(
        activity.lon ??
        activity.lng ??
        activity.longitude
      ),
    }))
    .filter(
      (activity) =>
        Number.isFinite(activity.lat) &&
        Number.isFinite(activity.lon)
    );

  if (!locations.length) {
    return (
      <div className="h-full min-h-[500px] flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="text-5xl mb-4">🗺️</div>

          <h3 className="text-lg font-semibold text-slate-700">
            Map unavailable
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Activity coordinates are missing.
          </p>
        </div>
      </div>
    );
  }

  const center = [
    locations[0].lat,
    locations[0].lon,
  ];

  const route = locations.map((place) => [
    place.lat,
    place.lon,
  ]);

  return (
    <div className="h-[500px] w-full">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds locations={locations} />

        {route.length > 1 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#2563eb",
              weight: 5,
              opacity: 0.75,
            }}
          />
        )}

        {locations.map((activity, index) => (
          <Marker
            key={`${activity.name}-${index}`}
            position={[
              activity.lat,
              activity.lon,
            ]}
          >
            <Popup>
              <div>
                <strong>{activity.name}</strong>

                {activity.category && (
                  <div>
                    {activity.category}
                  </div>
                )}

                {activity.start_time &&
                  activity.end_time && (
                    <div>
                      🕐 {activity.start_time} -{" "}
                      {activity.end_time}
                    </div>
                  )}

                {activity.cost !== undefined && (
                  <div>
                    💰 ₹{activity.cost}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;