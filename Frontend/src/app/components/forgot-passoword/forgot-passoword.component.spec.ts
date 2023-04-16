import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassowordComponent } from './forgot-passoword.component';

describe('ForgotPassowordComponent', () => {
  let component: ForgotPassowordComponent;
  let fixture: ComponentFixture<ForgotPassowordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotPassowordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPassowordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
