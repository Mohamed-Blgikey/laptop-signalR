import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http:HttpClient) { }

  GetLaptops():Observable<any>{
    return this.http.get(environment.baseUrl + "GetLaptops");
  }

  GetNotificaions():Observable<any>{
    return this.http.get(environment.baseUrl + "GetNotificaions");
  }

  AddLaptop(obj:any):Observable<any>{
    return this.http.post(environment.baseUrl + 'AddLaptop',obj);
  }

  EditLaptop(obj:any):Observable<any>{
    return this.http.put(environment.baseUrl + 'EditLaptop',obj);
  }

  DeleteLaptop(obj:any):Observable<any>{
    return this.http.delete(environment.baseUrl + 'DeleteLaptop',obj);
  }

  private handleError(err:any) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
