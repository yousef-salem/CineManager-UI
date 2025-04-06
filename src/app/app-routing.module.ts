import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { RegisterComponent } from './shared/register/register.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { HomeComponent } from './shared/home/home.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { MoviesComponent } from './movie/movies/movies.component';
import { MovieComponent } from './movie/movie/movie.component';
import { authGuard } from './gaurds/auth.guard';
import { adminGuard } from './gaurds/admin.guard';
import { userGuard } from './gaurds/user.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate : [authGuard] },
  { path: 'register', component: RegisterComponent, canActivate : [authGuard] },
  { path: '', component: HomeComponent, children: [
    { path: 'dashboard', component: DashboardComponent  , canActivate : [authGuard, adminGuard] },
    { path: 'movies', component: MoviesComponent  , canActivate : [authGuard , userGuard] },
    { path: 'movie/:id' , component: MovieComponent , canActivate : [authGuard]},
    { path: '', redirectTo: '/movies', pathMatch: 'full' }
  ] },
  { path: 'not-found', component: PageNotFoundComponent , canActivate : [authGuard] } , 
  { path: '**', component: PageNotFoundComponent , canActivate : [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
