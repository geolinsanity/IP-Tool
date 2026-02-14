import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditDashboardComponent } from './audit-dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

describe('AuditDashboardComponent', () => {
  let component: AuditDashboardComponent;
  let fixture: ComponentFixture<AuditDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditDashboardComponent],
      providers: [
        provideHttpClient(),
        provideCharts(withDefaultRegisterables())
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
