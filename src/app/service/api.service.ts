import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private firestore: FirestoreService) { }

  public getData(): Observable<any>{
    return this.firestore.getDT('ScheduleVehicles', ref => ref
      .where('id', 'in', ['tata_ace', 'tata_ace_closed']));
  }

  public getJHLPR(): Observable<any>{
    return this.firestore.getDT1('vehicleType', 'helper_fare');
  }
  
  

}
