// This is a service that will consist of unauthenticated user info
// For now, that will just be the user token and the users cart.
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class UserService {
    userToken: string = "";
    cartId: number = -1;
    cartTotalSubject = new Subject<number>();
    cartTotal = 0;
    cartSizeSubject = new Subject<number>();
    cartSize = 0;

    constructor() {
        this.cartTotalSubject.subscribe((newTotal) => {
            this.cartTotal = newTotal;
        });
        this.cartSizeSubject.subscribe((newSize) => {
            this.cartSize = newSize;
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