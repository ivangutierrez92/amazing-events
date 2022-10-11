let events = data.events;
let currentDate = new Date(data.currentDate);
let container = document.getElementById("card-container");

for (let event of events) {
  let eventDate = new Date(event.date);
  if (eventDate < currentDate) {
    let div = document.createElement("div");
    div.className = "col";
    div.innerHTML = `
  <div class="card h-100 shadow px-3 pt-3">
    <img
      src="${event.image}"
      alt="${event.name}"
      class="card-img-top fit-cover-sm"
    />
    <div class="card-body d-flex flex-column justify-content-between">
      <h4 class="card-title text-center">${event.name}</h4>
      <p class="card-text text-center text-truncate">${event.description}</p>
      <div class="d-flex justify-content-between flex-wrap">
        <p class="fw-bold my-auto">Price: $${event.price}</p>
        <button class="btn-pink">See more</button>
      </div>
    </div>
  </div>
  `;
    container.appendChild(div);
  }
}
