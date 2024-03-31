// This is a service that will consist of unauthenticated user info
// For now, that will just be the user token and the users cart.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sha512 } from 'js-sha512';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  userToken: string = '';
  cartId: number = -1;
  cartTotalSubject = new BehaviorSubject(0);
  orderNumberSubject = new Subject<string>();
  orderNumber = '';
  cartItemsSubject = new BehaviorSubject([]);
  loadingSubject = new BehaviorSubject(false);

  constructor(private readonly http: HttpClient) {
    // When we start out, read the local storage token info.
    let retrievedToken = localStorage.getItem('tees4dripUserToken');
    if (!retrievedToken) {
      localStorage.setItem('tees4dripUserToken', sha512(this.makeid(10)));
      retrievedToken = localStorage.getItem('tees4dripUserToken');
    }

    this.userToken = retrievedToken!;
    this.orderNumberSubject.subscribe((newNumber) => {
      this.orderNumber = newNumber;
    });

    this.fetchCartData();
  }

  fetchCartData() {
    this.loadingSubject.next(true);
    this.http
      .get('/api/carts', {
        params: {
          userToken: this.getUserToken(),
          someExtra: '500',
        },
      })
      .subscribe((res: any) => {
        this.cartItemsSubject.next(res);
        this.cartTotalSubject.next(
          this.cartItemsSubject.value
            .map((ci: any) => ci.price * ci.quantity)
            .reduce((prev, next) => prev + next, 0)
        );
        this.loadingSubject.next(false);
      });
  }

  getUserToken() {
    return this.userToken;
  }

  setUserToken(userToken: string) {
    this.userToken = userToken;
  }

  getLoadingSubject() {
    return this.loadingSubject;
  }

  getCartItemsSubject() {
    return this.cartItemsSubject;
  }

  getCartId() {
    return this.cartId;
  }

  setCartId(cartId: number) {
    this.cartId = cartId;
  }

  getCartTotalSubject() {
    return this.cartTotalSubject;
  }

  setOrderNumber(orderNumber: string) {
    this.orderNumberSubject.next(orderNumber);
  }

  getOrderNumer() {
    return this.orderNumber;
  }

  makeid(length: number) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // getCart() {
  //     return Object.values(this.cart).slice();
  // }

  // addToCart(product: Product) {
  //     // Check if already exists,
  //     // If not, then push
  //     // If yes, then index and update quantity.
  //     if (product.id in Object.keys(this.cart)) {
  //         this.cart[product.id].quantity += product.quantity;
  //     } else {
  //         this.cart[product.id] = product;
  //     }
  // }
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
