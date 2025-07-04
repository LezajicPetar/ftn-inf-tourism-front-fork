import { TourService } from "../../services/tour.service.js";
import { Tour } from "../../models/tour.model.js";
import { handleLogout } from "../../../authentication.js";

const tourService = new TourService();

const urlParams = new URLSearchParams(window.location.search)
const paramsTourId: number = getTourIdFromURL();

function initializePage() {
    bindButtons();

    if (paramsTourId) setUpEditMode();
}

function setUpEditMode() {
    (document.querySelector('h2') as HTMLHeadElement).textContent = 'Edit tour';
    tourService.getById(paramsTourId).then(tour => fillOutForm(tour))
}

function getTourIdFromURL(): number | null {
    const id = new URLSearchParams(window.location.search).get("tourId");
    return id ? parseInt(id) : null;
}

function bindButtons() {
    const submitBtn = document.querySelector('button') as HTMLButtonElement;
    submitBtn.addEventListener('click', handleSubmit)

    const logoutLink = document.querySelector("#logout") as HTMLElement;
    logoutLink.addEventListener('click', handleLogout)

}
function fillOutForm(tour) {
    (document.getElementById('name') as HTMLInputElement).value = tour.name;
    (document.getElementById('maxGuests') as HTMLInputElement).value = tour.maxGuests.toString();
    (document.getElementById('date') as HTMLInputElement).value = tour.dateTime;
    (document.querySelector('textArea') as HTMLTextAreaElement).value = tour.description;

}

function handleSubmit() {
    const form = document.querySelector('form') as HTMLFormElement;
    const formData = new FormData(form);

    const textArea = document.querySelector('textarea') as HTMLTextAreaElement;

    const tour: Tour = {
        name: formData.get('name') as string,
        dateTime: formData.get('date') as string,
        maxGuests: parseInt(formData.get('maxGuests') as string),
        description: textArea.value as string,
        guideId: parseInt(localStorage.getItem("userId"))
    }

    if (paramsTourId) {
        tourService.update(paramsTourId, tour).then(() => window.location.href = '../toursPreview/toursPreview.html')
            .catch(error => alert('Failed to update: ' + error.message));

    }
    else {
        tourService.create(tour).then(() => window.location.href = '../toursPreview/toursPreview.html')
            .catch(error => alert('Failed to create: ' + error.message));
    }
}


document.addEventListener('DOMContentLoaded', initializePage)