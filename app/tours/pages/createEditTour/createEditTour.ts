import { TourService } from "../../services/tour.service.js";
import { Tour } from "../../models/tour.model.js";
import { handleLogout } from "../../../authentication.js";
import { KeyPointService } from "../../services/keyPoint.service.js";
import { KeyPoint } from "../../models/keyPoints.model.js";

const tourService = new TourService();
const keyPointService = new KeyPointService();

const paramsTourId: number = getTourIdFromURL();
const form = document.querySelector('form') as HTMLFormElement;
let addedEvents: boolean = false;

function getTourIdFromURL(): number | null {
    const id = new URLSearchParams(window.location.search).get("tourId");
    return id ? parseInt(id) : null;
}

function initializePage() {

    bindButtons();
    if (paramsTourId) setUpEditMode();
}

function setUpEditMode() {

    (document.querySelector('h2') as HTMLHeadElement).textContent = 'Edit tour';
    tourService.getById(paramsTourId).then(tour => fillOutForm(tour))
}

function fillOutForm(tour: Tour): void {
    (document.getElementById('name') as HTMLInputElement).value = tour.name;
    (document.getElementById('maxGuests') as HTMLInputElement).value = tour.maxGuests.toString();
    (document.getElementById('date') as HTMLInputElement).value = tour.dateTime;
    (document.querySelector('textArea') as HTMLTextAreaElement).value = tour.description;
}

function bindButtons() {

    const addKeyPointsBtn = document.getElementById('addKeyPointsBtn') as HTMLButtonElement;
    addKeyPointsBtn.addEventListener('click', saveTourInPreparation)

    const logoutLink = document.querySelector("#logout") as HTMLElement;
    logoutLink.addEventListener('click', handleLogout)
}

async function saveTourInPreparation() {

    const formData = new FormData(form);
    const textArea = document.querySelector('textarea') as HTMLTextAreaElement;

    const newTour: Tour = {
        name: formData.get('name') as string,
        dateTime: formData.get('date') as string,
        maxGuests: parseInt(formData.get('maxGuests') as string),
        description: textArea.value as string,
        guideId: parseInt(localStorage.getItem("userId")),
    }

    if (paramsTourId) {
        const updatedTour: Tour = await tourService.update(paramsTourId, newTour);
        loadKeyPointsForm(updatedTour);
    }
    else {
        const createdTour: Tour = await tourService.create(newTour);
        loadKeyPointsForm(createdTour);
    }
}

function loadKeyPointsForm(tour: Tour): void {

    styleKeyPointsForm(tour);
    bindKeyPointsButtons(tour);
    loadKeyPoints(tour.id);
    validateForm(tour.id);
}

function styleKeyPointsForm(tour: Tour): void {

    (document.getElementById("step1") as HTMLDivElement).style.display = "none";
    (document.getElementById("step2") as HTMLDivElement).style.display = "block";

    (document.getElementById("bar2") as HTMLParagraphElement).style.backgroundColor = "#ff5733";

    (document.getElementById("namePreview") as HTMLHeadingElement).textContent = 'Name: ' + tour.name;
    (document.getElementById("datePreview") as HTMLHeadingElement).textContent = 'Date: ' + tour.dateTime;
    (document.getElementById("maxGuestsPreview") as HTMLHeadingElement).textContent = 'MaxGuests: ' + tour.maxGuests;
}

function bindKeyPointsButtons(tour: Tour): void {

    if (!addedEvents) {
        const addBtn = document.getElementById('addBtn') as HTMLButtonElement;
        addBtn.addEventListener('click', async () => {
            await createKeyPoint(tour.id);
            resetKeyPointsForm();
            await loadKeyPoints(tour.id);
            await validateForm(tour.id);
        });

        const publishBtn = document.getElementById('publishBtn') as HTMLButtonElement;
        publishBtn.addEventListener('click', async () => {
            tour.status = 'objavljena';
            await tourService.update(tour.id, tour);
            window.location.href = '../toursPreview/toursPreview.html';
        })

        const backBtn = document.getElementById('backBtn') as HTMLButtonElement;
        backBtn.addEventListener('click', () => {
            (document.getElementById("step1") as HTMLDivElement).style.display = "block";
            (document.getElementById("step2") as HTMLDivElement).style.display = "none";

            (document.getElementById("bar2") as HTMLParagraphElement).style.backgroundColor = "white";

        })

        addedEvents = true;
    }
}

async function createKeyPoint(tourId: number): Promise<void> {
    const form = document.getElementById('form-card') as HTMLFormElement;
    const formData = new FormData(form);

    const keyPoint: KeyPoint = {
        name: formData.get('keyPointName') as string,
        order: parseInt(formData.get('order') as string),
        tourId: tourId as number,
        description: formData.get('keyPointDescription') as string,
        imageUrl: formData.get('imageUrl') as string,
        latitude: parseInt(formData.get('latitude') as string),
        longitude: parseInt(formData.get('longitude') as string),
    }

    await keyPointService.create(tourId, keyPoint);
}

function resetKeyPointsForm(): void {
    (document.getElementById('order') as HTMLInputElement).value = '';
    (document.getElementById('keyPointName') as HTMLInputElement).value = '';
    (document.getElementById('imageUrl') as HTMLInputElement).value = '';
    (document.getElementById('latitude') as HTMLInputElement).value = '';
    (document.getElementById('longitude') as HTMLInputElement).value = '';
    (document.getElementById('keyPointDescription') as HTMLInputElement).value = '';
}

async function loadKeyPoints(tourId: number): Promise<void> {

    const tour: Tour = await tourService.getById(tourId);

    const keyPointsDiv = document.getElementById('keyPoints') as HTMLDivElement;
    keyPointsDiv.innerHTML = '';

    tour.keyPoints?.forEach(kp => {
        const divPair = document.createElement('div');
        divPair.classList.add('keyPointButtonPair');
        divPair.id = `keyPoint-${kp.id}`;

        const newKeyPoint = document.createElement('span');
        newKeyPoint.textContent += `${kp.order}. ${kp.name}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('remove-keyPoint');
        deleteBtn.type = 'button';
        deleteBtn.addEventListener('click', async () => {
            await keyPointService.delete(kp.tourId, kp.id);
            document.getElementById(`keyPoint-${kp.id}`).remove();
            validateForm(tourId);
        })

        divPair.appendChild(newKeyPoint);
        divPair.appendChild(deleteBtn);

        const keyPointsDiv = document.getElementById('keyPoints') as HTMLDivElement;
        keyPointsDiv.appendChild(divPair);
    })
}

async function validateForm(tourId: number) {
    const publishBtn = document.getElementById('publishBtn') as HTMLButtonElement;
    const textArea = document.querySelector('textarea') as HTMLTextAreaElement;

    const tour: Tour = await tourService.getById(tourId);

    publishBtn.disabled = !(textArea.value.length >= 3 && tour.keyPoints.length >= 2);
}

document.addEventListener('DOMContentLoaded', initializePage)