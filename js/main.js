"use strict";

// Global arrays
let jobList = [];
let favouriteJobsList = [];

// Global vars
const searchInput = document.getElementById("headerSearch");
const counterText = document.getElementById("counterText");
const jobListContent = document.getElementById("listJob");
const modal = document.getElementById("modal");
const modalIcon = document.getElementById("modalIcon");
const modalInfo = document.getElementById("modalInfo");
const modalButton = document.getElementById("modalButton");
const homePage = document.getElementById("homePage");
const favouritesPage = document.getElementById("favouritePage");
const listFavouriteJobs = document.getElementById("listFavouriteJobs");
const individualJobPage = document.getElementById("inidividualJob");
const homeLink = document.getElementById("homeLink");
const logoLink = document.getElementById("headerLogo");
const favouritesLink = document.getElementById("favouritesLink");

// Get data API
const getData = () => {
  const dataUrl = "../data/data.json";
  fetch(dataUrl)
    .then((response) => response.json())
    .then((data) => {
      jobList = data;
      showJobs();
      showFavouritesJob();
      showInfo();
    });
};

getData();

// Show jobs
const showJobs = () => {
  jobListContent.innerHTML = "";

  const insertJobList = jobList
    .map((job) => {
      const {
        id,
        company,
        company_logo,
        company_url,
        title,
        location,
        type,
      } = job;

      return `
      <article class="card job-item">
        <header class="card__header">
          <img class="card__image job-item__image" width="100" src=${company_logo} alt=${company} />
        </header>
        <section class="card__info">
          <h3 class="card__title job-item__title">${title}</h3>
          <nav class="card__details">
            <li class="card__details-item">${location}</li>
            <li class="card__details-item">${type}</li>
          </nav>
          <a class="card__company job-item__company" href=${company_url} title=${company} target="_blank">${company}</a>
        </section>
        <footer class="card__footer">
          <button id="cardApplyButton" class="card__button card__button--apply" data-id=${id}>Apply</button>
          <button id="cardMoreInfo" class="card__button card__button--info" data-id=${id}>More info</button>
        </footer>
      </article>`;
    })
    .join("");

  console.log(jobList);

  jobListContent.innerHTML = insertJobList;

  detectFavouriteButton();
  detectInfoButton();
  addFavouriteJob();
};

// Show total job
const showTotalJobs = () => {
  counterText.innerHTML = `Showing ${jobList.length} jobs`;
};

// Filter job
const filterJobs = () => {
  let searchResult = searchInput.value;

  let filteredJobs = jobList.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchResult.toLowerCase()) ||
      job.company.toLowerCase().includes(searchResult.toLowerCase())
    );
  });

  const insertFilteredJobs = filteredJobs
    .map((filteredJob) => {
      const {
        id,
        company,
        company_logo,
        company_url,
        title,
        location,
        type,
      } = filteredJob;

      return `
      <article class="card job-item">
        <header class="card__header">
          <img class="card__image job-item__image" width="100" src=${company_logo} alt=${company} />
        </header>
        <section class="card__info">
          <h3 class="card__title job-item__title">${title}</h3>
          <nav class="card__details">
            <li class="card__details-item">${location}</li>
            <li class="card__details-item">${type}</li>
          </nav>
          <a class="card__company job-item__company" href=${company_url} title=${company} target="_blank">${company}</a>
        </section>
        <footer class="card__footer">
          <button id="cardApplyButton" class="card__button card__button--apply" data-id=${id}>Apply</button>
          <button id="cardMoreInfo" class="card__button card__button--info" data-id=${id}>More info</button>
        </footer>
      </article>`;
    })
    .join("");

  if (filteredJobs.length >= 1) {
    jobListContent.innerHTML = insertFilteredJobs;
    searchInput.classList.remove("header__search--error");
  } else {
    jobListContent.innerHTML = `<p>No existen trabajos actualmente con ese título</p>`;
    searchInput.classList.add("header__search--error");
  }

  counterText.innerHTML = `Showing ${filteredJobs.length} jobs`;

  detectFavouriteButton();
  addFavouriteJob();
};

searchInput.addEventListener("keyup", filterJobs);

// Add to favourites
const detectFavouriteButton = () => {
  const favouriteButtons = document.querySelectorAll("#cardApplyButton");

  for (const favouriteButton of favouriteButtons) {
    favouriteButton.addEventListener("click", addFavouriteJob);
  }
};

const addFavouriteJob = (ev) => {
  const jobId = ev.target.dataset.id;

  let favouriteJob;

  for (let job of jobList) {
    if (jobId === job.id) {
      favouriteJob = job;
    }
  }

  let foundFavouriteJob;

  for (let job of favouriteJobsList) {
    if (jobId === job.id) {
      foundFavouriteJob = job;
    }
  }

  if (foundFavouriteJob === undefined) {
    favouriteJobsList.push({
      id: favouriteJob.id,
      company: favouriteJob.company,
      company_logo: favouriteJob.company_logo,
      company_url: favouriteJob.company_url,
      title: favouriteJob.title,
      location: favouriteJob.location,
      type: favouriteJob.type,
      description: favouriteJob.description,
    });
    modalJob(
      "Job was added to your favourite's list",
      "fa-thumbs-up",
      "modal__icon--success"
    );
  } else {
    modalJob(
      "This job exist in your favourite job list",
      "fa-exclamation-circle",
      "modal__icon--error"
    );
  }

  console.log(favouriteJobsList);
  showFavouritesJob();
};

// Show detail job

const detectInfoButton = () => {
  const detectInfoButtons = document.querySelectorAll("#cardMoreInfo");

  for (const detectInfoButton of detectInfoButtons) {
    detectInfoButton.addEventListener("click", showInfo);
  }
};

const showInfo = (ev) => {
  const jobId = ev.target.dataset.id;

  let getJob;

  for (let job of jobList) {
    if (jobId == job.id) {
      getJob = job;
    }
  }

  individualJobPage.classList.add("page--active");
  homePage.classList.remove("page--active");
  favouritesPage.classList.remove("page--active");
  homeLink.classList.remove("header__nav-icon--active");
  favouritesLink.classList.remove("header__nav-icon--active");

  const {
    id,
    company,
    company_logo,
    company_url,
    title,
    location,
    description,
    type,
    how_to_apply,
  } = getJob;

  individualJobPage.innerHTML = `
    <main class="individual-job__content">
      <a class="individual-job__figure" href=${company_url} title=${title}>
        <img class="individual-job__image" src=${company_logo} alt=${title} />
      </a>
      <section class="individual-job__info">
        <h3 class="individual-job__title">${title} - ${company}</h3>
        <p class="individual-job__description">${description}</p>
        <hr/>
        <div class="individual-job__tags">
          <span class="individual-job__tag">${location}</span>
          <span class="individual-job__tag">${type}</span>
        </div>
        <footer class="individual-job__footer">
          ${how_to_apply}
        </footer>
      </section>
    </main>
  `;
};

// Show favourites jobs
const showFavouritesJob = () => {
  const favouritesJobs = favouriteJobsList
    .map((job) => {
      const {
        id,
        company,
        company_logo,
        company_url,
        title,
        location,
        type,
      } = job;

      return `
      <article class="card job-item">
        <header class="card__header">
          <img class="card__image job-item__image" width="100" src=${company_logo} alt=${company} />
        </header>
        <section class="card__info">
          <h3 class="card__title job-item__title">${title}</h3>
          <nav class="card__details">
            <li class="card__details-item">${location}</li>
            <li class="card__details-item">${type}</li>
          </nav>
          <a class="card__company job-item__company" href=${company_url} title=${company} target="_blank">${company}</a>
        </section>
        <footer class="card__footer">
          <button id="cardDeleteButton" class="card__button card__button--apply" data-id=${id}>Remove</button>
          <button id="cardMoreInfo" class="card__button card__button--info" data-id=${id}>More info</button>
        </footer>
      </article>`;
    })
    .join("");

  favouritesPage.innerHTML = favouritesJobs;
};

// Create modalJob
const modalJob = (text, typeIcon, iconColor) => {
  modal.classList.add("modal--active");

  modalIcon.className = "";

  modalIcon.classList.add("modal__icon", "fa");

  modalIcon.classList.add(typeIcon);

  modalIcon.classList.add(iconColor);

  modalInfo.innerHTML = "";

  modalInfo.innerHTML = `
    <div class="modal__info">
      <p class="modal__info-text">${text}</p>
    </div>
  `;
};

const closeModal = () => {
  modal.classList.remove("modal--active");
};

modalButton.addEventListener("click", closeModal);

closeModal();

// Navigation
const navigation = () => {
  // Por default que aparezca la home
  homePage.classList.add("page--active");

  const showHome = () => {
    favouritesPage.classList.remove("page--active");
    individualJobPage.classList.remove("page--active");
    homePage.classList.add("page--active");
    homeLink.classList.add("header__nav-icon--active");
    favouritesLink.classList.remove("header__nav-icon--active");
    searchInput.classList.remove("header__search--hidden");
  };

  const showFavourites = () => {
    homePage.classList.remove("page--active");
    individualJobPage.classList.remove("page--active");
    favouritesPage.classList.add("page--active");
    homeLink.classList.remove("header__nav-icon--active");
    favouritesLink.classList.add("header__nav-icon--active");
    searchInput.classList.add("header__search--hidden");
  };

  homeLink.addEventListener("click", showHome);
  logoLink.addEventListener("click", showHome);
  favouritesLink.addEventListener("click", showFavourites);
};

navigation();
