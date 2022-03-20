import { Component, OnInit } from '@angular/core';
import { faChevronRight, faCreditCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.css']
})
export class OrderCompleteComponent implements OnInit {
  faChevronRight = faChevronRight;
  faCreditCard = faCreditCard;
  
  constructor() { }

  ngOnInit(): void {
  }

}
