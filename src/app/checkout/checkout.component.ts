import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faChevronRight, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  faChevronRight = faChevronRight;
  faCreditCard = faCreditCard;
  cartItems: any[] = [];
  justDeletedProductName = "";
  justDeletedProductLink: number | null = null;
  loaderOptions = ["banknote_loading.svg", "money_loading.svg"]
  loader = "";
  loading = true;
  constructor(private router: Router, private http:HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.loader = this.loaderOptions[getRandomInt(this.loaderOptions.length)];
    this.loading = true;
    this.http.get('/api/carts').subscribe((res:any) => {
      this.cartItems = res;
      if (this.cartItems.length == 0) {
        this.router.navigate(['/cart']);
      }
      this.userService.setCartSize(this.cartItems.length);
      this.userService.setCartTotal(this.cartItems.map(ci => ci.price).reduce((prev, next) => prev + next, 0));
      setTimeout( () => {
        this.loading = false;
      }, 2000);
    });
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
