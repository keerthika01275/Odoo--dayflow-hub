import { Injectable } from '@angular/core';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

@Injectable({ providedIn: 'root' })
export class LocationService {

  getCurrentLocation(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Location permission was denied. Please allow GPS access to check in/out.'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Location information is unavailable. Please check your GPS signal.'));
              break;
            case error.TIMEOUT:
              reject(new Error('The request to get your location timed out. Please try again.'));
              break;
            default:
              reject(new Error('An unknown error occurred while retrieving location.'));
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }
}
