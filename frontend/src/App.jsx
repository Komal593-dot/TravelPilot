import { useState } from "react";

import {
  Map,
  Wallet,
  Car,
  Compass,
  Bot,
  Bell,
  Plus,
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  IndianRupee,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Navigation,
  Timer,
  ShieldCheck,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import TodayItinerary from "./components/TodayItinerary";
import AIAssistant from "./components/AIAssistant";
import NewTrip from "./components/NewTrip";
import MapView from "./components/MapView";

import {
  generateTripPlan,
  replanTrip,
} from "./services/api";

function App() {
  const [page, setPage] = useState("dashboard");

  const [trip, setTrip] = useState({
    destination: "Mumbai",
    startDate: "2026-09-20",
    endDate: "2026-09-25",
    budget: "7030",
    travelStyle: "Balanced",
    interests: [
      "🏛 History",
      "🏖 Beaches",
    ],
    itinerary: null,
  });

  const [disruption, setDisruption] = useState(null);
  const [replanning, setReplanning] = useState(false);

  // Currently selected day on the dashboard
  const [selectedDay, setSelectedDay] = useState(1);

  // Active autonomous-agent stage
  const [agentStage, setAgentStage] = useState(null);

  // Expanded transport logic card
  const [transportFeature, setTransportFeature] = useState(null);

  const handleCreateTrip = async (newTrip) => {
    try {
      const plan = await generateTripPlan(newTrip);
      const itinerary = plan.itinerary;

      const allActivities =
        itinerary?.days?.flatMap(
          (day) => day.activities || []
        ) || [];

      setTrip({
        ...newTrip,
        itinerary: {
          ...itinerary,
          activities: allActivities,
        },
      });

      setSelectedDay(1);
      setDisruption(null);
      setAgentStage(null);
      setPage("dashboard");
    } catch (error) {
      console.error("Trip creation failed:", error);

      alert(
        error.message ||
          "Could not create the trip. Please make sure the backend is running."
      );
    }
  };

  const handleSimulateDisruption = async () => {
    if (!trip?.itinerary?.activities?.length) {
      alert("Create a trip first.");
      return;
    }

    const activities = trip.itinerary.activities;

    const activityToCancel =
      activities.find(
        (activity) => activity.cost > 0
      ) ||
      activities[1] ||
      activities[0];

    if (!activityToCancel) {
      alert(
        "No activity is available to simulate a disruption."
      );
      return;
    }

    setDisruption(null);
    setReplanning(true);

    // PLAN
    setAgentStage("PLAN");

    await wait(700);

    // MONITOR
    setAgentStage("MONITOR");

    await wait(700);

    // DETECT
    setAgentStage("DETECT");

    await wait(900);

    // REPLAN
    setAgentStage("REPLAN");

    try {
      const result = await replanTrip(
        trip,
        [activityToCancel.place_id]
      );

      const itinerary = result.itinerary;

      const allActivities =
        itinerary?.days?.flatMap(
          (day) => day.activities || []
        ) || [];

      setTrip((currentTrip) => ({
        ...currentTrip,
        itinerary: {
          ...itinerary,
          activities: allActivities,
        },
      }));

      await wait(800);

      // UPDATE
      setAgentStage("UPDATE");

      await wait(900);

      setDisruption({
        placeId: activityToCancel.place_id,
        placeName: activityToCancel.name,
        message:
          "TravelPilot detected a disruption and replanned your itinerary.",
      });
    } catch (error) {
      console.error("Replanning failed:", error);

      setAgentStage(null);

      alert(
        error.message ||
          "Could not replan the trip. Please make sure the backend is running."
      );
    } finally {
      setReplanning(false);
    }
  };

  const handleAgentStageClick = async (stage) => {
    if (replanning) return;

    setAgentStage(stage);

    await wait(500);
  };

  const renderDashboard = () => {
    const budget = Number(trip?.budget || 0);

    const activityCost = Number(
      trip?.itinerary?.total_cost || 0
    );

    const remainingBudget = Math.max(
      0,
      budget - activityCost
    );

    const distance =
      trip?.itinerary?.total_travel_distance_km || 0;

    const travelTime =
      trip?.itinerary?.total_travel_time_minutes || 0;

    const activityCount =
      trip?.itinerary?.activities?.length || 0;

    const budgetPercentage =
      budget > 0
        ? Math.min(
            100,
            Math.round(
              (activityCost / budget) * 100
            )
          )
        : 0;

    const days = trip?.itinerary?.days || [];

    return (
      <div className="p-8">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />

              <span className="text-sm font-medium text-green-600">
                TravelPilot is monitoring your trip
              </span>
            </div>

            <h1 className="text-4xl font-bold text-slate-900">
              Good morning! 👋
            </h1>

            <p className="text-slate-500 mt-2">
              Your intelligent travel command center.
            </p>
          </div>

          <button
            onClick={() => setPage("new-trip")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition shadow-sm"
          >
            <Plus size={18} />
            New Trip
          </button>
        </div>

        {/* CURRENT TRIP HERO */}
        <div className="bg-slate-950 rounded-3xl p-7 text-white shadow-lg">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-blue-300 text-sm font-semibold uppercase tracking-wide">
                Current Trip
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {trip?.destination || "No destination"} ✈️
              </h2>

              <p className="text-slate-400 mt-2">
                {formatLongDate(trip?.startDate)} —{" "}
                {formatLongDate(trip?.endDate)}
              </p>

              <div className="flex flex-wrap gap-2 mt-5">
                {trip?.interests?.map(
                  (interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1.5 rounded-full bg-white/10 text-sm text-slate-200"
                    >
                      {interest}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="hidden md:flex w-16 h-16 rounded-2xl bg-blue-600 items-center justify-center">
              <Sparkles size={30} />
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <InfoCard
            icon={<Wallet size={20} />}
            title="Remaining Budget"
            value={`₹${remainingBudget.toLocaleString(
              "en-IN"
            )}`}
          />

          <InfoCard
            icon={<Compass size={20} />}
            title="Activities"
            value={activityCount}
          />

          <InfoCard
            icon={<MapPin size={20} />}
            title="Travel Distance"
            value={`${distance} km`}
          />

          <InfoCard
            icon={<Clock size={20} />}
            title="Travel Time"
            value={`${travelTime} min`}
          />
        </div>

        {/* DISRUPTION ALERT */}
        {disruption && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle
                    size={21}
                    className="text-amber-600"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-amber-900">
                    Itinerary automatically replanned
                  </h3>

                  <p className="text-sm text-amber-800 mt-1">
                    <strong>
                      {disruption.placeName}
                    </strong>{" "}
                    became unavailable.
                  </p>

                  <p className="text-sm text-amber-700 mt-2">
                    TravelPilot detected the disruption,
                    recalculated the schedule, and updated
                    your itinerary automatically.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDisruption(null)}
                className="text-sm text-amber-700 hover:text-amber-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* DAY SELECTOR */}
        {days.length > 0 && (
          <div className="mt-6">
            <DaySelector
              days={days}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          </div>
        )}

        {/* MAP */}
        <div className="mt-4">
          <MapView
            trip={trip}
            selectedDay={selectedDay}
          />
        </div>

        {/* ITINERARY + SIDEBAR */}
        <div className="grid xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-2">
            <TodayItinerary
              trip={trip}
              selectedDay={selectedDay}
            />

            {/* AUTONOMOUS REPLANNING */}
            <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      🚨
                    </span>

                    <h2 className="text-lg font-bold text-slate-900">
                      Test Autonomous Replanning
                    </h2>
                  </div>

                  <p className="text-sm text-slate-500 mt-2 max-w-xl">
                    Simulate an unavailable activity and watch
                    TravelPilot detect the disruption and
                    automatically rebuild your itinerary.
                  </p>
                </div>

                <button
                  onClick={handleSimulateDisruption}
                  disabled={replanning}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold px-5 py-3 rounded-xl transition flex items-center gap-2 whitespace-nowrap"
                >
                  {replanning ? (
                    <>
                      <span className="animate-spin">
                        ⟳
                      </span>
                      Replanning...
                    </>
                  ) : (
                    <>
                      🚨
                      Simulate Disruption
                    </>
                  )}
                </button>
              </div>

              {/* INTERACTIVE AGENT WORKFLOW */}
              <div className="grid md:grid-cols-5 gap-2 mt-6">
                <AgentFlowStep
                  title="PLAN"
                  text="Build itinerary"
                  active={agentStage === "PLAN"}
                  completed={isStageCompleted(
                    agentStage,
                    "PLAN"
                  )}
                  onClick={() =>
                    handleAgentStageClick("PLAN")
                  }
                  icon={<Map size={17} />}
                />

                <AgentFlowStep
                  title="MONITOR"
                  text="Track trip"
                  active={agentStage === "MONITOR"}
                  completed={isStageCompleted(
                    agentStage,
                    "MONITOR"
                  )}
                  onClick={() =>
                    handleAgentStageClick("MONITOR")
                  }
                  icon={<Navigation size={17} />}
                />

                <AgentFlowStep
                  title="DETECT"
                  text="Find disruption"
                  active={agentStage === "DETECT"}
                  completed={isStageCompleted(
                    agentStage,
                    "DETECT"
                  )}
                  onClick={() =>
                    handleAgentStageClick("DETECT")
                  }
                  icon={<AlertTriangle size={17} />}
                />

                <AgentFlowStep
                  title="REPLAN"
                  text="Rebuild schedule"
                  active={agentStage === "REPLAN"}
                  completed={isStageCompleted(
                    agentStage,
                    "REPLAN"
                  )}
                  onClick={() =>
                    handleAgentStageClick("REPLAN")
                  }
                  icon={<Sparkles size={17} />}
                />

                <AgentFlowStep
                  title="UPDATE"
                  text="Refresh trip"
                  active={agentStage === "UPDATE"}
                  completed={isStageCompleted(
                    agentStage,
                    "UPDATE"
                  )}
                  onClick={() =>
                    handleAgentStageClick("UPDATE")
                  }
                  icon={<CheckCircle2 size={17} />}
                />
              </div>

              {agentStage && (
                <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                      {getStageIcon(agentStage)}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                        Autonomous Agent
                      </p>

                      <p className="font-semibold text-blue-900 mt-0.5">
                        {getStageDescription(agentStage)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* BUDGET */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Trip Budget
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    ₹{budget.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Wallet size={20} />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">
                    Planned activity cost
                  </span>

                  <span className="font-semibold text-slate-800">
                    ₹{activityCost.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{
                      width: `${budgetPercentage}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  ₹{remainingBudget.toLocaleString(
                    "en-IN"
                  )}{" "}
                  remaining
                </p>
              </div>
            </div>

            {/* AGENT STATUS */}
            <div className="bg-slate-950 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Bot size={21} />
                </div>

                <div>
                  <h3 className="font-bold">
                    TravelPilot Agent
                  </h3>

                  <p className="text-xs text-green-400 mt-1">
                    ● Active & monitoring
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <AgentStatus
                  label="Trip planning"
                  status="Complete"
                />

                <AgentStatus
                  label="Schedule monitoring"
                  status="Active"
                />

                <AgentStatus
                  label="Conflict detection"
                  status="Ready"
                />

                <AgentStatus
                  label="Automatic replanning"
                  status="Ready"
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI ASSISTANT */}
        <div className="mt-6">
          <AIAssistant trip={trip} />
        </div>
      </div>
    );
  };

  const renderItinerary = () => {
    const days = trip?.itinerary?.days || [];

    return (
      <div className="p-8">
        <PageHeader
          icon={<Map size={24} />}
          title="Your Itinerary"
          subtitle="Your optimized multi-day travel schedule"
          onBack={() => setPage("dashboard")}
        />

        {days.length === 0 ? (
          <EmptyState
            title="No itinerary yet"
            text="Create a trip and TravelPilot will generate your itinerary."
          />
        ) : (
          <div className="space-y-6">
            {days.map((day) => (
              <div
                key={day.day_number}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-semibold">
                        Day {day.day_number}
                      </p>

                      <h2 className="text-xl font-bold text-slate-900 mt-1">
                        {formatLongDate(day.date)}
                      </h2>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-500">
                        Day Cost
                      </p>

                      <p className="text-xl font-bold text-slate-900">
                        ₹
                        {Number(
                          day.total_cost || 0
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {day.activities?.length === 0 ? (
                    <div className="p-6 rounded-xl bg-slate-50 text-center">
                      <CalendarDays
                        size={24}
                        className="mx-auto text-slate-400"
                      />

                      <p className="text-slate-500 mt-2">
                        No activities scheduled for this day.
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        TravelPilot can add more activities
                        when additional places are available.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {day.activities.map(
                        (activity, index) => (
                          <div
                            key={`${activity.place_id}-${index}`}
                          >
                            <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                              <div className="w-24 shrink-0">
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

                              <div className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />

                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-900">
                                  {activity.name}
                                </h3>

                                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                  <MapPin size={14} />
                                  {activity.location}
                                </p>
                              </div>

                              <span className="text-xs font-medium bg-white px-3 py-1 rounded-full text-slate-600 border">
                                {activity.category}
                              </span>

                              <div className="text-sm font-semibold text-slate-700 w-16 text-right">
                                {activity.cost === 0
                                  ? "Free"
                                  : `₹${activity.cost}`}
                              </div>
                            </div>

                            {index <
                              day.activities.length -
                                1 && (
                              <div className="flex items-center gap-3 ml-12 py-2">
                                <div className="w-px h-5 bg-slate-200" />

                                <div className="text-xs text-slate-400">
                                  🚗{" "}
                                  {
                                    day.activities[
                                      index + 1
                                    ]
                                      .distance_from_previous_km
                                  }{" "}
                                  km
                                  {" • "}
                                  {
                                    day.activities[
                                      index + 1
                                    ]
                                      .travel_time_minutes
                                  }{" "}
                                  min travel
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="px-6 pb-6">
                  <div className="grid md:grid-cols-3 gap-3">
                    <StatCard
                      title="Activities"
                      value={
                        day.activities?.length || 0
                      }
                    />

                    <StatCard
                      title="Distance"
                      value={`${day.total_travel_distance_km || 0} km`}
                    />

                    <StatCard
                      title="Travel Time"
                      value={`${day.total_travel_time_minutes || 0} min`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {trip?.itinerary && (
          <div className="mt-6">
            <div className="bg-slate-950 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={20} />

                <h2 className="font-bold text-lg">
                  Trip Summary
                </h2>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <SummaryStat
                  title="Trip Days"
                  value={
                    trip.itinerary.number_of_days ||
                    days.length
                  }
                />

                <SummaryStat
                  title="Activity Cost"
                  value={`₹${Number(
                    trip.itinerary.total_cost || 0
                  ).toLocaleString("en-IN")}`}
                />

                <SummaryStat
                  title="Distance"
                  value={`${trip.itinerary.total_travel_distance_km || 0} km`}
                />

                <SummaryStat
                  title="Travel Time"
                  value={`${trip.itinerary.total_travel_time_minutes || 0} min`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBudget = () => {
    const budget = Number(trip?.budget || 0);

    const spent = Number(
      trip?.itinerary?.total_cost || 0
    );

    const remaining = Math.max(
      0,
      budget - spent
    );

    const percentage =
      budget > 0
        ? Math.min(
            100,
            Math.round(
              (spent / budget) * 100
            )
          )
        : 0;

    return (
      <div className="p-8">
        <PageHeader
          icon={<Wallet size={24} />}
          title="Trip Budget"
          subtitle="Track your planned activity spending"
          onBack={() => setPage("dashboard")}
        />

        <div className="grid md:grid-cols-3 gap-5">
          <InfoCard
            icon={<Wallet size={20} />}
            title="Total Budget"
            value={`₹${budget.toLocaleString("en-IN")}`}
          />

          <InfoCard
            icon={<IndianRupee size={20} />}
            title="Planned Activity Cost"
            value={`₹${spent.toLocaleString("en-IN")}`}
          />

          <InfoCard
            icon={<CheckCircle2 size={20} />}
            title="Remaining"
            value={`₹${remaining.toLocaleString("en-IN")}`}
          />
        </div>

        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex justify-between mb-3">
            <span className="font-semibold text-slate-700">
              Budget Used
            </span>

            <span className="font-bold text-slate-900">
              {percentage}%
            </span>
          </div>

          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <p className="text-sm text-slate-500 mt-4">
            TravelPilot is currently tracking activity
            costs against your trip budget.
          </p>
        </div>
      </div>
    );
  };

  const renderTransport = () => {
    const distance =
      trip?.itinerary?.total_travel_distance_km || 0;

    const travelTime =
      trip?.itinerary?.total_travel_time_minutes || 0;

    return (
      <div className="p-8">
        <PageHeader
          icon={<Car size={24} />}
          title="Transport"
          subtitle="Travel movement calculated from your itinerary"
          onBack={() => setPage("dashboard")}
        />

        <div className="grid md:grid-cols-3 gap-5">
          <InfoCard
            icon={<MapPin size={20} />}
            title="Total Distance"
            value={`${distance} km`}
          />

          <InfoCard
            icon={<Clock size={20} />}
            title="Travel Time"
            value={`${travelTime} min`}
          />

          <InfoCard
            icon={<Car size={20} />}
            title="Planning Mode"
            value="Optimized"
          />
        </div>

        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900">
            TravelPilot Transport Logic
          </h2>

          <p className="text-slate-500 mt-2">
            TravelPilot groups nearby activities and estimates
            travel time using the distance between consecutive
            locations.
          </p>

          {/* INTERACTIVE TRANSPORT FEATURES */}
          <div className="mt-5 grid md:grid-cols-3 gap-3">
            <TransportFeature
              id="location"
              title="Location Aware"
              text="Activities are ordered using geographic distance."
              detail={`TravelPilot uses the distance between consecutive activities to reduce unnecessary movement. Your current itinerary contains ${distance} km of planned travel.`}
              icon={<MapPin size={18} />}
              active={transportFeature === "location"}
              onClick={() =>
                setTransportFeature(
                  transportFeature === "location"
                    ? null
                    : "location"
                )
              }
            />

            <TransportFeature
              id="time"
              title="Travel Time"
              text="Estimated travel time is included between stops."
              detail={`The current itinerary estimates approximately ${travelTime} minutes of travel time across your planned activities.`}
              icon={<Timer size={18} />}
              active={transportFeature === "time"}
              onClick={() =>
                setTransportFeature(
                  transportFeature === "time"
                    ? null
                    : "time"
                )
              }
            />

            <TransportFeature
              id="conflict"
              title="Conflict Aware"
              text="Activities are only added when their schedule fits."
              detail="TravelPilot checks activity duration, opening hours, and available time before adding a stop to the schedule."
              icon={<ShieldCheck size={18} />}
              active={transportFeature === "conflict"}
              onClick={() =>
                setTransportFeature(
                  transportFeature === "conflict"
                    ? null
                    : "conflict"
                )
              }
            />
          </div>

          {transportFeature && (
            <div className="mt-4 p-5 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  {transportFeature === "location" && (
                    <MapPin size={17} />
                  )}

                  {transportFeature === "time" && (
                    <Timer size={17} />
                  )}

                  {transportFeature === "conflict" && (
                    <ShieldCheck size={17} />
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    TravelPilot Logic
                  </p>

                  <p className="text-sm font-semibold text-blue-900 mt-1">
                    {getTransportDetail(
                      transportFeature,
                      distance,
                      travelTime
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActivities = () => {
    const activities =
      trip?.itinerary?.activities || [];

    return (
      <div className="p-8">
        <PageHeader
          icon={<Compass size={24} />}
          title="Activities"
          subtitle="Activities selected by TravelPilot"
          onBack={() => setPage("dashboard")}
        />

        {activities.length === 0 ? (
          <EmptyState
            title="No activities yet"
            text="Create a trip to let TravelPilot select activities."
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {activities.map(
              (activity, index) => (
                <div
                  key={`${activity.place_id}-${index}`}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-blue-600 font-semibold uppercase">
                        {activity.category}
                      </p>

                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {activity.name}
                      </h3>
                    </div>

                    <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium">
                      {activity.cost === 0
                        ? "Free"
                        : `₹${activity.cost}`}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                      <MapPin size={15} />
                      {activity.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <Clock size={15} />
                      {activity.start_time} –{" "}
                      {activity.end_time}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  const renderAssistant = () => (
    <div className="p-8">
      <PageHeader
        icon={<Bot size={24} />}
        title="AI Assistant"
        subtitle="Ask TravelPilot about your trip"
        onBack={() => setPage("dashboard")}
      />

      <div className="max-w-4xl">
        <AIAssistant trip={trip} />
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="p-8">
      <PageHeader
        icon={<Bell size={24} />}
        title="Alerts"
        subtitle="Trip disruptions and TravelPilot notifications"
        onBack={() => setPage("dashboard")}
      />

      {disruption ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle
                size={22}
                className="text-amber-600"
              />
            </div>

            <div>
              <h2 className="font-bold text-amber-900">
                Activity Unavailable
              </h2>

              <p className="text-sm text-amber-800 mt-1">
                {disruption.placeName} became unavailable.
              </p>

              <p className="text-sm text-amber-700 mt-2">
                TravelPilot automatically generated a
                revised itinerary.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <CheckCircle2
            size={36}
            className="mx-auto text-green-500"
          />

          <h2 className="font-bold text-slate-900 mt-3">
            No active alerts
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            TravelPilot is monitoring your current itinerary.
          </p>
        </div>
      )}
    </div>
  );

  if (page === "new-trip") {
    return (
      <div className="min-h-screen bg-slate-100 flex">
        <Sidebar
          currentPage={page}
          onNavigate={setPage}
        />

        <main className="flex-1 overflow-y-auto">
          <NewTrip
            onBack={() => setPage("dashboard")}
            onCreateTrip={handleCreateTrip}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
      />

      <main className="flex-1 overflow-y-auto">
        {page === "dashboard" &&
          renderDashboard()}

        {page === "itinerary" &&
          renderItinerary()}

        {page === "budget" &&
          renderBudget()}

        {page === "transport" &&
          renderTransport()}

        {page === "activities" &&
          renderActivities()}

        {page === "assistant" &&
          renderAssistant()}

        {page === "alerts" &&
          renderAlerts()}
      </main>
    </div>
  );
}

/* =====================================================
   INTERACTIVE AGENT FLOW
===================================================== */

function AgentFlowStep({
  title,
  text,
  active,
  completed,
  onClick,
  icon,
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`text-left rounded-xl p-4 border transition-all ${
        active
          ? "bg-blue-600 border-blue-600 text-white shadow-md scale-[1.02]"
          : completed
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            active
              ? "bg-white/20"
              : completed
              ? "bg-green-100"
              : "bg-white"
          }`}
        >
          {completed ? (
            <CheckCircle2 size={17} />
          ) : (
            icon
          )}
        </div>

        {active && (
          <span className="text-[10px] font-bold uppercase tracking-wide">
            Active
          </span>
        )}
      </div>

      <p className="font-bold mt-3">
        {title}
      </p>

      <p
        className={`text-xs mt-1 ${
          active
            ? "text-blue-100"
            : completed
            ? "text-green-700"
            : "text-slate-500"
        }`}
      >
        {text}
      </p>
    </button>
  );
}

/* =====================================================
   INTERACTIVE TRANSPORT FEATURE
===================================================== */

function TransportFeature({
  title,
  text,
  detail,
  icon,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl p-4 border transition-all ${
        active
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
          active
            ? "bg-blue-600 text-white"
            : "bg-white text-blue-600"
        }`}
      >
        {icon}
      </div>

      <h3 className="font-semibold text-slate-900 mt-3">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        {text}
      </p>

      <p className="text-xs text-blue-600 font-medium mt-3">
        {active ? "Hide details ↑" : "View logic →"}
      </p>

      {active && (
        <p className="text-sm text-blue-900 mt-3 pt-3 border-t border-blue-100">
          {detail}
        </p>
      )}
    </button>
  );
}

/* =====================================================
   DAY SELECTOR
===================================================== */

function DaySelector({
  days,
  selectedDay,
  onSelectDay,
}) {
  if (!days.length) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
            Trip Timeline
          </p>

          <h3 className="font-bold text-slate-900">
            Explore each day
          </h3>
        </div>

        <span className="text-xs text-slate-400">
          {days.length} days
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((day) => {
          const active =
            selectedDay === day.day_number;

          return (
            <button
              key={day.day_number}
              onClick={() =>
                onSelectDay(day.day_number)
              }
              className={`min-w-[110px] px-4 py-3 rounded-xl border transition text-left ${
                active
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <p
                className={`text-xs font-semibold ${
                  active
                    ? "text-blue-100"
                    : "text-blue-600"
                }`}
              >
                DAY {day.day_number}
              </p>

              <p className="font-bold mt-1">
                {formatShortDate(day.date)}
              </p>

              <p
                className={`text-xs mt-1 ${
                  active
                    ? "text-blue-100"
                    : "text-slate-400"
                }`}
              >
                {day.activities?.length || 0} activities
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =====================================================
   PAGE HEADER
===================================================== */

function PageHeader({
  icon,
  title,
  subtitle,
  onBack,
}) {
  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-5 transition"
      >
        <ArrowLeft size={18} />
        Dashboard
      </button>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
          {icon}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {title}
          </h1>

          <p className="text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({
  title,
  text,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
      <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center">
        <Map
          size={22}
          className="text-slate-400"
        />
      </div>

      <h2 className="font-bold text-slate-900 mt-4">
        {title}
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        {text}
      </p>
    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p className="text-lg font-bold text-slate-800 mt-1">
        {value}
      </p>
    </div>
  );
}

/* =====================================================
   SUMMARY STAT
===================================================== */

function SummaryStat({
  title,
  value,
}) {
  return (
    <div className="bg-white/10 rounded-xl p-4">
      <p className="text-xs text-slate-400">
        {title}
      </p>

      <p className="text-lg font-bold mt-1">
        {value}
      </p>
    </div>
  );
}

/* =====================================================
   INFO CARD
===================================================== */

function InfoCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>

        <p className="text-sm text-slate-500">
          {title}
        </p>
      </div>

      <p className="text-2xl font-bold text-slate-900 mt-4">
        {value}
      </p>
    </div>
  );
}

/* =====================================================
   AGENT STATUS
===================================================== */

function AgentStatus({
  label,
  status,
}) {
  return (
    <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
      <span className="text-sm text-slate-300">
        {label}
      </span>

      <span className="text-xs font-semibold text-green-400">
        {status}
      </span>
    </div>
  );
}

/* =====================================================
   MINI FEATURE
===================================================== */

function MiniFeature({
  title,
  text,
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <h3 className="font-semibold text-slate-900">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        {text}
      </p>
    </div>
  );
}

/* =====================================================
   HELPERS
===================================================== */

function wait(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

function getStageIcon(stage) {
  if (stage === "PLAN") {
    return <Map size={17} />;
  }

  if (stage === "MONITOR") {
    return <Navigation size={17} />;
  }

  if (stage === "DETECT") {
    return <AlertTriangle size={17} />;
  }

  if (stage === "REPLAN") {
    return <Sparkles size={17} />;
  }

  return <CheckCircle2 size={17} />;
}

function getStageDescription(stage) {
  if (stage === "PLAN") {
    return "TravelPilot is building an optimized itinerary.";
  }

  if (stage === "MONITOR") {
    return "TravelPilot is monitoring the active trip schedule.";
  }

  if (stage === "DETECT") {
    return "TravelPilot detected that an activity is unavailable.";
  }

  if (stage === "REPLAN") {
    return "TravelPilot is rebuilding the schedule around the disruption.";
  }

  return "TravelPilot updated the itinerary with the new plan.";
}

function isStageCompleted(
  currentStage,
  stage
) {
  const order = [
    "PLAN",
    "MONITOR",
    "DETECT",
    "REPLAN",
    "UPDATE",
  ];

  const currentIndex =
    order.indexOf(currentStage);

  const stageIndex =
    order.indexOf(stage);

  return (
    currentIndex > stageIndex &&
    currentIndex !== -1
  );
}

function getTransportDetail(
  feature,
  distance,
  travelTime
) {
  if (feature === "location") {
    return `TravelPilot orders nearby stops using geographic distance. The current itinerary contains ${distance} km of planned movement.`;
  }

  if (feature === "time") {
    return `TravelPilot estimates ${travelTime} minutes of travel between the planned stops and includes that time in the schedule.`;
  }

  return "TravelPilot checks opening hours, activity duration, and available time before adding activities, helping prevent schedule conflicts.";
}

/* =====================================================
   DATE HELPERS
===================================================== */

function formatLongDate(date) {
  if (!date) {
    return "Date not set";
  }

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(date) {
  if (!date) {
    return "";
  }

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default App;