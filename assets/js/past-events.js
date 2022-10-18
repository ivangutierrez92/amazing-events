//Variables
let events = data.events;
let currentDate = new Date(data.currentDate);
let cardsContainer = document.getElementById("card-container");
let searchInput = document.getElementById("js-search-input");
let searchButton = document.getElementById("js-search-button");
let categories = new Set(data.events.map((event) => event.category));
let checkboxContainer = document.getElementById("js-checkbox-container");
let state = {
  categories: [],
  search: "",
};
let filteredEvents = events.filter(
  (event) => new Date(event.date) < currentDate
);

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

function filterCards(name, value, type, container) {
  let newEvents = [];
  if (type === "checkbox") {
    if (value) {
      state.categories.push(name);
    } else {
      state.categories = state.categories.filter((category) => {
        return category !== name;
      });
    }
  } else if (type === "input") {
    state.search = value;
  }

  if (!state.categories.length) {
    newEvents = [...filteredEvents];
  } else {
    state.categories.forEach((category) => {
      newEvents = newEvents.concat(
        filteredEvents.filter((event) => event.category === category)
      );
    });
  }

  if (state.search) {
    newEvents = newEvents.filter((value) => {
      return value.name.toLowerCase().includes(state.search.toLowerCase());
    });
  }

  if (newEvents.length) {
    addContentToContainer(newEvents, container, cardTemplate);
  } else {
    container.innerHTML = notFoundTemplate();
  }
}

//Adding content when loading page
addContentToContainer(filteredEvents, cardsContainer, cardTemplate);
addContentToContainer(categories, checkboxContainer, checkboxTemplate);

//Adding events
searchButton.addEventListener("click", () => {
  let value = searchInput.value;
  let name = searchInput.name;
  filterCards(name, value, "input", cardsContainer);
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    let value = event.target.value;
    let name = event.target.name;
    filterCards(name, value, "input", cardsContainer);
  }
});

checkboxList = document.querySelectorAll(".js-category-checkbox");

checkboxList.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    let name = event.target.value;
    let isChecked = event.target.checked;
    filterCards(name, isChecked, "checkbox", cardsContainer);
  });
});
