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
  cartSubTotal = 0;
  estimatedShipping = 15;
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
  ) {
    this.userService.getCartTotalSubject().subscribe((total) => {
      this.cartSubTotal = total;
    });
    this.userService.getCartItemsSubject().subscribe((items) => {
      this.cartItems = items;
      if (this.cartItems.length == 0) {
        this.router.navigate(['/cart']);
      }
      this.productIdsToCheckout = this.cartItems.map((ci) => ci.id);
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    });
  }

  ngOnInit(): void {
    this.loader = this.loaderOptions[getRandomInt(this.loaderOptions.length)];
    this.loading = true;
    this.userService.fetchCartData();
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
      customerStreetAddress1:
        this.orderForm.controls['customerShippingStreetAddress1'].value,
      customerStreetAddress2:
        this.orderForm.controls['customerShippingStreetAddress2'].value,
      customerCity: this.orderForm.controls['customerShippingCity'].value,
      customerState: this.orderForm.controls['customerShippingState'].value,
      customerZipCode: this.orderForm.controls['customerShippingZipCode'].value,
      customerCountry: this.orderForm.controls['customerShippingCountry'].value,
      products: this.cartItems,
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

    // let handler = PaystackPop.setup({
    //   key: 'pk_live_70a3301f21dfbb1e275e3970eded23debf12071d', // Replace with your public key
    //   email: this.orderForm.controls['customerEmail'].value,
    //   amount: this.cartTotal * 100, // This is in kobo
    //   ref: orderNumber,
    //   onClose: function () {},
    //   callback: (response: any) => {
    //     this.http
    //       .post('/api/mailGunAdmin', {
    //         orderNumber: orderNumber,
    //         number: this.orderForm.controls['customerPhoneNumber'].value,
    //         total: this.cartTotal,
    //         address: fullAddress,
    //         name: this.orderForm.controls['customerFullName'].value,
    //         email: this.orderForm.controls['customerEmail'].value,
    //         productIds: this.productIdsToCheckout,
    //       })
    //       .subscribe((data: any) => {});
    //     this.http
    //       .post('/api/orders/createNewOrder', { order: order })
    //       .subscribe((data: any) => {
    //         if (data?.error) {
    //           this.errorMessage = data?.message;
    //           this.showError = true;
    //           console.log('Error, not opening Iframe');
    //         } else {
    //           localStorage.setItem('orderNumber', orderNumber);
    //           window.location.replace('/order-complete');
    //         }
    //       });
    //   },
    // });
    // handler.openIframe();

    // return;

    // Call paystack
  }

  setShipping() {
    if (!this.orderForm.controls['customerShippingCountry'].value) {
      return;
    }
    this.estimatedShipping = 15; //base;

    if (!this.orderForm.controls['customerShippingState'].value) {
      return;
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

  public get cartTotal() {
    return (
      this.cartSubTotal + (this.cartSubTotal > 0 ? this.estimatedShipping : 0)
    );
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
