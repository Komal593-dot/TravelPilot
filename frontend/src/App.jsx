import { useState } from "react";

import Sidebar from "./components/Sidebar";
import TripOverview from "./components/TripOverview";
import TodayItinerary from "./components/TodayItinerary";
import AIAssistant from "./components/AIAssistant";
import NewTrip from "./components/NewTrip";
import MapView from "./components/MapView";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [trip, setTrip] = useState({
    destination: "Mumbai",
    startDate: "2026-09-20",
    endDate: "2026-09-22",
    budget: 20000,
    interests: ["🍴 Food", "🏖 Beaches"],
    travelStyle: "Balanced",

    itinerary: [
      {
        day: 1,
        date: "2026-09-20",
        activities: [
          {
            id: 101,
            name: "Gateway of India",
            category: "History",
            area: "Colaba",
            description:
              "Historic waterfront landmark and one of Mumbai's most iconic attractions.",
            cost: 0,
            duration_minutes: 90,
            start_time: "09:00",
            end_time: "10:30",
            travel_distance_km: 0,
            travel_time_minutes: 0,
            lat: 18.921984,
            lon: 72.834654,
          },
          {
            id: 102,
            name: "Marine Drive",
            category: "Beach",
            area: "South Mumbai",
            description:
              "Scenic waterfront promenade with views across the Arabian Sea.",
            cost: 0,
            duration_minutes: 120,
            start_time: "11:00",
            end_time: "13:00",
            travel_distance_km: 5.2,
            travel_time_minutes: 18,
            lat: 18.9431,
            lon: 72.8235,
          },
          {
            id: 108,
            name: "Crawford Market",
            category: "Shopping",
            area: "Mumbai",
            description:
              "Historic market with local food, shopping and Mumbai street life.",
            cost: 0,
            duration_minutes: 90,
            start_time: "14:00",
            end_time: "15:30",
            travel_distance_km: 4.8,
            travel_time_minutes: 17,
            lat: 18.947,
            lon: 72.8345,
          },
        ],
        total_cost: 0,
        remaining_budget: 20000,
        total_travel_distance_km: 10,
        total_travel_time_minutes: 35,
      },

      {
        day: 2,
        date: "2026-09-21",
        activities: [
          {
            id: 106,
            name: "Juhu Beach",
            category: "Beach",
            area: "Juhu",
            description:
              "Popular Mumbai beach known for sunset views and local snacks.",
            cost: 0,
            duration_minutes: 120,
            start_time: "09:00",
            end_time: "11:00",
            travel_distance_km: 0,
            travel_time_minutes: 0,
            lat: 19.0988,
            lon: 72.8269,
          },
          {
            id: 107,
            name: "Bandra Fort",
            category: "History",
            area: "Bandra",
            description:
              "Historic fort overlooking the Arabian Sea and Bandra-Worli Sea Link.",
            cost: 0,
            duration_minutes: 90,
            start_time: "11:30",
            end_time: "13:00",
            travel_distance_km: 5.1,
            travel_time_minutes: 20,
            lat: 19.0427,
            lon: 72.8197,
          },
          {
            id: 104,
            name: "Sanjay Gandhi National Park",
            category: "Nature",
            area: "Borivali",
            description:
              "Large urban national park with greenery, trails and wildlife.",
            cost: 50,
            duration_minutes: 150,
            start_time: "14:30",
            end_time: "17:00",
            travel_distance_km: 18.4,
            travel_time_minutes: 45,
            lat: 19.2147,
            lon: 72.9106,
          },
        ],
        total_cost: 50,
        remaining_budget: 19950,
        total_travel_distance_km: 23.5,
        total_travel_time_minutes: 65,
      },

      {
        day: 3,
        date: "2026-09-22",
        activities: [
          {
            id: 103,
            name: "CSMT",
            category: "History",
            area: "Fort",
            description:
              "UNESCO-listed railway terminus known for its Gothic architecture.",
            cost: 0,
            duration_minutes: 90,
            start_time: "09:00",
            end_time: "10:30",
            travel_distance_km: 0,
            travel_time_minutes: 0,
            lat: 18.9402,
            lon: 72.8356,
          },
          {
            id: 109,
            name: "Colaba Causeway",
            category: "Shopping",
            area: "Colaba",
            description:
              "Popular shopping street with local stores, cafes and souvenirs.",
            cost: 0,
            duration_minutes: 120,
            start_time: "11:00",
            end_time: "13:00",
            travel_distance_km: 3.4,
            travel_time_minutes: 14,
            lat: 18.922,
            lon: 72.831,
          },
          {
            id: 110,
            name: "Siddhivinayak Temple",
            category: "Culture",
            area: "Prabhadevi",
            description:
              "Famous Mumbai temple dedicated to Lord Ganesha.",
            cost: 0,
            duration_minutes: 60,
            start_time: "14:30",
            end_time: "15:30",
            travel_distance_km: 8.1,
            travel_time_minutes: 25,
            lat: 19.0168,
            lon: 72.8306,
          },
        ],
        total_cost: 0,
        remaining_budget: 19950,
        total_travel_distance_km: 11.5,
        total_travel_time_minutes: 39,
      },
    ],

    total_cost: 50,
    total_travel_distance_km: 45,
    total_travel_time_minutes: 139,
    number_of_days: 3,
  });

  const [selectedDay, setSelectedDay] = useState(1);

  const handleCreateTrip = (newTrip) => {
    setTrip({
      ...trip,
      ...newTrip,
    });

    setCurrentPage("dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <main className="flex-1 min-w-0">
        <div className="p-8">

          {currentPage === "dashboard" && (
            <div className="space-y-6">

              <TripOverview trip={trip} />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <TodayItinerary
                  trip={trip}
                  selectedDay={selectedDay}
                  onDayChange={setSelectedDay}
                />

                <MapView
                  trip={trip}
                  selectedDay={selectedDay}
                />

              </div>

              <AIAssistant
                trip={trip}
              />

            </div>
          )}

          {currentPage === "new-trip" && (
            <NewTrip
              trip={trip}
              onCreateTrip={handleCreateTrip}
              onCancel={() => setCurrentPage("dashboard")}
            />
          )}

          {currentPage === "itinerary" && (
            <div className="space-y-6">
              <TripOverview trip={trip} />

              <TodayItinerary
                trip={trip}
                selectedDay={selectedDay}
                onDayChange={setSelectedDay}
              />
            </div>
          )}

          {currentPage === "budget" && (
            <BudgetPage trip={trip} />
          )}

          {currentPage === "transport" && (
            <TransportPage trip={trip} />
          )}

          {currentPage === "activities" && (
            <ActivitiesPage trip={trip} />
          )}

          {currentPage === "assistant" && (
            <AIAssistant trip={trip} />
          )}

          {currentPage === "alerts" && (
            <AlertsPage />
          )}

        </div>
      </main>
    </div>
  );
}


function BudgetPage({ trip }) {
  const total =
    trip.total_cost ||
    trip.itinerary.reduce(
      (sum, day) => sum + (day.total_cost || 0),
      0
    );

  const remaining =
    Number(trip.budget) - total;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Budget
        </h1>

        <p className="text-slate-500 mt-1">
          Track your estimated trip spending.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Total Budget
          </p>

          <p className="text-2xl font-bold mt-2">
            ₹{Number(trip.budget).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Planned Cost
          </p>

          <p className="text-2xl font-bold mt-2">
            ₹{total.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">
            Remaining
          </p>

          <p className="text-2xl font-bold mt-2 text-green-600">
            ₹{remaining.toLocaleString()}
          </p>
        </div>

      </div>

    </div>
  );
}


function TransportPage({ trip }) {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Transport
        </h1>

        <p className="text-slate-500 mt-1">
          Travel movement between planned activities.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <InfoCard
            label="Distance"
            value={`${trip.total_travel_distance_km || 45} km`}
          />

          <InfoCard
            label="Travel Time"
            value={`${trip.total_travel_time_minutes || 139} min`}
          />

          <InfoCard
            label="Mode"
            value="Local Travel"
          />

        </div>

      </div>

    </div>
  );
}


function ActivitiesPage({ trip }) {
  const activities = trip.itinerary.flatMap(
    (day) =>
      (day.activities || []).map((activity) => ({
        ...activity,
        day: day.day,
      }))
  );

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Activities
        </h1>

        <p className="text-slate-500 mt-1">
          All activities in your trip.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {activities.map((activity) => (
          <div
            key={`${activity.id}-${activity.day}`}
            className="bg-white rounded-2xl border border-slate-200 p-5"
          >

            <div className="flex justify-between">

              <div>
                <h3 className="font-bold text-lg">
                  {activity.name}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {activity.category} · {activity.area}
                </p>
              </div>

              <span className="text-sm font-semibold">
                ₹{activity.cost}
              </span>

            </div>

            <div className="mt-4 text-sm text-slate-500">
              Day {activity.day} ·{" "}
              {activity.start_time} -{" "}
              {activity.end_time}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}


function AlertsPage() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Alerts
        </h1>

        <p className="text-slate-500 mt-1">
          TravelPilot disruption monitoring.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">

        <div className="flex items-center gap-4">

          <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
            ✓
          </div>

          <div>
            <h3 className="font-bold">
              No active disruptions
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Your current demo itinerary is running normally.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}


function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="text-xl font-bold mt-1">
        {value}
      </p>
    </div>
  );
}


export default App;