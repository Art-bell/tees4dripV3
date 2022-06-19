import { ElementRef, Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HeaderMobileComponent } from '../header-mobile/header-mobile.component';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent{
  @ViewChild('relativeHeader', {static: true}) relativeHeader?: HeaderComponent;
  @ViewChild('relativeHeaderMobile', {static: true}) relativeHeaderMobile?: HeaderMobileComponent;
  @ViewChild('fixedHeader', {static: true}) fixedHeader?: HeaderComponent;
  @ViewChild('fixedHeaderMobile', {static: true}) fixedHeaderMobile?: HeaderMobileComponent;
  faCartPlus = faCartPlus;
  newestItems: ProductData[] = [];

  constructor(private router: Router, private elementRef: ElementRef, private http: HttpClient, private userService: UserService) {

  }

  ngOnInit() {
    if (!this.userService.getUserToken()) {
      // Make request for all data
      this.http.get('/api/userDataRetrieval/').subscribe((res:any) => {
        // TODO: Verify that this is right.
        console.log("resultsss", res);
        this.userService.setUserToken(res.token);
        this.userService.setCartId(res.cart.id);
      }, (err) => {console.error(err)});
    } else {
      console.log("already set")
      console.log(this.userService.getUserToken());
      console.log(this.userService.getCartId());
    }
    this.http.get('/api/products/getNewArrivals').subscribe((res:any) => {
      this.newestItems = res.rows;
    }, (err) => {console.error(err)});

  }

  @HostListener('window:scroll', ['$event']) onScroll(e: Event): void {
    if (window.scrollY >= 275) {
      this.fixedHeader!.slideFixedHeaderDown();
    } else {
      this.fixedHeader!.slideFixedHeaderUp();
    }

    if (window.scrollY >= 175) {
      this.fixedHeaderMobile!.slideFixedHeaderDown();
    } else {
      this.fixedHeaderMobile!.slideFixedHeaderUp();
    }
  }
  
  title = 'tees4drip';

  images = [1, 2, 3, 4].map((n) => `../assets/images/home_images/slide${n}.png`);

  // Make request for newest clothing pieces at: 

  addToCart(e: Event, productId:number, ngnPrice: number) {
    e.stopPropagation();
    console.log(this.userService.getCartId());
    console.log(productId);
    this.http.post('/api/addToCart', {cartId: this.userService.getCartId(), productId}).subscribe((res:any) => {
      if (Object.keys(res).includes("createdAt")) {
        this.userService.setCartSize(this.userService.getCartSize() + 1);
        this.userService.setCartTotal(this.userService.getCartTotal() + ngnPrice);
        this.router.navigate(['/cart']);
      }
    })
    // Send request to add to cart.
    // When response is recevied, navigate to the cart page.

  }

  navigateToProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

}

export interface ProductData {
  id: number; 
  productImages: any[]; 
  name: string; 
  usd:number; 
  ngn:number;
  createdAt: string;
}