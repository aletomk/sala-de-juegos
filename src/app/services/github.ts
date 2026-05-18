import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GitHub {
  
  private http = inject(HttpClient);
  
  getUser(username: string) {
    return this.http.get<any>(`https://api.github.com/users/${username}`);
  }
}
