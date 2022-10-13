let events = data.events;
let cardsContainer = document.getElementById("card-container");
let searchInput = document.getElementById("js-search-input");
let searchButton = document.getElementById("js-search-button");
let categories = new Set(data.events.map((event) => event.category));
let checkboxContainer = document.getElementById("js-checkbox-container");
let state = {};

let cardTemplate = (name, image, description, price) => {
  return `
  <div class="col">
    <div class="card h-100 shadow px-3 pt-3">
      <img
        src="${image}"
        alt="${name}"
        class="card-img-top fit-cover-sm"
      />
      <div class="card-body d-flex flex-column justify-content-between">
        <h4 class="card-title text-center">${name}</h4>
        <p class="card-text text-center text-truncate">${description}</p>
        <div class="d-flex justify-content-between flex-wrap">
          <p class="fw-bold my-auto">Price: $${price}</p>
          <button class="btn-pink">See more</button>
        </div>
      </div>
    </div>
  </div>
`;
};

let checkboxTemplate = (category) => {
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
};

addCardsToContainer(events, cardsContainer, cardTemplate);
addCategoriesToContainer(categories, checkboxContainer, checkboxTemplate);

searchButton.addEventListener("click", () => {
  let value = searchInput.value;
  let key = searchInput.name;
  filterCards(key, value, "input", cardsContainer);
});

checkboxList = document.querySelectorAll(".js-category-checkbox");

checkboxList.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    let key = event.target.value;
    let isChecked = event.target.checked;
    filterCards(key, isChecked, "checkbox", cardsContainer);
  });
});

function addCardsToContainer(events, container, template) {
  container.innerHTML = "";
  events.forEach((event) => {
    container.innerHTML += template(
      event.name,
      event.image,
      event.description,
      event.price
    );
  });
}

function addCategoriesToContainer(categories, container, template) {
  categories.forEach((category) => {
    container.innerHTML += template(category);
  });
}

function filterCards(key, value, type, container) {
  let newEvents = [...events];
  state[key] = {
    value: value,
    type: type,
  };
  for (let key in state) {
    if (state[key].value) {
      if (state[key].type === "checkbox") {
        newEvents = newEvents.filter((event) => event.category === key);
      }

      if (state[key].type === "input") {
        newEvents = newEvents.filter((event) =>
          event.name.toLowerCase().includes(state[key].value.toLowerCase())
        );
      }
    }
  }
  addCardsToContainer(newEvents, container, cardTemplate);
}
