export function useApplicationStats(applications) {
  if (!applications) return { statusBreakdown: [], timeline: [] };

  const statusCounts = {};
  applications.forEach((app) => {
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
  });

  const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  const dateCounts = {};
  applications.forEach((app) => {
    const date = app.date_applied;
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });

  const timeline = Object.entries(dateCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return { statusBreakdown, timeline };
}