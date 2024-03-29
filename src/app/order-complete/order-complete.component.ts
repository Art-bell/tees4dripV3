import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faChevronRight, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.css']
})
export class OrderCompleteComponent implements OnInit {
  faChevronRight = faChevronRight;
  faCreditCard = faCreditCard;
  orderNumber = "";
  
  constructor(private readonly router: Router, private readonly userService: UserService) {
    this.orderNumber = localStorage.getItem('orderNumber') ?? "";
    if (this.orderNumber === "") {
      // this.router.navigate(['/cart']);
    }
    localStorage.setItem('orderNumber', "");
  }

  ngOnInit(): void {
  }

}
