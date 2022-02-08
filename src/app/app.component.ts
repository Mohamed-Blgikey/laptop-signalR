import { environment } from './../environments/environment';
import { HttpService } from './http.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as signalR from '@aspnet/signalr'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'laptop-signalR';

  imgPrefix:string = environment.photoUrl;
  laps :any [] =[];
  notify :any [] =[];
  postarName : string = '';
  /**
   *
   */
  constructor(private _HttpService:HttpService) {

  }

  ngOnInit(): void {
    this.getLaptops();
    this.getNotify();

    //openConnection
    var hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(environment.baseUrl+"Notify")
            .build()

    hubConnection.start().then(()=>{
      console.log('connection started');
    }).catch(err=>console.log(err)
    );

    hubConnection.onclose(() => {
      setTimeout(() => {
        console.log('try to re start connection');
        hubConnection.start().then(() => {
          console.log('connection re started');
        }).catch((err:any) => console.log(err));
      }, 5000);
    });


    hubConnection.on("LaptopAction",()=>{
      console.log("Done");
    })

  }


  lapForm :FormGroup = new FormGroup({
    id : new FormControl(0),
    name:new FormControl(''),
    ram:new FormControl(''),
    storage:new FormControl(''),
    poster:new FormControl(''),
  })


  getPoster(e:any){
    if (this.postarName != '') {
      let photo = {
        name:this.postarName
      }
      this._HttpService.UnSavePhoto(photo).subscribe(res=>{
        // console.log(res);

      })
    }
    var file=e.target.files[0];
    const formData:FormData=new FormData();
    formData.append('poster',file,file.name);
    this._HttpService.SavePhoto(formData).subscribe(res=>{
      this.postarName = res.message;
      // console.log(this.postarName);
    })
  }



  add(lapForm:FormGroup){
    let data = {
      id : 0,
      name : lapForm.controls['name'].value,
      ram : lapForm.controls['ram'].value,
      storage : lapForm.controls['storage'].value,
      poster : this.postarName

    }


    this._HttpService.AddLaptop(data).subscribe(res=>{
      console.log(res);
    })
  }


  private getLaptops(){
    this._HttpService.GetLaptops().subscribe(res=>{
      // console.log(res);
      this.laps= res;
      console.log(this.laps);

    })
  }

  private getNotify(){
    this._HttpService.GetNotificaions().subscribe(res=>{
      // console.log(res);
      this.notify = res
    })
  }
}
