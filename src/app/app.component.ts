import { HttpService } from './http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'laptop-signalR';

  notify :any [] =[];
  /**
   *
   */
  constructor(private _HttpService:HttpService) {

  }

  ngOnInit(): void {
      this._HttpService.GetLaptops().subscribe(res=>{
        console.log(res);
      })

      this._HttpService.GetNotificaions().subscribe(res=>{
        // console.log(res);
        this.notify = res
      })
  }
}
