import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { Router,Routes} from '@angular/router';
import { OwlOptions} from 'ngx-owl-carousel-o';
import { HttpClient} from '@angular/common/http';
import { DeliveryPartnerComponent } from '../delivery-partner/delivery-partner.component';
import {NgbModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AfterGetEstimateComponent } from '../after-get-estimate/after-get-estimate.component';
import {environment} from 'src/environments/environment';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { ApiService } from '../service/api.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

 private unSubscribe$ = new Subject(); 
closeResult = '';
images= [ "../../assets/truck1.png",
"../../assets/truck2 (1).jpg",
"../../assets/truck3.png",
"../../assets/truck4.png"
]
searchText: any
text: any
autoCompleteItems:any
autoComplete:any
searchdrop:any
 pickup_lat:any
 pickup_lng:any
 drop_lat:any
 drop_lng:any
 public tripFare = {
   fare1: 0,
   fare2: 0,
   fare3: 0,
   fare4: 0
 };

  constructor(private router: Router,
    private zone: NgZone,
    private modalService:NgbModal,
    private api: ApiService
    ) { }
  ngOnInit(): void {
  }
  open(content: any) {
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = 
         `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 300,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  async GetEstimate(){
   const { dist, eta } = await this.getETA();
   console.log('etamin', eta);
   this.api.getData().pipe(takeUntil(this.unSubscribe$)).subscribe(data => {
    console.log(data);
    const vehicles1 =data.find((dat:any) => dat.id === 'tata_ace');
    console.log(vehicles1);
    const vehicles2 = data.find((dat:any) => dat.id === 'tata_ace_closed');
    console.log(vehicles2)
    this.api.getJHLPR().pipe(take(1)).subscribe(rsfare => {
      console.log(rsfare);
      const hlpr = rsfare;
      this.tripFare.fare1 = this.fareCalculator(vehicles1, dist);
      this.tripFare.fare2 = this.fareCalculator(vehicles2, dist);
      this.tripFare.fare3 = this.tripFare.fare1 + this.calculateHLPFr(hlpr, eta);
      this.tripFare.fare4 = this.tripFare.fare2 + this.calculateHLPFr(hlpr, eta);     
      console.log(this.tripFare);
    })
   });
  }

  calculateHLPFr(hlp:any,eta:any){
    let hlpFare = 0;
    if(eta <= 60){
      hlpFare = parseInt(hlp.basefare);
      console.log(hlpFare);
    }else{
      let i = parseInt(eta) + parseInt(hlp.free_wait);
      hlpFare = i * parseInt(hlp.extra_fare);
    }
    return hlpFare;
  }

  async getGooglePlaceAutoCompleteList(searchText:any) {
   
    const windows = ( window as {[google: string]: any })['google'] 
     const service = new windows.maps.places.AutocompleteService();
 
     let pred;
     // var circle = new google.maps.Circle(
     //     {center: geolocation, radius: 10000});
     // autocomplete.setBounds(circle.getBounds());
     await new Promise((resolve, reject) => {
       service.getPlacePredictions({
         input: searchText,
         componentRestrictions: { country: ["LUX"] || environment.COUNTRY }
       }, (predictions:string) => {
         console.log(predictions)
         pred = predictions;
         resolve(true);
       });
     });
     return pred;
   }
 
  async googleSearch(value:any){
   console.log('value',value)
   if(value){
     const predict:any = await this.getGooglePlaceAutoCompleteList(value)
      console.log('searchtext',this.searchText)
        this.autoCompleteItems = [];
       this.zone.run(() =>{
         if(predict !== null){
           predict.forEach((data:any) =>{
             console.log(data)
             this.text = data
             this.autoCompleteItems.push( data.description)
             console.log('autocomplete',this.autoCompleteItems)
           })
         }
       })
   }else{
     this.autoCompleteItems=[]
   }
   }
 
   async googleSearchDrop(value:any){
     console.log('value',value.length)
     console.log('value',value)
   if(value){
     const predict:any = await this.getGooglePlaceAutoCompleteList(value)
       console.log('searchtext',this.searchText)
         this.autoComplete = [];
        this.zone.run(() =>{
          if(predict !== null){
            predict.forEach((data:any) =>{
              console.log(data)
              this.text = data
              this.autoComplete.push( data.description)
              console.log('autocomplete',this.autoComplete)
            })   
          }
        })
       }else{
         this.autoComplete=[]
       }
     }
 
   getLatLan(address: string): Observable<any> {
     console.log('address',address)
     let google =( window as {[google: string]: any })['google']
     const geocoder = new google.maps.Geocoder();
     console.log('geocoder',geocoder)
     return Observable.create((observer:any) => {
       geocoder.geocode({ address }, function (results :any, status: any) {
           console.log('res',results, status);
           if (status === google.maps.GeocoderStatus.OK) {
           observer.next(results[0].geometry.location);
           observer.complete();
         } else {
           console.log('Error - ', results, ' & Status - ', status);
           observer.next({ err: true });
           observer.complete();
         }
       });
     });
   }
 
   getpicAddress(address:any){
     this.searchText=address;
     console.log('address',this.searchText)
     const geocode= this.getLatLan(address).subscribe((geocoder:any) =>{
       console.log('code',geocoder)
       const code= {lat: geocoder.lat(), lang: geocoder.lng()}
       console.log('code',code)
       this.pickup_lat =code.lat
       this.pickup_lng =code.lang
       console.log('pick',this.pickup_lat,this.pickup_lng)
       this.autoCompleteItems = [];
       // this.getETA()
     } )
   }
 
   getdropAddress(address:any){
     this.searchdrop=address
     console.log('address',this.searchdrop)
     const geocode= this.getLatLan(address).subscribe((geocoder:any) =>{
       console.log('code',geocoder)
       const code= {lat: geocoder.lat(), lang: geocoder.lng()}
       console.log('code',code)
       this.drop_lat =code.lat
       this.drop_lng =code.lang
       console.log('pick',this.pickup_lat,this.pickup_lng);
       this.autoComplete = [];
       
     } )
   }
 
   //discalcu
   async getETA(){
     let eta:any, dist:any;
     // console.log(this.rideInfo);
     let google =( window as {[google: string]: any })['google']
     const destination = new google.maps.LatLng(this.pickup_lat, this.pickup_lng);
     const origin = new google.maps.LatLng(this.drop_lat, this.drop_lng);
     const service = new google.maps.DistanceMatrixService();
     const request = {
       origins: [origin],
       destinations: [destination],
       travelMode: google.maps.TravelMode.DRIVING,
       unitSystem: google.maps.UnitSystem.METRIC,
      };
      await new Promise((resolve, rejected) => {
       service.getDistanceMatrix(request, (result:any, status:any) => {
         //console.log(result);
         if(status === "OK"){
           console.log(result);
           dist = Math.round(result.rows[0].elements[0].distance.value / 1000);
           eta = Math.round(result.rows[0].elements[0].duration.value / 60);
           console.log(result.rows[0].elements[0].duration.text);
           resolve(true);
           //console.log('eta',eta);
         }else{
           console.log('Error Occurred');
           resolve(false);
         }
       }); 
      });
      return { dist, eta };
   }
 
   fareCalculator(transport:any, trip_distance:any){
    let vat:any , extras:any, initial_fare:any;
     const base_fare = transport.baseFare;
     const fixed_dist = transport.fixedDistance;
     if((trip_distance > 0) && (parseFloat(trip_distance) <= parseInt(fixed_dist))){
      initial_fare = Math.round(parseInt(base_fare));        
      console.log('1',base_fare, fixed_dist, initial_fare)
     }else if(parseFloat(trip_distance) === 0){
      initial_fare = Math.round(parseInt(base_fare)); 
      console.log('2',base_fare, fixed_dist, initial_fare)
     }else {
      extras = Math.round(((parseFloat(trip_distance) - parseInt(fixed_dist)) * parseInt(transport.farePerKm)))+ parseInt(base_fare);  
      initial_fare =  Math.round(parseInt(extras));
      }
       return initial_fare;
   }

  //   this.api.getSchVehicle('tata_ace').pipe(take(1)).subscribe(data => {
//     this.tripFare.fare2 = this.fareCalculator(data, this.tripDistance);
//  });

//  this.api.getSchVehicle('tata_ace_closed').pipe(take(1)).subscribe(data => {
//    this.tripFare.fare3 = this.fareCalculator(data, this.tripDistance);
//  });

//  this.api.getSchVehicle('two_wheeler').pipe(take(1)).subscribe(data => {
//   this.tripFare.fare1 = this.fareCalculator(data, this.tripDistance);
//  });
}
