import { useState } from "react";
import {
  MapPin,
  CalendarDays,
  Wallet,
  Sparkles,
  Check,
  ArrowLeft,
} from "lucide-react";

function NewTrip({ onBack, onCreateTrip }) {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("Balanced");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const interests = [
    "🏖 Beaches",
    "🍴 Food",
    "🏛 History",
    "🌿 Nature",
    "🛍 Shopping",
    "🎉 Nightlife",
  ];

  const toggleInterest = (interest) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const handleCreateTrip = async () => {
    if (!destination || !startDate || !endDate || !budget) {
      alert("Please fill in destination, dates, and budget.");
      return;
    }

    setLoading(true);

    try {
      const trip = {
        destination,
        startDate,
        endDate,
        budget,
        travelStyle,
        interests: selectedInterests,
      };

      await onCreateTrip(trip);

    } catch (error) {
      console.error(error);
      alert("Could not create the trip. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
              <Sparkles size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Create Your Trip
              </h1>

              <p className="text-slate-500 mt-1">
                Tell TravelPilot what kind of trip you want.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

          {/* Destination */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Destination
            </label>

            <div className="relative">
              <MapPin
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-5 mb-7">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Start Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                End Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

          </div>

          {/* Budget */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Total Budget
            </label>

            <div className="relative">
              <Wallet
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <span className="absolute left-11 top-1/2 -translate-y-1/2 text-slate-500">
                ₹
              </span>

              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="15000"
                className="w-full border border-slate-200 rounded-xl py-3 pl-16 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Interests */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              What are you interested in?
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

              {interests.map((interest) => {
                const selected = selectedInterests.includes(interest);

                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`relative p-4 rounded-xl border text-left transition ${
                      selected
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                    }`}
                  >
                    {interest}

                    {selected && (
                      <span className="absolute top-2 right-2">
                        <Check size={16} />
                      </span>
                    )}
                  </button>
                );
              })}

            </div>
          </div>

          {/* Travel Style */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Travel Style
            </label>

            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option>Relaxed</option>
              <option>Balanced</option>
              <option>Adventure Packed</option>
            </select>
          </div>

          {/* Create */}
          <button
            type="button"
            onClick={handleCreateTrip}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Sparkles size={20} />

            {loading ? "TravelPilot is planning..." : "Create My Trip"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default NewTrip;