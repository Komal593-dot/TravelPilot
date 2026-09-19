import {
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
  Car,
} from "lucide-react";

function TodayItinerary({
  trip,
  selectedDay,
}) {
  const days = trip?.itinerary?.days || [];

  const selectedDayData =
    days.find(
      (day) => day.day_number === selectedDay
    ) || days[0];

  const activities =
    selectedDayData?.activities || [];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-blue-600 font-semibold">
            Day {selectedDayData?.day_number || 1}
          </p>

          <h2 className="text-xl font-bold text-slate-900">
            {selectedDayData?.date
              ? formatDate(selectedDayData.date)
              : "Today's Itinerary"}
          </h2>
        </div>

        <button className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
          View full itinerary
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ACTIVITIES */}
      {activities.length === 0 ? (
        <div className="p-6 rounded-xl bg-slate-50 text-center">
          <div className="text-3xl mb-2">
            🗓️
          </div>

          <p className="text-slate-500">
            No activities have been scheduled for this day.
          </p>

          <p className="text-xs text-slate-400 mt-1">
            TravelPilot can replan when additional activities
            become available.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map(
            (activity, index) => (
              <div
                key={`${activity.place_id}-${index}`}
              >
                {/* ACTIVITY */}
                <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                  {/* TIME */}
                  <div className="w-28 shrink-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Clock
                        size={15}
                        className="text-slate-400"
                      />

                      {activity.start_time}
                    </div>

                    <p className="text-xs text-slate-400 mt-1 ml-5">
                      {activity.end_time}
                    </p>
                  </div>

                  {/* TIMELINE DOT */}
                  <div className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />

                  {/* ACTIVITY DETAILS */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {activity.name}
                    </h3>

                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {activity.location}
                    </p>
                  </div>

                  {/* CATEGORY */}
                  <span className="text-xs font-medium bg-white px-3 py-1 rounded-full text-slate-600 border">
                    {activity.category}
                  </span>

                  {/* COST */}
                  <div className="text-sm font-semibold text-slate-700 w-16 text-right">
                    {activity.cost === 0
                      ? "Free"
                      : `₹${activity.cost}`}
                  </div>
                </div>

                {/* TRAVEL BETWEEN ACTIVITIES */}
                {index <
                  activities.length - 1 && (
                  <div className="flex items-center gap-3 ml-12 py-2">
                    <div className="w-px h-5 bg-slate-200" />

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Car size={14} />

                      <span>
                        {
                          activities[
                            index + 1
                          ]
                            .distance_from_previous_km
                        }{" "}
                        km
                      </span>

                      <span>•</span>

                      <span>
                        {
                          activities[
                            index + 1
                          ]
                            .travel_time_minutes
                        }{" "}
                        min travel
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* DAY STATS */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-xs text-blue-500">
            Activity Cost
          </p>

          <p className="text-lg font-bold text-blue-700 mt-1">
            ₹
            {Number(
              selectedDayData?.total_cost || 0
            ).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-500">
            Travel Distance
          </p>

          <p className="text-lg font-bold text-slate-800 mt-1">
            {selectedDayData?.total_travel_distance_km ||
              0}{" "}
            km
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-500">
            Travel Time
          </p>

          <p className="text-lg font-bold text-slate-800 mt-1">
            {selectedDayData?.total_travel_time_minutes ||
              0}{" "}
            min
          </p>
        </div>
      </div>

      {/* OPTIMIZATION MESSAGE */}
      {activities.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-2">
          <Sparkles
            size={17}
            className="text-blue-600"
          />

          <span className="text-sm font-medium text-blue-700">
            TravelPilot optimized this day using location,
            opening hours, budget, and travel time.
          </span>
        </div>
      )}
    </div>
  );
}

function formatDate(date) {
  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default TodayItinerary;