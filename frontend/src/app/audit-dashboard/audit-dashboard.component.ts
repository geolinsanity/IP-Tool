import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ApiService, AuditSummary, DoughnutResponse, RecentActions } from '../services/api.service';

@Component({
  selector: 'app-audit-dashboard',
  standalone: true,
  imports: [MatCardModule, CommonModule, BaseChartDirective, MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './audit-dashboard.component.html',
  styleUrl: './audit-dashboard.component.scss'
})
export class AuditDashboardComponent implements OnInit {
  auditLogs = [
  { actionType: 'Created', createdAt: new Date('2026-02-10T11:07:52.288Z'), username: 'testUserONE', actionDesc: 'Added new IP 192.0.2.0' },
  { actionType: 'Updated', createdAt: new Date('2026-02-10T12:00:00.000Z'), username: 'testUserTWO', actionDesc: 'Changed label on IP 192.0.2.1' },
  { actionType: 'Deleted', createdAt: new Date('2026-02-10T12:30:00.000Z'), username: 'testUserONE', actionDesc: 'Removed IP 192.0.2.2' },
  { actionType: 'Created', createdAt: new Date('2026-02-11T09:00:00.000Z'), username: 'testUserTHREE', actionDesc: 'Added new user' },
];

  // Summary
  totalActions: number = 0;
  createdActions: number = 0;
  updatedActions: number = 0;
  deletedActions: number = 0;


  // Tile 3
  chartType: 'bar' = 'bar';
  chartData!: ChartData<'bar'>;
  doughnutType: 'doughnut' = 'doughnut';
  doughnutData!: ChartData<'doughnut', number[], unknown>;

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Actions Over Time' }
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Count' }, beginAtZero: true }
    }
  }

  // Doughnut chart
  doughnutOptions: ChartOptions<'doughnut'> = {
      responsive: true,
      plugins: {
          legend: { position: 'bottom' },
          tooltip: { enabled: true }
      }
  };
  totalRecords: number = 0;

  recentActions: RecentActions[] = [];

  constructor(private api: ApiService) {
    this.generateChartData()
    this.generateDoughnutData()
  }

  ngOnInit(): void {
    this.getActionSummary();
    this.getRecentAction();
  }

  getActionSummary(): void {
    this.api.getActionCounts().subscribe({
      next: (res: AuditSummary) => {
        console.log(res)
        this.totalActions = res.totalActions;
        this.createdActions = res.created;
        this.updatedActions = res.updated;
        this.deletedActions = res.deleted;
      },
      error: (err) => {
        console.error('Failed to load summary', err)
      }
    })
  }

  generateChartData(): void {
    this.api.getActionOverTime().subscribe({
      next: (res) => {
        this.chartData = res;
        console.log(this.chartData)
      },
      error: (err) => {
        console.error('Failed to load chart data', err)
      }
    });
  }

  generateDoughnutData(): void {
    this.api.getIPCounts().subscribe({
      next: (res: DoughnutResponse) => {
        this.doughnutData = res.chartData;
        this.totalRecords = res.totalRecords;
        console.log(this.doughnutData)
      },
      error: (err) => {
        console.error('Failed to load doughnut', err)
      }
    })
  }

  getRecentAction(): void {
    this.api.getRecentAction().subscribe({
      next: (res) => {
        this.recentActions = res;
      },
      error: (err) => {
        console.error('Failed to load recent actions', err)
      }
    })
  }
}
