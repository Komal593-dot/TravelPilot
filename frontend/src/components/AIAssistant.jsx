import { useMemo, useState } from "react";
import { Bot, Send } from "lucide-react";

function AIAssistant({ trip, selectedDay = 1 }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Support both demo formats
  const days = trip?.itinerary || trip?.days || [];

  const getDayNumber = (day, index) =>
    day?.day_number || day?.day || index + 1;

  const currentDay =
    days.find(
      (day, index) =>
        getDayNumber(day, index) === selectedDay
    ) || days[0];

  const currentActivities =
    currentDay?.activities || [];

  const tomorrow =
    days.find(
      (day, index) =>
        getDayNumber(day, index) ===
        Number(selectedDay) + 1
    ) || null;

  const tomorrowActivities =
    tomorrow?.activities || [];

  const allActivities = useMemo(
    () =>
      days.flatMap(
        (day) => day?.activities || []
      ),
    [days]
  );

  function findMorningActivity(activities) {
    return activities.find((activity) => {
      const start =
        activity.start_time ||
        activity.start ||
        "";

      const hour = Number(
        String(start).split(":")[0]
      );

      return hour >= 6 && hour < 12;
    });
  }

  function respond(text) {
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: message,
      },
      {
        type: "assistant",
        text,
      },
    ]);

    setMessage("");
  }

  function handleQuickQuestion(question) {
    const lower = question.toLowerCase();

    if (
      lower.includes("tomorrow") &&
      lower.includes("morning")
    ) {
      if (!tomorrow) {
        respond(
          "Your demo trip currently has no day after the selected day."
        );
        return;
      }

      const morningActivity =
        findMorningActivity(
          tomorrowActivities
        );

      if (morningActivity) {
        const time =
          morningActivity.start_time ||
          morningActivity.start ||
          "";

        respond(
          `Tomorrow morning you have ${morningActivity.name}${
            time ? ` at ${time}` : ""
          }.`
        );
      } else {
        respond(
          "You don't currently have a morning activity scheduled for tomorrow. I can suggest one based on your interests."
        );
      }

      return;
    }

    if (
      lower.includes("near") &&
      lower.includes("hotel")
    ) {
      if (!allActivities.length) {
        respond(
          "Create a trip first and I'll identify nearby activities."
        );
        return;
      }

      const nearby = allActivities
        .slice(0, 3)
        .map((activity) => activity.name)
        .join(", ");

      respond(
        `For the demo trip, your scheduled activities include ${nearby}. The demo dataset doesn't contain a hotel location, so I can't calculate exact distance from your hotel yet.`
      );

      return;
    }

    if (
      lower.includes("fit") ||
      lower.includes("another activity") ||
      lower.includes("add activity")
    ) {
      if (!currentActivities.length) {
        respond(
          "There are no activities scheduled for the selected day yet."
        );
        return;
      }

      const lastActivity =
        currentActivities[
          currentActivities.length - 1
        ];

      const endTime =
        lastActivity.end_time ||
        lastActivity.end ||
        "the last scheduled time";

      respond(
        `Your selected day currently has ${currentActivities.length} activities. The last scheduled activity ends at ${endTime}. I can check whether another activity fits after that.`
      );

      return;
    }

    if (
      lower.includes("budget") ||
      lower.includes("cost") ||
      lower.includes("money")
    ) {
      const totalCost = allActivities.reduce(
        (sum, activity) =>
          sum + Number(activity.cost || 0),
        0
      );

      respond(
        `Your trip budget is ₹${Number(
          trip?.budget || 0
        ).toLocaleString("en-IN")}. Scheduled activities currently total ₹${totalCost.toLocaleString(
          "en-IN"
        )}.`
      );

      return;
    }

    if (
      lower.includes("itinerary") ||
      lower.includes("plan") ||
      lower.includes("today")
    ) {
      if (!currentActivities.length) {
        respond(
          "There are no activities scheduled for the selected day."
        );
        return;
      }

      const names = currentActivities
        .map((activity) => activity.name)
        .join(", ");

      respond(
        `Your Day ${selectedDay} itinerary includes: ${names}.`
      );

      return;
    }

    respond(
      "I can help with your itinerary, tomorrow morning, nearby activities, fitting another activity, and your trip budget."
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!message.trim()) return;

    handleQuickQuestion(message.trim());
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
          <Bot size={21} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            AI Assistant
          </h2>

          <p className="text-sm text-slate-500">
            Ask TravelPilot about your trip
          </p>
        </div>
      </div>

      {/* Quick questions */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() =>
            handleQuickQuestion(
              "What should I do tomorrow morning?"
            )
          }
          className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm text-slate-700"
        >
          What should I do tomorrow morning?
        </button>

        <button
          onClick={() =>
            handleQuickQuestion(
              "What's near my hotel?"
            )
          }
          className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm text-slate-700"
        >
          What's near my hotel?
        </button>

        <button
          onClick={() =>
            handleQuickQuestion(
              "Can I fit another activity?"
            )
          }
          className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm text-slate-700"
        >
          Can I fit another activity?
        </button>
      </div>

      {/* Conversation */}
      {messages.length > 0 && (
        <div className="space-y-3 mb-5 max-h-80 overflow-y-auto">
          {messages.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                item.type === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                  item.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
      >
        <input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Ask about your trip..."
          className="flex-1 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default AIAssistant;