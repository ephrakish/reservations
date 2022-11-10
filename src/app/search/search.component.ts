import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  lat = 51.678418;
  lng = 7.809007;

  showDetails: any = false;
  showBusinesses: any = false;
  autoDetectStatus: any = false;

  category: any;
  term:any = "delis"; 
  longitude:any = "";
  latitude:any = "";

  location:any = "new york time square";
  distance:any;

  business:any = [];
  businesses:any = [];
  reviews:any;
  terms:any;

  date:any;
  time:any;
  email:any;

  businessName:any = "north-india-restaurant-san-francisco";

  reviewName:any = "north-india-restaurant-san-francisco";

  ipName:any = "University+of+Southern+California+CA";

  autoText:any = "del";

  categories = [
    "Default", "Arts & Entertainment", "Health & Medical", "Hotels & Travel", "Food", "Professional Services"
  ]

  constructor(private http: HttpClient, private data: DataService) { }

  ngOnInit(): void {
    // this.fetchAuto(this.term, this.longitude, this.latitude)
    // this.fetchBusinesses(this.term, this.longitude, this.latitude)
    // this.fetchBusiness(this.businessName)
    // this.fetchReviews(this.reviewName)
    // this.fetchIp(this.ipName)
    // this.fetchCurrentIp()
    
  }
  display: any;
    center: google.maps.LatLngLiteral = {
        lat: 24,
        lng: 12
    };
    zoom = 4;
    moveMap(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.center = (event.latLng.toJSON());
    }
    move(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.display = event.latLng.toJSON();
    }

    updateCat(ev: { target: any }) {
      this.category = ev.target.value
      console.log(this.category)
    }

    completePost() {
      console.log(this.term, this.latitude, this.longitude, this.distance, this.category)
      if(this.autoDetectStatus) {
        this.data.fetchBusinesses(this.term, this.latitude, this.longitude, this.distance, this.category).subscribe(
          data => {
            if(data.error) {
              console.log(data.error)
            }
            console.log(data)
            this.businesses = data
            console.log(this.businesses)
          }
        )
      }
      this.data.fetchIp(this.location).subscribe(
        data => {
          if(data.error) {
            console.log(data.error)
          } else if (data.results.length === 0) {
            console.log(data.status)
          }
          const location = data.results[0].geometry.location;
          this.latitude = location.lat;
          this.longitude = location.lng;
          console.log(this.latitude, this.longitude)
          if(location.lat !== "") {
            this.data.fetchBusinesses(this.term, this.latitude, this.longitude, this.distance, this.category).subscribe(
              data => {
                if(data.error) {
                  console.log(data.error)
                }
                console.log(data)
                this.businesses = data.businesses
                console.log(this.businesses)
              }
            )
          }
        }
      )
    }

    fetchBusinesses(term: any, longitude: any, latitude: any, distance: any, category: any ) {
      this.data.fetchBusinesses(this.term, this.latitude, this.longitude, this.distance, this.category).subscribe(
        data => {
          if(data.error) {
            console.log(data.error)
          }
          this.businesses = data.businesses
          console.log(this.businesses)
        }
      )
    }
    handleFetchBusiness(name:any, business: any) {
      this.showDetails = true
      this.showBusinesses = false
      this.business = business
      console.log(this.businessName)
      this.fetchBusiness(name)

    }
    backFetchBusinesses() {
      this.showBusinesses = true
      this.showDetails = false
    }
    fetchBusiness(name: any) {
      
      this.data.fetchBusiness(name).subscribe(
        
        data => {
          if(data.error) {
            console.log(data.error)
          }
          const businessData = data
          this.business = businessData
          console.log(businessData)
        }
      )
    }
    fetchAuto(term: any) {
      this.data.fetchAutoSuggest(term).subscribe(
        data => {
          if(data.error) {
            console.log(data.error)
          }
          const newAutoData = data.terms;
          this.terms = newAutoData
          console.log(
            newAutoData
          )
        }
      )
    }
    fetchIp(address: any) {
      this.data.fetchIp(address).subscribe(
          data => {
            if(data.error) {
              console.log(data.error)
            }
            const location = data.results[0].geometry.location;
            this.latitude = location.lat;
            this.longitude = location.lng;
          }
        )
    }
    fetchReviews(name: any) {
      this.data.fetchBusinessReview(name).subscribe(
        data => {
          this.reviews = data.reviews;
          console.log(
            data
          )
        }
      )
    }
    fetchCurrentIp() {
      this.http.get<any>('https://ipinfo.io/?token=8b0a24e59c4aaf').subscribe(
        data => {
          const coordinates = data.loc.split(',');
          this.latitude = coordinates[0];
          this.longitude = coordinates[1];
        }
      )
    }
    toggleShowBusiness() {
      this.showBusinesses = true
    }
    toggleShowDetails() {
      this.showDetails = true
    }
    addToBookings(id:any, items:any) {
      localStorage.setItem(id, items)
    }
    autoDetect() {
      this.autoDetectStatus = !this.autoDetectStatus
      if(this.autoDetectStatus) {
        this.fetchCurrentIp()
        console.log('auto detect mode active')
      }
    }

    changeFn(ev: any) {
      console.log(this.term)
      this.fetchAuto(this.term)
    }

    clearForm() {
      this.term = "";
      this.location = "";
      this.distance = "";
      this.longitude = "";
      this.latitude = "";
      this.businesses = [];
    }
    displayFn(term: any) {
      return term in this.terms ? this.terms : [];
    }
    submitBooking() {
      const newDate = this.date.month+"/"+this.date.day+"/"+this.date.year;
      const newTime = this.time.hour+":"+this.time.minute;
      // console.log(this.businessName, this.email, newDate, newTime)
      const obj = {
        name: this.businessName,
        email: this.email, 
        date: newDate,
        time: newTime
      };
      const myJSON = JSON.stringify(obj);
      localStorage.setItem('token', myJSON)
      let reservation = localStorage.getItem('token')
      console.log(reservation)
    }
    pickTime(ev: any) {
      console.log(ev)
    }

}
