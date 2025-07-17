import { TourService } from "../../services/tour.service.js";
import { Tour } from "../../models/tour.model.js";
import { handleLogout } from "../../../authentication.js";

const tourService = new TourService();

function initializePage() {
    bindLogout();
    loadAllTours();
}

function bindLogout() {
    const logoutLink = document.querySelector('#logout') as HTMLElement;
    logoutLink.addEventListener('click', handleLogout)
}

function loadAllTours() {
    const tourContainer = document.getElementById('tour-container') as HTMLElement;

    const userId: number = parseInt(localStorage.getItem("userId"));

    tourService.getByGuide(userId)
        .then(allTours => {
            allTours.forEach(tour => {
                tourContainer.appendChild(createTourCard(tour));
            })
        })

}
function createTourCard(tour: Tour): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('div-card');

    const name = document.createElement('span');
    name.classList.add('name');
    name.textContent = tour.name;

    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = tour.description;

    const maxGuests = document.createElement('span');
    maxGuests.textContent = tour.maxGuests.toString();
    maxGuests.classList.add('maxGuests');

    const dateTime = document.createElement('span');
    dateTime.classList.add('dateTime');
    const date: Date = new Date(tour.dateTime)
    dateTime.textContent = date.toLocaleDateString("sr-Rs", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const status = document.createElement('p');
    status.textContent = tour.status;
    if (tour.status === "u pripremi") {
        status.classList.add('status-inPreparation');
    }
    else {
        status.classList.add('status-published');
    }

    const editBtn = document.createElement('button');
    editBtn.classList.add('editBtn');
    editBtn.textContent = 'izmeni';
    editBtn.addEventListener('click', () => {
        window.location.href = `../createEditTour/createEditTour.html?tourId=${tour.id}`
    })


    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.textContent = 'obrisi';
    deleteBtn.addEventListener('click', () => {
        tourService.delete(tour.id);
        div.remove();
    });

    const descriptionSpan = document.createElement('span');
    descriptionSpan.textContent = "Opis:";

    div.append(maxGuests, name, descriptionSpan, description, dateTime, status, editBtn, deleteBtn);


    return div;
}

document.addEventListener('DOMContentLoaded', initializePage)
