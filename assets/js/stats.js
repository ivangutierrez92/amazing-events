let $eventsStatistics = document.getElementById("js-events-statistics");
let $upcomingEventsStatistics = document.getElementById("js-upcoming-events-statistics");
let $pastEventsStatistics = document.getElementById("js-past-events-statistics");
let $main = document.getElementById("js-stats-main");

async function startProgram() {
  try {
    let pastEvents = await getEvents("time=past");
    let upcomingEvents = await getEvents("time=upcoming");

    processEventsStatistics(pastEvents, $eventsStatistics);
    processCategoriesStatistics(upcomingEvents, $upcomingEventsStatistics);
    processCategoriesStatistics(pastEvents, $pastEventsStatistics);
  } catch (error) {
    $main.innerHTML = `
    <div class="w-100"><h2 class="text-center">An error ocurred, and couldn't show the stats. Please, try again later.</h2><div>
    `;
  }
}

async function getEvents(query) {
  events = await fetch(`https://mind-hub.up.railway.app/amazing?${query}`);
  events = await events.json();
  return events.events;
}

function processEventsStatistics(events, container) {
  let statistics = getEventsStatistics(events);

  let sortedDescByAttendance = sortDescByAttribute(statistics, "attendance");
  let highestAttendance = sortedDescByAttendance[0].name;
  let lowestAttendance = sortedDescByAttendance[sortedDescByAttendance.length - 1].name;
  let largerCapacity = sortDescByAttribute(statistics, "capacity")[0].name;

  container.innerHTML += eventsStatisticsTemplate({
    highestAttendance,
    lowestAttendance,
    largerCapacity,
  });
}

function processCategoriesStatistics(events, container) {
  let statistics = getStatisticsByCategory(events);

  Object.entries(statistics).forEach(entry => {
    let [category, statistics] = entry;
    container.innerHTML += categoryStatisticsTemplate(category, statistics);
  });
}

function getPercentage(part, total) {
  return (part / total) * 100;
}

function sortDescByAttribute(list, attribute) {
  return [...list].sort((a, b) => b[attribute] - a[attribute]);
}

function getEventsStatistics(events) {
  return events.map(event => {
    let attendance = getPercentage(event.assistance, event.capacity);
    return {
      attendance,
      capacity: event.capacity,
      name: event.name,
    };
  });
}

function getStatisticsByCategory(list) {
  return list.reduce((a, b) => {
    let key = a[b.category];
    let attendance = b.assistance || b.estimate;
    let revenue = b.price * attendance;
    let capacity = b.capacity;

    if (key) {
      key.revenue += revenue;
      key.attendance += attendance;
      key.capacity += capacity;
    } else {
      a[b.category] = {
        revenue,
        attendance,
        capacity,
      };
    }

    return a;
  }, {});
}

function eventsStatisticsTemplate(statistics) {
  return `
  <tr>
    <td>${statistics.highestAttendance}</td>
    <td>${statistics.lowestAttendance}</td>
    <td>${statistics.largerCapacity}</td>
  </tr>
`;
}

function categoryStatisticsTemplate(category, statistics) {
  return `
      <tr>
        <td>${category}</td>
        <td>$${statistics.revenue}</td>
        <td>${Math.round(getPercentage(statistics.attendance, statistics.capacity))}%</td>
      </tr>
    `;
}

startProgram();
