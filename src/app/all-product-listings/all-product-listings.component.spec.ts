import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProductListingsComponent } from './all-product-listings.component';

describe('AllProductListingsComponent', () => {
  let component: AllProductListingsComponent;
  let fixture: ComponentFixture<AllProductListingsComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllProductListingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllProductListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
