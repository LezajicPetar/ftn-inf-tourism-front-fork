import { Tour } from "../models/tour.model";

export class TourService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = 'http://localhost:48696/api/tours';
    }

    create(tour: Tour): Promise<Tour> {
        return fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tour)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw { status: response.status, message: text }
                    })
                }
                return response.json();
            })
            .then((newTour: Tour) => {
                return newTour;
            })
            .catch(error => {
                console.error('Error creating tour:', error.message);
                throw error;
            });
    }

    update(tourId: number, tour: Tour): Promise<Tour> {
        return fetch(`${this.apiUrl}/${tourId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tour)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw { status: response.status, message: text }
                    })
                }
                return response.json();
            })
            .then(tour => {
                return tour;
            })
            .catch(error => {
                console.error('Error updating tour:', error.message)
                throw error;
            })

    }
    getAll(guideId: Number): Promise<Tour[]> {
        return fetch(`${this.apiUrl}?guideId=${guideId}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw { status: response.status, message: text };
                    })
                }
                return response.json();
            })
            .then((allTours: Tour[]) => {
                return allTours;
            })
            .catch(error => {
                console.error('Error creating tour:', error.message)
                throw error;
            })
    }

    delete(tourId: Number): Promise<void> {
        return fetch(`${this.apiUrl}/${tourId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw {status: response.status, message: text }
                    })
                }
            })
            .catch(error =>{
                console.error('Failed to delete', error.message)
                throw error;
            })
    }

    getById(tourId: Number): Promise<Tour> {
        return fetch(`${this.apiUrl}/${tourId}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw { status: response.status, message: text };
                    })
                }
                return response.json();
            })
            .then(tour => {
                return tour;
            })
            .catch(error => {
                console.error('Error geting tour:', error.message)
                throw error;
            })
    }
}