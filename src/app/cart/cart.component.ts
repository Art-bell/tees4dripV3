import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation, Component, OnInit } from '@angular/core';
import { faChevronRight, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import SwiperCore, { Pagination, Navigation } from "swiper";
import { UserService } from '../services/user.service';
SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class CartComponent implements OnInit {
  faChevronRight = faChevronRight;
  faCreditCard = faCreditCard;
  cartItems: any[] = [];
  productSuggestions: any[] = [];
  justDeletedProductName = "";
  justDeletedProductLink: number | null = null;
  loaderOptions = ["banknote_loading.svg", "money_loading.svg"];
  loader = "";
  loading = true;
  constructor(private http:HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.loader = this.loaderOptions[getRandomInt(this.loaderOptions.length)];
    this.loading = true;

    // Get cart items.
    this.http.get('/api/carts').subscribe((res:any) => {
      this.cartItems = res;
      this.userService.setCartSize(this.cartItems.length);
      this.userService.setCartTotal(this.cartItems.map(ci => ci.price).reduce((prev, next) => prev + next, 0));
      setTimeout( () => {
        this.loading = false;
      }, 2000);
    });

    // Get suggestions.
    this.http.get('/api/products/productResults', {params: {limit: 8}}).subscribe((res:any) => {
      this.productSuggestions = res['results'];
      console.log(this.productSuggestions);
    });
  }

  removeItem(index: number, productId: number, name: string) {
    this.justDeletedProductLink = productId;
    this.justDeletedProductName = name;
    this.http.post('/api/removeFromCart', {cartId: 1, productId}).subscribe((res:any) => {
      this.cartItems = this.cartItems.filter((value, i) => i != index);
      this.userService.setCartSize(this.cartItems.length);
      this.userService.setCartTotal(this.cartItems.map(ci => ci.price).reduce((prev, next) => prev + next, 0));
    })
    // this.http.post('/api/addToCart', {cartId: this.userService.getCartId(), productId}).subscribe((res:any) => {
    //   if (Object.keys(res).includes("createdAt")) {
    //     this.router.navigate(['/cart']);
    //   }
    // })
  }

  public get cartSubTotal() {
    return this.userService.getCartTotal();
}
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
