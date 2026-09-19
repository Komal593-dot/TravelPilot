import {
  LayoutDashboard,
  Map,
  Wallet,
  Car,
  Compass,
  Bot,
  Bell,
  Plus,
} from "lucide-react";

function Sidebar({ currentPage, onNavigate }) {
  const navigation = [
    {
      id: "dashboard",
      icon: <LayoutDashboard size={19} />,
      text: "Dashboard",
    },
    {
      id: "itinerary",
      icon: <Map size={19} />,
      text: "Itinerary",
    },
    {
      id: "budget",
      icon: <Wallet size={19} />,
      text: "Budget",
    },
    {
      id: "transport",
      icon: <Car size={19} />,
      text: "Transport",
    },
    {
      id: "activities",
      icon: <Compass size={19} />,
      text: "Activities",
    },
    {
      id: "assistant",
      icon: <Bot size={19} />,
      text: "AI Assistant",
    },
    {
      id: "alerts",
      icon: <Bell size={19} />,
      text: "Alerts",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white p-5 shrink-0 relative">
      {/* Logo */}
      <button
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-3 mb-10 text-left w-full"
      >
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-lg">
          ✈️
        </div>

        <div>
          <h1 className="text-xl font-bold">
            TravelPilot
          </h1>

          <p className="text-xs text-slate-400">
            AI Travel Manager
          </p>
        </div>
      </button>

      {/* New Trip */}
      <button
        onClick={() => onNavigate("new-trip")}
        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 flex items-center justify-center gap-2 mb-6 font-semibold"
      >
        <Plus size={18} />
        New Trip
      </button>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            text={item.text}
            active={currentPage === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </nav>

      {/* System Status */}
      <div className="absolute bottom-5 left-5 right-5">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <p className="text-xs text-slate-400">
            TravelPilot AI
          </p>

          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />

            <span className="text-sm text-slate-300">
              System online
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  text,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-400 hover:bg-slate-900 hover:text-white"
      }`}
    >
      {icon}

      <span className="font-medium">
        {text}
      </span>
    </button>
  );
}

export default Sidebar;