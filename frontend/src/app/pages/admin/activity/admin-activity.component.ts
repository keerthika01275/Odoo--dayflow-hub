import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ActivityLog {
  id: number;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  category: 'AUTH' | 'WORKFORCE' | 'LEAVE' | 'PAYROLL' | 'SYSTEM';
  status: 'SUCCESS' | 'WARNING' | 'INFO';
}

@Component({
  selector: 'app-admin-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-activity.component.html',
  styleUrls: ['./admin-activity.component.scss']
})
export class AdminActivityComponent implements OnInit {
  logs: ActivityLog[] = [];
  searchQuery = '';
  filterCategory = 'ALL';

  ngOnInit(): void {
    this.generateLogs();
  }

  generateLogs(): void {
    this.logs = [
      {
        id: 1,
        timestamp: 'Just now',
        actor: 'admin@dayflow.com',
        role: 'ADMIN',
        action: 'System Governance Check',
        details: 'Admin reviewed system health and geofencing radius (200m).',
        category: 'SYSTEM',
        status: 'INFO'
      },
      {
        id: 2,
        timestamp: '15 mins ago',
        actor: 'rahul@dayflow.com',
        role: 'EMPLOYEE',
        action: 'GPS Attendance Check-In',
        details: 'Verified on-premise attendance via Geofence (11.0168, 76.9558).',
        category: 'WORKFORCE',
        status: 'SUCCESS'
      },
      {
        id: 3,
        timestamp: '1 hour ago',
        actor: 'priya@dayflow.com',
        role: 'HR',
        action: 'Leave Request Approved',
        details: 'Approved 2-day CASUAL leave for Rahul Sharma with note: Approved.',
        category: 'LEAVE',
        status: 'SUCCESS'
      },
      {
        id: 4,
        timestamp: '3 hours ago',
        actor: 'admin@dayflow.com',
        role: 'ADMIN',
        action: 'Payroll Structure Updated',
        details: 'Recalculated compensation structure for Engineering Department.',
        category: 'PAYROLL',
        status: 'SUCCESS'
      },
      {
        id: 5,
        timestamp: '5 hours ago',
        actor: 'system',
        role: 'SYSTEM',
        action: 'Database Synchronization',
        details: 'H2 database entities synchronized with zero migration errors.',
        category: 'SYSTEM',
        status: 'SUCCESS'
      },
      {
        id: 6,
        timestamp: 'Yesterday',
        actor: 'priya@dayflow.com',
        role: 'HR',
        action: 'HR Portal Access',
        details: 'Priya Patel authenticated with HR privileges via JWT token.',
        category: 'AUTH',
        status: 'INFO'
      }
    ];
  }

  get filteredLogs(): ActivityLog[] {
    const q = this.searchQuery.toLowerCase().trim();
    return this.logs.filter(log => {
      const matchSearch = !q ||
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q);

      const matchCat = this.filterCategory === 'ALL' || log.category === this.filterCategory;
      return matchSearch && matchCat;
    });
  }

  getCategoryBadgeClass(category: string): string {
    const map: Record<string, string> = {
      AUTH: 'cat--auth',
      WORKFORCE: 'cat--workforce',
      LEAVE: 'cat--leave',
      PAYROLL: 'cat--payroll',
      SYSTEM: 'cat--system'
    };
    return map[category] || 'cat--system';
  }
}
