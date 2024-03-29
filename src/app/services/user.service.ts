// This is a service that will consist of unauthenticated user info
// For now, that will just be the user token and the users cart.
import { Injectable } from "@angular/core";
import { sha512 } from "js-sha512";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class UserService {
    userToken: string = "";
    cartId: number = -1;
    cartTotalSubject = new Subject<number>();
    cartTotal = 0;
    cartSizeSubject = new Subject<number>();
    cartSize = 0;
    orderNumberSubject = new Subject<string>();
    orderNumber = "";

    constructor() {
        // When we start out, read the local storage token info.
        let retrievedToken = localStorage.getItem('tees4dripUserToken');
        if (!retrievedToken) {
            localStorage.setItem('tees4dripUserToken', sha512(this.makeid(10)));
            retrievedToken = localStorage.getItem('tees4dripUserToken');
        }

        console.log(retrievedToken);
        this.userToken = retrievedToken!;
        this.cartTotalSubject.subscribe((newTotal) => {
            this.cartTotal = newTotal;
        });
        this.cartSizeSubject.subscribe((newSize) => {
            this.cartSize = newSize;
        });
        this.orderNumberSubject.subscribe((newNumber) => {
            this.orderNumber = newNumber;
        });
        console.log("reconstructing user service");
    }

    getUserToken() {
        return this.userToken;
    }

    setUserToken(userToken:string) {
        console.log(userToken);
        this.userToken = userToken;
    }

    getCartId () {
        return this.cartId;
    }

    setCartId (cartId:number) {
        this.cartId = cartId;
    }

    setCartSize(cartSize: number) {
        this.cartSizeSubject.next(cartSize);
    }

    getCartSize() {
        return this.cartSize;
    }

    setCartTotal(cartTotal: number) {
        this.cartTotalSubject.next(cartTotal);
    }

    getCartTotal() {
        return this.cartTotal;
    }

    setOrderNumber(orderNumber: string) {
        this.orderNumberSubject.next(orderNumber);
    }

    getOrderNumer() {
        return this.orderNumber;
    }

    makeid(length: number) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
      charactersLength));
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
    id:number;
    name:string;
    price:number;
    quantity:number;
}