import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouseDirectiveComponent } from './mouse-directive.component';

describe('MouseDirectiveComponent', () => {
  let component: MouseDirectiveComponent;
  let fixture: ComponentFixture<MouseDirectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MouseDirectiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MouseDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
