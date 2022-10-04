import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFunctionOneComponent } from './employee-function-one.component';

describe('EmployeeFunctionOneComponent', () => {
  let component: EmployeeFunctionOneComponent;
  let fixture: ComponentFixture<EmployeeFunctionOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeFunctionOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeFunctionOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
