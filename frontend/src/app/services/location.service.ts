import { Injectable } from '@angular/core';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  isSimulated?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  // Default Office Base Coordinates (Coimbatore HQ)
  private readonly DEFAULT_OFFICE_LAT = 11.0168;
  private readonly DEFAULT_OFFICE_LNG = 76.9558;

  // Cached coordinates for instant 0ms retrieval
  private cachedLocation: LocationCoordinates = {
    latitude: this.DEFAULT_OFFICE_LAT,
    longitude: this.DEFAULT_OFFICE_LNG,
    isSimulated: true
  };

  constructor() {
    // Proactively refresh GPS in background without blocking any page rendering
    this.refreshGpsInBackground();
  }

  /**
   * Returns coordinates instantly from memory/cache (0ms delay)
   */
  getInstantLocation(): LocationCoordinates {
    return this.cachedLocation;
  }

  /**
   * Returns cached location immediately while verifying GPS in background
   */
  getCurrentLocation(): Promise<LocationCoordinates> {
    return new Promise((resolve) => {
      // Return cached location immediately for instant UI response
      resolve(this.cachedLocation);

      // Trigger background update if browser supports geolocation
      this.refreshGpsInBackground();
    });
  }

  private refreshGpsInBackground(): void {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.cachedLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isSimulated: false
        };
      },
      () => {
        // Silently keep default office coordinates on error/timeout
      },
      {
        enableHighAccuracy: false,
        timeout: 1500,
        maximumAge: 60000 // Cache for 1 minute
      }
    );
  }

  getOfficeCoordinates(): LocationCoordinates {
    return {
      latitude: this.DEFAULT_OFFICE_LAT,
      longitude: this.DEFAULT_OFFICE_LNG,
      isSimulated: true
    };
  }
}
