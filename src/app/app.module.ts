import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services/services.component';
import { AfterGetEstimateComponent } from './after-get-estimate/after-get-estimate.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryPartnerComponent } from './delivery-partner/delivery-partner.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'services',component:ServicesComponent},
  {path:'after-get-estimate',component:AfterGetEstimateComponent},
  {path:'deliver-partner',component:DeliveryPartnerComponent}
];

import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { FirestoreService } from '../app/service/firestore.service';
import { ApiService } from '../app/service/api.service';

@NgModule({
  declarations: [
    HomeComponent,
    ServicesComponent,
    AppComponent,
    AfterGetEstimateComponent,
    DeliveryPartnerComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    NgbModule,
    MatCardModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFirestoreModule
  ],
  providers: [FirestoreService, ApiService],
  bootstrap:[AppComponent]
})
export class AppModule { }

