import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisadminComponent } from './crisadmin.component';

describe('CrisadminComponent', () => {
  let component: CrisadminComponent;
  let fixture: ComponentFixture<CrisadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisadminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrisadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
