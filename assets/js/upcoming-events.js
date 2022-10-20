//Variables
let cardsContainer = document.getElementById("card-container");
let searchInput = document.getElementById("js-search-input");
let searchButton = document.getElementById("js-search-button");
let checkboxContainer = document.getElementById("js-checkbox-container");
let state = {
  categories: [],
  search: "",
};

//Functions
function cardTemplate(event) {
  return `
  <div class="col">
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
          <a href="./details.html?id=${event._id}" class="btn-pink">See more</a>
        </div>
      </div>
    </div>
  </div>
`;
}

function checkboxTemplate(category) {
  return `
  <div class="form-check form-check-inline">
    <label class="form-check-label" for="${category}">${category}</label>
    <input
      class="form-check-input js-category-checkbox"
      type="checkbox"
      value="${category}"
      id="${category}"
      name="category"
    />
  </div>
  `;
}

function notFoundTemplate() {
  return `<div class="w-100"><h2 class="text-center">Events not found. Please adjust your filters</h2><div>`;
}

function addContentToContainer(list, container, template) {
  container.innerHTML = "";
  list.forEach((element) => {
    container.innerHTML += template(element);
  });
}

function addTargetToState(target) {
  if (target.type === "checkbox") {
    if (target.checked) {
      state.categories.push(target.value);
    } else {
      state.categories = state.categories.filter((category) => {
        return category !== target.value;
      });
    }
  } else if (target.type === "text") {
    state[target.name] = target.value;
  }
}

function filterByCategories(list) {
  let newList = [];
  if (!state.categories.length) {
    newList = [...list];
  } else {
    state.categories.forEach((category) => {
      newList = newList.concat(
        list.filter((event) => event.category === category)
      );
    });
  }
  return newList;
}

function filterBySearch(list) {
  let newList = [...list];
  if (state.search) {
    newList = newList.filter((value) => {
      return value.name.toLowerCase().includes(state.search.toLowerCase());
    });
  }
  return newList;
}

function filterCards(target, container, events) {
  addTargetToState(target);
  let newEvents = filterByCategories(events);
  newEvents = filterBySearch(newEvents);

  if (newEvents.length) {
    addContentToContainer(newEvents, container, cardTemplate);
  } else {
    container.innerHTML = notFoundTemplate();
  }
}

async function getEvents() {
  //Variables
  let res = await fetch("https://mind-hub.up.railway.app/amazing");
  let data = await res.json();
  let events = data.events;
  let categories = new Set(data.events.map((event) => event.category));
  let currentDate = new Date(data.date);

  let filteredEvents = events.filter(
    (event) => new Date(event.date) >= currentDate
  );

  //Adding content when loading page
  addContentToContainer(filteredEvents, cardsContainer, cardTemplate);
  addContentToContainer(categories, checkboxContainer, checkboxTemplate);

  //Adding events
  searchButton.addEventListener("click", () => {
    filterCards(searchInput, cardsContainer, filteredEvents);
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      filterCards(event.target, cardsContainer, filteredEvents);
    }
  });

  checkboxList = document.querySelectorAll(".js-category-checkbox");

  checkboxList.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      filterCards(event.target, cardsContainer, filteredEvents);
    });
  });
}

getEvents();
