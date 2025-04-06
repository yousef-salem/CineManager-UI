import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MovieService } from '../movie.service';
import { ApiResponse } from 'src/app/service/api.service';
import { AuthService } from 'src/app/service/auth.service';
import { DashboardService } from 'src/app/admin/dashboard.service';


@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent {
  movie: any;
  isLoading: boolean = true;
  defaultPoster: string = '/assets/images/movie-collection4.jpg';
  userRating: number = 0;
hasLiked: boolean | null = null;
isRating: boolean = false;
isUsser: boolean =false;
  constructor(private route: ActivatedRoute,private location: Location
    , private movieService : MovieService, private router : Router
  ,protected authService: AuthService,private dashboardService:DashboardService) {
    this.isUsser = this.authService.checkCapabilities('ROLE_USER');
  }

  ngOnInit(): void {
    let movieId = this.route.snapshot.paramMap.get('id')||''
    this.getMovie(movieId);
    if(this.isUsser)
    this.getUserRating(movieId);
  }

  getMovie(movieId:string): void {
    this.isLoading = true;
    this.movieService.getMovie(movieId).subscribe(
      {
        next: (response: ApiResponse<any>) => {
          this.movie = {...response.data};
          console.log(this.movie);
          this.isLoading = false;
          this.movieService.onResponseSuccess('Movie loaded');
        },
        error: (error:any) => {
          console.log(error);
          
          if(error.error.error.errors[0].includes('Movie not found') && this.isUsser ){
            this.router.navigate(['/not-found']);
          }else if(!this.isUsser){
            this.getExternalMovie(movieId)
          }
          this.isLoading = false;
        } 
      }
    )
  }
  getExternalMovie(movieId :  string){
    this.dashboardService.getMovieExternalByID(movieId).subscribe({
      next:(response : ApiResponse<any>)=>{
       this.movie = response.data
       this.movieService.onResponseSuccess('Movie loaded');
      },
      error: (error:any) => {
        console.log(error);
        this.router.navigate(['/not-found']);
        this.isLoading = false;
      }
    })
  }
  getUserRating(movieId:string) {
    this.isRating = true;
    this.movieService.getUserRating(movieId).subscribe(
      {
        next: (response: ApiResponse<any>) => {
          let returndata = response.data;
          console.log(response);
          this.hasLiked = returndata.liked;
          this.userRating = returndata.rating;
          this.isRating = false;
        },
        error: (error:any) => {
          console.log(error);
          this.movieService.onResponsefaild('Failed to get user rating. Please try again.');
          if(error.status == 404){
          this.userRating = 0;
          this.hasLiked = null;
          this.isRating = false;
      }
    }
  })
  }
  addUserRating(rating: any) {
    this.movieService.addUserRating(rating).subscribe(
      {
        next: (response: ApiResponse<any>) => {
          let returndata = response.data;
          console.log(response);
          this.hasLiked = returndata.liked;
          this.userRating = returndata.rating;
          this.isRating = false;
          // this.isLoading = false;
        },
        error: (error:any) => {
          console.log(error);
          this.movieService.onResponsefaild('Failed to add user rating. Please try again.');
          this.getUserRating(this.movie.id);
          // this.isLoading = false;
      }
  })
  }
  get posterImage(): string {
    return this.movie?.poster && this.movie.poster !== 'N/A' 
      ? this.movie.poster 
      : this.defaultPoster;
  }

  // getRatingValue(source: string): string {
  //   const rating = this.movie?.ratings?.find((r: any) => r.source === source);
  //   return rating ? rating.value : 'N/A';
  // }
  getAdditionalInfo(): any[] {
    const infoItems = [];
    
    if (this.movie?.imdbRating && this.movie.imdbRating !== 'N/A') {
      infoItems.push({
        label: 'IMDb Rating',
        value: this.movie.imdbRating,
        subtext: `${this.movie.imdbVotes || 'N/A'} votes`,
        icon: 'bi-star-fill',
        valueClass: 'imdb-rating'
      });
    }
  
    if (this.movie?.Metascore && this.movie.Metascore !== 'N/A') {
      infoItems.push({
        label: 'Metascore',
        value: this.movie.Metascore,
        subtext: 'Metacritic',
        valueClass: 'metascore'
      });
    }
  
    if (this.movie?.BoxOffice && this.movie.BoxOffice !== 'N/A') {
      infoItems.push({
        label: 'Box Office',
        value: this.movie.BoxOffice,
        subtext: 'Gross USA'
      });
    }
  
    
    if (this.movie?.DVD && this.movie.DVD !== 'N/A') {
      infoItems.push({
        label: 'DVD Release',
        value: this.movie.DVD,
        subtext: 'Release Date'
      });
    }
  
    if (this.movie?.Production && this.movie.Production !== 'N/A') {
      infoItems.push({
        label: 'Production',
        value: this.movie.Production
      });
    }
  
    return infoItems;
  }
  goBack(): void {
    this.location.back();
  }
  rateMovie(rating: number): void {
    this.isRating = true;
    const request = {
        movieId: this.movie.imdbID,
        rating: rating,
        liked: this.hasLiked 
    };
    this.addUserRating(request);
}
  
toggleLike(): void {
  const newLikeStatus = this.hasLiked === null ? true : 
                       this.hasLiked === true ? null : true;
                       console.log(newLikeStatus);
  const request = {
      movieId: this.movie.imdbID,
      rating: this.userRating, 
      liked: newLikeStatus
  };
  this.addUserRating(request);
}

toggleDislike(): void {
  const newLikeStatus = this.hasLiked === null ? false : 
                       this.hasLiked === false ? null : false;
  console.log(newLikeStatus);
  const request = {
      movieId: this.movie.imdbID,
      rating: this.userRating, 
      liked: newLikeStatus
  };
  this.addUserRating(request);
}
  
  getRatingStars(): any[] {
    return Array(5).fill(0).map((_, i) => ({
      filled: i < this.userRating,
      number: i + 1
    }));
  }
}