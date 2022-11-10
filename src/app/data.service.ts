import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  fetchBusinesses(term:any, longitude:any, latitude:any, distance:any, category:any) {
    return this.http.get<any>(`http://localhost:5000/${term}/${longitude}/${latitude}/${distance}/${category}`)
  }

  fetchAutoSuggest(term:any) {
    return this.http.get<any>(`http://localhost:5000/auto/${term}`)
  }

  fetchBusiness(name:any) {
    return this.http.get<any>(`http://localhost:5000/business/${name}`)
  }

  fetchBusinessReview(name:any) {
    return this.http.get<any>(`http://localhost:5000/business/review/${name}`)
  }

  fetchIp(address:any) {
    return this.http.get<any>(`http://localhost:5000/getip/${address}`)
  }
}
