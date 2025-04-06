import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCardOptionsComponent } from './movie-card-options.component';

describe('MovieCardOptionsComponent', () => {
  let component: MovieCardOptionsComponent;
  let fixture: ComponentFixture<MovieCardOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovieCardOptionsComponent]
    });
    fixture = TestBed.createComponent(MovieCardOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
