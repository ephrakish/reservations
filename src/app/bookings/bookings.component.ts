import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  bookings:any

  constructor() { }

  ngOnInit(): void {
    const books = localStorage.getItem('token')
    this.bookings = books;
    console.log(this.bookings)
  }

  delBooking() {
    localStorage.removeItem('token')
    const books = localStorage.getItem('token')
    this.bookings = books;
  }

}
