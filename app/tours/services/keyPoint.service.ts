import { KeyPoint } from "../models/keyPoints.model";

export class KeyPointService {
    private apiUrl: string;


    constructor() {
        this.apiUrl = `http://localhost:48696/api/tours`;
    }


    
    delete(tourId: number, keyPointId: number): Promise<void> {
        return fetch(`${this.apiUrl}/${tourId}/key-points/${keyPointId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if(!response.ok){
                return response.text().then(text=> {
                    throw { status: response.status, message: text }
                })
            }
        })
        .catch(error => {
            console.error("Error deleting key point:", error.message);
            throw error;
        })
    }

    create(tourId: number, keyPoint: KeyPoint): Promise<KeyPoint> {
        return fetch(`${this.apiUrl}/${tourId}/key-points`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(keyPoint)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error creating key point: ${response.statusText}`);
                }
                return response.json();
            })
            .then(keyPoint => {
                return keyPoint;
            })
            .catch(error => {
                console.error("Error creating key point:", error);
                throw error;
            })
    }
}