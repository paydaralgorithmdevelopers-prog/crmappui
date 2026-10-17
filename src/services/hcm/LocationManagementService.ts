import { Location } from '../../types/hcm/attendance';

class LocationManagementService {
  private locations: Location[] = [
    { id: '1', title: 'دفتر مرکزی', latitude: 35.6892, longitude: 51.3890, radius: 100, isActive: true },
    { id: '2', title: 'انبار جاده مخصوص', latitude: 35.7000, longitude: 51.2000, radius: 250, isActive: true },
  ];

  getLocations(): Location[] {
    return this.locations;
  }

  addLocation(loc: Omit<Location, 'id'>): Location {
    const newLoc = { ...loc, id: Math.random().toString(36).substring(7) };
    this.locations.push(newLoc);
    return newLoc;
  }

  updateLocation(id: string, updates: Partial<Location>): void {
    const index = this.locations.findIndex(l => l.id === id);
    if (index !== -1) {
      this.locations[index] = { ...this.locations[index], ...updates };
    }
  }

  deleteLocation(id: string): void {
    this.locations = this.locations.filter(l => l.id !== id);
  }
}

export const locationManagementService = new LocationManagementService();
