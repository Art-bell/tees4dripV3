import { Component, OnInit } from '@angular/core';
import { faChevronRight, faCreditCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  faChevronRight = faChevronRight;
  faCreditCard = faCreditCard;

  constructor() { }

  ngOnInit(): void {
  }

}
