import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieCardOptionsComponent } from './movie-card-options/movie-card-options.component';



@NgModule({
  declarations: [
    DashboardComponent,
    MovieCardOptionsComponent,
    
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  exports: [
    MovieCardOptionsComponent
  ]
})
export class AdminModule { }
