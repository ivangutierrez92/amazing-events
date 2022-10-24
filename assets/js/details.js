//Variables
let detailContainer = document.getElementById("js-detail-container");
let detailId = new URLSearchParams(location.search).get("id");
//Functions
function detailTemplate(event) {
  return `
  <div class="card my-auto w-75 mx-auto shadow">
        <div class="row g-0">
          <div class="col-lg-4 bg-pink p-2 border border-dark border-1">
            <img
              src="${event.image}"
              class="w-100 h-100 fit-cover"
              alt="${event.name}"
            />
          </div>
          <div class="col-lg-8">
            <div class="card-body">
              <h5 class="card-title">${event.name}</h5>
              <p class="card-text text-muted">${event.date.slice(0, 10).split("-").reverse().join("-")}</p>
              <p class="card-text">
                ${event.description}
              </p>
              <div class="row">
                <div class="col-12 col-md-6">
                  <p class="card-text">
                    <span class="fw-bold">Category</span>: ${event.category}
                  </p>
                </div>
                <div class="col-12 col-md-6">
                  <p class="card-text">
                    <span class="fw-bold">Place</span>: ${event.place}
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-6">
                  <p class="card-text">
                    <span class="fw-bold">Capacity</span>: ${event.capacity}
                  </p>
                </div>
                <div class="col-12 col-md-6">
                  <p class="card-text">
                    <span class="fw-bold">${event.estimate ? "Estimate" : "Assistance"}</span>: ${
    event.estimate || event.assistance
  }
                  </p>
                </div>
              </div>
              <p class="card-text"><span class="fw-bold">Price</span>: ${event.price}</p>
            </div>
          </div>
        </div>
      </div>
  `;
}

function ErrorTemplate() {
  return `<div class="w-100 mt-5"><h2 class="text-center">Event not found</h2><div>`;
}

function addContentToContainer(event, container, template) {
  container.innerHTML = template(event);
}

async function getEvent(id) {
  try {
    let res = await fetch(`https://mind-hub.up.railway.app/amazing/${id}`);
    let data = await res.json();
    let event = data.event;
    addContentToContainer(event, detailContainer, detailTemplate);
  } catch (error) {
    console.log(error);
    detailContainer.innerHTML = ErrorTemplate();
  }
}

getEvent(detailId);
