import {
  Clock,
  MapPin,
  IndianRupee,
  Route,
  CalendarDays,
} from "lucide-react";

function TodayItinerary({
  trip,
  selectedDay,
  onDayChange,
}) {
  // Support both data formats
  const days = trip?.itinerary || trip?.days || [];

  const currentDay = days.find(
    (day) =>
      day.day_number === selectedDay ||
      day.day === selectedDay
  );

  const activities = currentDay?.activities || [];

  const totalCost = activities.reduce(
    (sum, activity) =>
      sum + Number(activity.cost || 0),
    0
  );

  const totalDistance =
    currentDay?.total_travel_distance_km ||
    activities.reduce(
      (sum, activity) =>
        sum +
        Number(activity.travel_distance_km || 0),
      0
    );

  const totalTravelTime =
    currentDay?.total_travel_time_minutes ||
    activities.reduce(
      (sum, activity) =>
        sum +
        Number(activity.travel_time_minutes || 0),
      0
    );

  const numberOfDays = days.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm text-blue-600 font-medium">
            Day {selectedDay}
          </p>

          <h2 className="text-xl font-bold text-slate-900">
            Today's Itinerary
          </h2>
        </div>

        <button
          onClick={() => {
            // Show all itinerary days starting from day 1
            if (onDayChange) {
              onDayChange(1);
            }
          }}
          className="text-blue-600 text-sm font-medium hover:text-blue-700"
        >
          View full itinerary →
        </button>
      </div>

      {/* Day selector */}
      {numberOfDays > 0 && (
        <div className="flex gap-2 mb-5 overflow-x-auto">
          {days.map((day, index) => {
            const dayNumber =
              day.day_number || day.day || index + 1;

            return (
              <button
                key={dayNumber}
                onClick={() =>
                  onDayChange &&
                  onDayChange(dayNumber)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  selectedDay === dayNumber
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Day {dayNumber}
              </button>
            );
          })}
        </div>
      )}

      {/* Activities */}
      {activities.length === 0 ? (
        <div className="bg-slate-50 rounded-xl p-8 text-center">
          <CalendarDays
            size={36}
            className="mx-auto text-slate-400 mb-3"
          />

          <p className="text-slate-600 font-medium">
            No activities have been scheduled for this day.
          </p>

          <p className="text-sm text-slate-400 mt-2">
            TravelPilot can replan when additional
            activities become available.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={`${activity.name}-${index}`}
              className="border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition"
            >
              <div className="flex gap-4">

                {/* Number */}
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  {index + 1}
                </div>

                {/* Activity */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {activity.name}
                      </h3>

                      {activity.category && (
                        <p className="text-xs text-slate-500 mt-1">
                          {activity.category}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-400">
                        Cost
                      </p>

                      <p className="font-semibold text-slate-800">
                        ₹{Number(activity.cost || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Time / location */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-slate-500">

                    {(activity.start_time ||
                      activity.start) && (
                      <div className="flex items-center gap-1">
                        <Clock size={15} />

                        {activity.start_time ||
                          activity.start}

                        {(activity.end_time ||
                          activity.end) && (
                          <>
                            {" - "}
                            {activity.end_time ||
                              activity.end}
                          </>
                        )}
                      </div>
                    )}

                    {activity.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={15} />
                        {activity.location}
                      </div>
                    )}
                  </div>

                  {/* Travel information */}
                  {index > 0 &&
                    (activity.travel_distance_km ||
                      activity.travel_time_minutes) && (
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Route size={14} />

                          {activity.travel_distance_km ||
                            0}{" "}
                          km
                        </span>

                        <span>
                          {activity.travel_time_minutes ||
                            0}{" "}
                          min travel
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mt-5">

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-500">
            Activity Cost
          </p>

          <p className="text-lg font-bold text-blue-700 mt-1">
            ₹{totalCost}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">
            Travel Distance
          </p>

          <p className="text-lg font-bold text-slate-800 mt-1">
            {Number(totalDistance).toFixed(1)} km
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">
            Travel Time
          </p>

          <p className="text-lg font-bold text-slate-800 mt-1">
            {totalTravelTime} min
          </p>
        </div>

      </div>
    </div>
  );
}

export default TodayItinerary;