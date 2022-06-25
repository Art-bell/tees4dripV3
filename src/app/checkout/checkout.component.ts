import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faChevronRight, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user.service';
import { sha512 } from "js-sha512";

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
  productIdsToCheckout: any[] = [];
  orderForm = new FormGroup({
    customerFullName: new FormControl(''),
    customerEmail: new FormControl(''),
    customerPhoneNumber: new FormControl(''),
    customerShippingStreetAddress1: new FormControl(''),
    customerShippingStreetAddress2: new FormControl(''),
    customerShippingCity: new FormControl(''),
    customerShippingState: new FormControl(''),
    customerShippingZipCode: new FormControl(''),
    customerShippingCountry: new FormControl(''),
    customerStreetAddress1: new FormControl(''),
    customerStreetAddress2: new FormControl(''),
    creditCardFullName: new FormControl(''),
    creditCardNumber: new FormControl(''),
    creditCardMonth: new FormControl(''),
    creditCardYear: new FormControl(''),
    creditCardCvv: new FormControl(''),
  });

  constructor(private router: Router, private http:HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.loader = this.loaderOptions[getRandomInt(this.loaderOptions.length)];
    this.loading = true;
    this.http.get('/api/carts', {params: {userToken: this.userService.getUserToken(), someExtra: "500"}}).subscribe((res:any) => {
      this.cartItems = res;
      if (this.cartItems.length == 0) {
        this.router.navigate(['/cart']);
      }
      this.productIdsToCheckout = this.cartItems.map(ci => ci.id);
      this.userService.setCartSize(this.cartItems.length);
      this.userService.setCartTotal(this.cartItems.map(ci => ci.price).reduce((prev, next) => prev + next, 0));
      setTimeout( () => {
        this.loading = false;
      }, 2000);
    });
  }

  createOrder() {
    // Perform validation
    const order = {
      userToken: this.userService.getUserToken(),
      orderNumber: `${makeid(10)}${sha512(makeid(10)).substring(0, 5)}`,
      customerFullName: this.orderForm.controls['customerFullName'].value,
      customerEmail: this.orderForm.controls['customerEmail'].value,
      customerPhoneNumber: this.orderForm.controls['customerPhoneNumber'].value,
      customerShippingStreetAddress1: this.orderForm.controls['customerShippingStreetAddress1'].value,
      customerShippingStreetAddress2: this.orderForm.controls['customerShippingStreetAddress2'].value,
      customerShippingCity: this.orderForm.controls['customerShippingCity'].value,
      customerShippingState: this.orderForm.controls['customerShippingState'].value,
      customerShippingZipCode: this.orderForm.controls['customerShippingZipCode'].value,
      customerShippingCountry: this.orderForm.controls['customerShippingCountry'].value,
      creditCardFullName: this.orderForm.controls['creditCardFullName'].value,
      creditCardNumber: this.orderForm.controls['creditCardNumber'].value,
      creditCardMonth: this.orderForm.controls['creditCardMonth'].value,
      creditCardYear: this.orderForm.controls['creditCardYear'].value,
      creditCardCvv: this.orderForm.controls['creditCardCvv'].value,
      products: this.productIdsToCheckout
    }

    this.http.post("/api/orders/createNewOrder", {order: order}).subscribe((data) => {
      console.log(data);
    });
    return;
  }
} 

function makeid(length: number) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
