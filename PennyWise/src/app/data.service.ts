import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  fetchData() {
    return this.http.get('https://pennywise-189a4-default-rtdb.firebaseio.com/.json');
  }
}
