import { Component } from '@angular/core';
import { Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CarrioWeb';

  constructor(private router:Router){
router.events.subscribe((event) => {
  console.log(event);
})
}

goToPage(pageName:string):void{
this.router.navigate([`${pageName}`]);
}
}