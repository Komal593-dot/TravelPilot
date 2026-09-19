function TripOverview({ trip }) {
  const formatDate = (date) => {
    if (!date) return "Not set";

    const formatted = new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return formatted;
  };

  const budget = Number(trip?.budget || 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

      {/* Top section */}
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            Current Trip
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {trip?.destination || "No destination"}
          </h2>

          <p className="text-slate-500 mt-1">
            {formatDate(trip?.startDate)} –{" "}
            {formatDate(trip?.endDate)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">
            Trip Budget
          </p>

          <p className="text-2xl font-bold text-slate-900">
            ₹{budget.toLocaleString("en-IN")}
          </p>

          <p className="text-sm text-slate-500">
            Total budget
          </p>
        </div>

      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">

        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-sm text-slate-500">
            Travel Style
          </p>

          <p className="text-xl font-bold mt-1">
            {trip?.travelStyle || "Balanced"}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-sm text-slate-500">
            Interests
          </p>

          <p className="text-xl font-bold mt-1">
            {trip?.interests?.length || 0}
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-500">
            Status
          </p>

          <p className="text-xl font-bold text-blue-600 mt-1">
            Planning
          </p>
        </div>

      </div>

    </div>
  );
}

export default TripOverview;