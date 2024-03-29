import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import {
  faChevronRight,
  faCreditCard,
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user.service';
import { sha512 } from 'js-sha512';
declare let PaystackPop: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  faChevronRight = faChevronRight;
  faCreditCard = faCreditCard;
  cartItems: any[] = [];
  justDeletedProductName = '';
  justDeletedProductLink: number | null = null;
  loaderOptions = ['banknote_loading.svg', 'money_loading.svg'];
  loader = '';
  loading = true;
  ahowSelfOwnedCardDetails = false;
  productIdsToCheckout: any[] = [];
  showError = false;
  errorMessage = '';
  underMaintenance = false;
  estimatedShipping = 2500;
  orderForm = new FormGroup({
    customerFullName: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    customerEmail: new FormControl('', [Validators.required, Validators.email]),
    customerPhoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
    ]),
    customerShippingStreetAddress1: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    customerShippingStreetAddress2: new FormControl(''),
    customerShippingCity: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    customerShippingState: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    customerShippingZipCode: new FormControl(''),
    customerShippingCountry: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loader = this.loaderOptions[getRandomInt(this.loaderOptions.length)];
    this.loading = true;
    this.http
      .get('/api/carts', {
        params: {
          userToken: this.userService.getUserToken(),
          someExtra: '500',
        },
      })
      .subscribe((res: any) => {
        this.cartItems = res;
        if (this.cartItems.length == 0) {
          this.router.navigate(['/cart']);
        }
        this.productIdsToCheckout = this.cartItems.map((ci) => ci.id);
        this.userService.setCartSize(this.cartItems.length);
        this.userService.setCartTotal(
          this.cartItems
            .map((ci) => ci.price)
            .reduce((prev, next) => prev + next, 0)
        );
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      });
  }

  createOrder() {
    // Verify that the fields have been filled out
    this.checkForInputErrors();
    if (this.showError) {
      return;
    }

    // Modify shipping details again
    this.setShipping();

    // Create the order with Unpaid, and no paymentRef
    const orderNumber = `${makeid(10)}${sha512(makeid(10)).substring(0, 5)}`;
    const order = {
      userToken: this.userService.getUserToken(),
      orderNumber: orderNumber,
      customerFullName: this.orderForm.controls['customerFullName'].value,
      customerEmail: this.orderForm.controls['customerEmail'].value,
      customerPhoneNumber: this.orderForm.controls['customerPhoneNumber'].value,
      customerShippingStreetAddress1:
        this.orderForm.controls['customerShippingStreetAddress1'].value,
      customerShippingStreetAddress2:
        this.orderForm.controls['customerShippingStreetAddress2'].value,
      customerShippingCity:
        this.orderForm.controls['customerShippingCity'].value,
      customerShippingState:
        this.orderForm.controls['customerShippingState'].value,
      customerShippingZipCode:
        this.orderForm.controls['customerShippingZipCode'].value,
      customerShippingCountry:
        this.orderForm.controls['customerShippingCountry'].value,
      products: this.productIdsToCheckout,
      orderTotal: this.cartTotal,
    };
    this.showError = false;
    let fullAddress =
      this.orderForm.controls['customerShippingStreetAddress1'].value;
    if (this.orderForm.controls['customerShippingStreetAddress2'].value) {
      fullAddress += `, ${this.orderForm.controls['customerShippingStreetAddress2'].value}`;
    }
    fullAddress += `, ${this.orderForm.controls['customerShippingCity'].value}`;
    fullAddress += `, ${this.orderForm.controls['customerShippingState'].value}`;
    fullAddress += `, ${this.orderForm.controls['customerShippingCountry'].value}`;

    if (this.orderForm.controls['customerShippingZipCode'].value) {
      fullAddress += `, ${this.orderForm.controls['customerShippingZipCode'].value}`;
    }

    let handler = PaystackPop.setup({
      key: 'pk_live_70a3301f21dfbb1e275e3970eded23debf12071d', // Replace with your public key
      email: this.orderForm.controls['customerEmail'].value,
      amount: this.cartTotal * 100, // This is in kobo
      ref: orderNumber,
      onClose: function () {},
      callback: (response: any) => {
        this.http
          .post('/api/mailGunAdmin', {
            orderNumber: orderNumber,
            number: this.orderForm.controls['customerPhoneNumber'].value,
            total: this.cartTotal,
            address: fullAddress,
            name: this.orderForm.controls['customerFullName'].value,
            email: this.orderForm.controls['customerEmail'].value,
            productIds: this.productIdsToCheckout,
          })
          .subscribe((data: any) => {});
        // FOR NOW, THIS WILL JUST DECREMENT THE PRODUCT COUNT!
        // SIKE
        this.http
          .post('/api/orders/createNewOrder', { order: order })
          .subscribe((data: any) => {
            if (data?.error) {
              this.errorMessage = data?.message;
              this.showError = true;
              console.log('Error, not opening Iframe');
            } else {
              localStorage.setItem('orderNumber', orderNumber);
              window.location.replace('/order-complete');
            }
          });
      },
    });
    handler.openIframe();

    // return;

    // Call paystack
  }

  setShipping() {
    if (!this.orderForm.controls['customerShippingCountry'].value) {
      return;
    }
    const cleanedCountryInput = this.orderForm.controls[
      'customerShippingCountry'
    ].value
      .trim()
      .toLowerCase();
    if (cleanedCountryInput !== 'ng' && cleanedCountryInput !== 'nigeria') {
      this.estimatedShipping = 30000;
      return;
    } else {
      this.estimatedShipping = 2500; //base;
    }

    if (!this.orderForm.controls['customerShippingState'].value) {
      return;
    }
    const cleanedStateInput = this.orderForm.controls[
      'customerShippingState'
    ].value
      .trim()
      .toLowerCase();

    if (
      cleanedStateInput !== 'lg' &&
      cleanedStateInput !== 'lagos' &&
      cleanedStateInput !== 'lag'
    ) {
      this.estimatedShipping = 4000;
      return;
    } else {
      this.estimatedShipping = 2500; //base;
    }
  }

  checkForInputErrors() {
    this.showError = false;
    this.errorMessage = '';

    if (this.orderForm.get('customerFullName')!.errors?.['required']) {
      this.showError = true;
      this.errorMessage = 'A valid full name is required';

      return;
    }

    if (
      this.orderForm.get('customerEmail')!.errors?.['required'] ||
      this.orderForm.get('customerEmail')!.errors?.['email']
    ) {
      this.showError = true;
      this.errorMessage = 'A valid email is required';

      return;
    }

    if (
      this.orderForm.get('customerPhoneNumber')!.errors?.['required'] ||
      this.orderForm.get('customerPhoneNumber')!.errors?.['minlength']
    ) {
      this.showError = true;
      this.errorMessage = 'A valid phone number is required';

      return;
    }

    if (
      this.orderForm.get('customerShippingStreetAddress1')!.errors?.[
        'required'
      ] ||
      this.orderForm.get('customerShippingStreetAddress1')!.errors?.[
        'minlength'
      ]
    ) {
      this.showError = true;
      this.errorMessage = 'A valid street address is required';

      return;
    }

    if (
      this.orderForm.get('customerShippingCity')!.errors?.['required'] ||
      this.orderForm.get('customerShippingCity')!.errors?.['minlength']
    ) {
      this.showError = true;
      this.errorMessage = 'A valid city is required';

      return;
    }

    if (
      this.orderForm.get('customerShippingState')!.errors?.['required'] ||
      this.orderForm.get('customerShippingState')!.errors?.['minLength']
    ) {
      this.showError = true;
      this.errorMessage = 'A valid state is required';

      return;
    }

    if (
      this.orderForm.get('customerShippingCountry')!.errors?.['required'] ||
      this.orderForm.get('customerShippingCountry')!.errors?.['minLength']
    ) {
      this.showError = true;
      this.errorMessage = 'A valid country is required';

      return;
    }
  }

  get cartTotal() {
    return this.userService.getCartTotal() + this.estimatedShipping;
  }

  get cartSubTotal() {
    return this.userService.getCartTotal();
  }
}

function makeid(length: number) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
