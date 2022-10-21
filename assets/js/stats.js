let eventsStatistics = document.getElementById("js-events-statistics");
let upcomingEventsStatistics = document.getElementById(
  "js-upcoming-events-statistics"
);
let pastEventsStatistics = document.getElementById("js-past-events-statistics");

async function getData() {
  let pastEvents = await fetch(
    "https://mind-hub.up.railway.app/amazing?time=past"
  );
  pastEvents = await pastEvents.json();
  pastEvents = pastEvents.events;

  let upcomingEvents = await fetch(
    "https://mind-hub.up.railway.app/amazing?time=upcoming"
  );
  upcomingEvents = await upcomingEvents.json();
  upcomingEvents = upcomingEvents.events;

  let eventsByAttendacePercentage = pastEvents
    .map((event) => {
      let attendancePercentage = (event.assistance / event.capacity) * 100;
      return {
        attendancePercentage,
        capacity: event.capacity,
        name: event.name,
      };
    })
    .sort((a, b) => a.attendancePercentage - b.attendancePercentage);

  let lowestAttendanceEvent = eventsByAttendacePercentage[0].name;
  let highestAttendanceEvent =
    eventsByAttendacePercentage[eventsByAttendacePercentage.length - 1].name;
  let largerCapacityEvent = eventsByAttendacePercentage.sort(
    (a, b) => b.capacity - a.capacity
  )[0].name;

  eventsStatistics.innerHTML += `
  <tr>
    <td>${highestAttendanceEvent}</td>
    <td>${lowestAttendanceEvent}</td>
    <td>${largerCapacityEvent}</td>
  </tr>
`;

  let pastStatisticsByCategories = pastEvents.reduce((a, b) => {
    let category = b.category;
    let revenue = b.price * b.assistance;

    if (a[category]) {
      a[category].revenue += revenue;
      a[category].assistanceSum += b.assistance;
      a[category].capacitySum += b.capacity;
    } else {
      a[category] = {
        revenue,
        assistanceSum: b.assistance,
        capacitySum: b.capacity,
      };
    }
    return a;
  }, {});

  Object.keys(pastStatisticsByCategories).forEach((category) => {
    pastEventsStatistics.innerHTML += `
      <tr>
        <td>${category}</td>
        <td>$${pastStatisticsByCategories[category].revenue}</td>
        <td>${Math.round(
          (pastStatisticsByCategories[category].assistanceSum /
            pastStatisticsByCategories[category].capacitySum) *
            100
        )}%</td>
      </tr>
    `;
  });

  let upcomingStatisticsByCategories = upcomingEvents.reduce((a, b) => {
    let category = b.category;
    let revenue = b.price * b.estimate;

    if (a[category]) {
      a[category].revenue += revenue;
      a[category].estimateSum += b.estimate;
      a[category].capacitySum += b.capacity;
    } else {
      a[category] = {
        revenue,
        estimateSum: b.estimate,
        capacitySum: b.capacity,
      };
    }
    return a;
  }, {});

  Object.keys(upcomingStatisticsByCategories).forEach((category) => {
    upcomingEventsStatistics.innerHTML += `
      <tr>
        <td>${category}</td>
        <td>$${upcomingStatisticsByCategories[category].revenue}</td>
        <td>${Math.round(
          (upcomingStatisticsByCategories[category].estimateSum /
            upcomingStatisticsByCategories[category].capacitySum) *
            100
        )}%</td>
      </tr>
    `;
  });
}

getData();
