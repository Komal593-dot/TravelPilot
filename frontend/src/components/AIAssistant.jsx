import { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
} from "lucide-react";

function AIAssistant({ trip }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const activities = trip?.itinerary?.activities || [];

  const generateAnswer = (text) => {
    const query = text.toLowerCase();

    if (
      query.includes("tomorrow") ||
      query.includes("morning")
    ) {
      const morningActivities = activities.filter((activity) => {
        const hour = Number(activity.start_time.split(":")[0]);
        return hour < 12;
      });

      if (morningActivities.length > 0) {
        return `For tomorrow morning, I recommend starting with ${morningActivities[0].name} at ${morningActivities[0].start_time}. Your current itinerary has ${morningActivities.length} morning activities planned.`;
      }

      return "I don't currently have a morning activity scheduled. I can help you add one based on your interests and available time.";
    }

    if (
      query.includes("near") ||
      query.includes("hotel")
    ) {
      if (activities.length === 0) {
        return "I don't have an itinerary yet. Create a trip first and I'll identify nearby activities.";
      }

      const nearby = [...activities]
        .sort(
          (a, b) =>
            a.distance_from_previous_km -
            b.distance_from_previous_km
        )
        .slice(0, 3);

      return `Based on your current itinerary, some of the closest stops are ${nearby
        .map((activity) => activity.name)
        .join(", ")}. I can use your hotel location for a more precise nearby search once hotel details are added.`;
    }

    if (
      query.includes("fit") ||
      query.includes("another activity") ||
      query.includes("add")
    ) {
      if (activities.length === 0) {
        return "Create a trip first and I'll check your schedule for available time.";
      }

      const lastActivity =
        activities[activities.length - 1];

      const lastEnd = lastActivity.end_time;

      const hour = Number(lastEnd.split(":")[0]);
      const minute = Number(lastEnd.split(":")[1]);

      const minutesUntilEvening =
        18 * 60 - (hour * 60 + minute);

      if (minutesUntilEvening >= 60) {
        return `Yes. Your last planned activity ends at ${lastEnd}, leaving approximately ${minutesUntilEvening} minutes before the daytime planning window closes. TravelPilot can look for another nearby activity that fits your interests and budget.`;
      }

      return `Your schedule is already fairly full. Your last planned activity ends at ${lastEnd}, so adding another full activity may create a scheduling conflict.`;
    }

    if (
      query.includes("budget") ||
      query.includes("cost") ||
      query.includes("money")
    ) {
      const totalCost =
        trip?.itinerary?.total_cost || 0;

      const budget = Number(trip?.budget || 0);

      const remaining = budget - totalCost;

      return `Your current planned activity cost is ₹${totalCost.toLocaleString(
        "en-IN"
      )}. You have approximately ₹${remaining.toLocaleString(
        "en-IN"
      )} remaining from your ₹${budget.toLocaleString(
        "en-IN"
      )} activity budget.`;
    }

    if (
      query.includes("itinerary") ||
      query.includes("plan") ||
      query.includes("today")
    ) {
      if (activities.length === 0) {
        return "Your itinerary is currently empty. Create a trip and TravelPilot will generate one automatically.";
      }

      return `Your current itinerary contains ${activities.length} activities, with ${trip.itinerary.total_travel_distance_km} km of travel and approximately ${trip.itinerary.total_travel_time_minutes} minutes of travel time.`;
    }

    return `I'm tracking your ${trip?.destination || "current"} trip. I can help with your itinerary, budget, nearby activities, scheduling, and replanning. Try asking "Can I fit another activity?"`;
  };

  const askQuestion = async (text = question) => {
    const cleanQuestion = text.trim();

    if (!cleanQuestion || loading) {
      return;
    }

    setLoading(true);

    setMessages((current) => [
      ...current,
      {
        type: "user",
        text: cleanQuestion,
      },
    ]);

    setQuestion("");

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    const answer = generateAnswer(cleanQuestion);

    setMessages((current) => [
      ...current,
      {
        type: "ai",
        text: answer,
      },
    ]);

    setLoading(false);
  };

  const suggestions = [
    "What should I do tomorrow morning?",
    "What's near my hotel?",
    "Can I fit another activity?",
  ];

  return (
    <div className="bg-slate-950 rounded-2xl p-6 text-white shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
          <Bot size={22} />
        </div>

        <div>
          <div className="flex items-center gap-2">

            <h2 className="text-lg font-bold">
              TravelPilot AI
            </h2>

            <span className="flex items-center gap-1 text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full">
              <Sparkles size={12} />
              AI
            </span>

          </div>

          <p className="text-sm text-slate-400">
            Your intelligent trip assistant
          </p>
        </div>

      </div>


      {/* Description */}
      <p className="mt-5 text-slate-300">
        Ask me anything about your trip. I can help you
        plan, modify, or replan your itinerary.
      </p>


      {/* Conversation */}
      {messages.length > 0 && (
        <div className="mt-5 space-y-3 max-h-80 overflow-y-auto">

          {messages.map((message, index) => (

            <div
              key={index}
              className={`flex gap-3 ${
                message.type === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              {message.type === "ai" && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-[80%] px-4 py-3 rounded-xl text-sm ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                {message.text}
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
              )}

            </div>

          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Bot size={16} />
              TravelPilot is thinking...
            </div>
          )}

        </div>
      )}


      {/* Input */}
      <div className="mt-5 flex gap-2">

        <input
          type="text"
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              askQuestion();
            }
          }}
          placeholder="Ask TravelPilot..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white placeholder:text-slate-500"
        />

        <button
          onClick={() => askQuestion()}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition px-4 rounded-xl"
        >
          <Send size={19} />
        </button>

      </div>


      {/* Suggested questions */}
      <div className="flex flex-wrap gap-2 mt-4">

        {suggestions.map((suggestion) => (

          <button
            key={suggestion}
            onClick={() => askQuestion(suggestion)}
            disabled={loading}
            className="text-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-50 px-3 py-2 rounded-lg transition"
          >
            {suggestion}
          </button>

        ))}

      </div>

    </div>
  );
}

export default AIAssistant;