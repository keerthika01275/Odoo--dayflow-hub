import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {
  isSaving = false;

  settings = {
    companyName: 'DAYFLOW Technologies Inc.',
    officeLatitude: 11.0168,
    officeLongitude: 76.9558,
    allowedRadiusMeters: 200,
    workStartTime: '09:00',
    workEndTime: '18:00',
    gracePeriodMinutes: 15,
    autoGeofenceValidation: true,
    emailNotifications: true,
    h2ConsoleEnabled: true
  };

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('dayflow_admin_settings');
    if (saved) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
  }

  saveSettings(): void {
    this.isSaving = true;
    localStorage.setItem('dayflow_admin_settings', JSON.stringify(this.settings));
    setTimeout(() => {
      this.isSaving = false;
      this.toast.success('System settings and Geofence parameters updated successfully!');
    }, 400);
  }

  resetDefaults(): void {
    this.settings = {
      companyName: 'DAYFLOW Technologies Inc.',
      officeLatitude: 11.0168,
      officeLongitude: 76.9558,
      allowedRadiusMeters: 200,
      workStartTime: '09:00',
      workEndTime: '18:00',
      gracePeriodMinutes: 15,
      autoGeofenceValidation: true,
      emailNotifications: true,
      h2ConsoleEnabled: true
    };
    this.toast.info('Settings restored to defaults.');
  }
}
