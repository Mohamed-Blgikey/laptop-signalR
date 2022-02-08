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

  editMood:boolean = false;
  imgPrefix:string = environment.photoUrl;
  laps :any [] =[];
  notify :any [] =[];
  postarName : string = '';
  oldPostarName : string = '';
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
      this.getLaptops();
      this.getNotify();
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
      this.postarName = '';
      this.lapForm.reset();
    })
  }

  deleteLap(lap:number,poster:string){
    // console.log(lap);
    // console.log(poster);
    if (confirm("Delete Laptop !!")) {
      this._HttpService.UnSavePhoto({name:poster}).subscribe(res=>{
        // console.log(res);

      })
      this._HttpService.DeleteLaptop(lap).subscribe(res=>{
        // console.log(res);

      })
    }
  }


  openEditMood(lap:any){
    this.lapForm.controls['id'].setValue(lap.id)
    this.lapForm.controls['name'].setValue(lap.name)
    this.lapForm.controls['ram'].setValue(lap.ram)
    this.lapForm.controls['storage'].setValue(lap.storage)
    // this.lapForm.controls['storage'].setValue(lap.poster)
    // console.log(lap);
    this.oldPostarName = lap.poster;
    this.editMood = true;

  }
  Edit(lapForm:FormGroup){
    let data = {
      id : lapForm.controls['id'].value,
      name : lapForm.controls['name'].value,
      ram : lapForm.controls['ram'].value,
      storage : lapForm.controls['storage'].value,
      poster : this.oldPostarName
    }
    if(this.postarName != ''){
      data.poster = this.postarName;
      this._HttpService.UnSavePhoto({name:this.oldPostarName}).subscribe(()=>{
        this.oldPostarName = '';
      })
    }

    this._HttpService.EditLaptop(data).subscribe(res=>{
      // console.log(res);

    })
    lapForm.reset();
    this.editMood = false;

  }


  private getLaptops(){
    this._HttpService.GetLaptops().subscribe(res=>{
      // console.log(res);
      this.laps= res;
      this.laps = this.laps.reverse();
      // console.log(this.laps);

    })
  }

  private getNotify(){
    this._HttpService.GetNotificaions().subscribe(res=>{
      // console.log(res);
      this.notify = res
      this.notify = this.notify.reverse();
    })
  }
}

