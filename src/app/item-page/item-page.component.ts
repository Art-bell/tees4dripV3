import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation, HostListener, ElementRef  } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgZoom } from 'ng-zoom';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import SwiperCore, { Pagination, Navigation } from "swiper";

import { faChevronRight, faPlus, faMinus, faCartPlus, } from '@fortawesome/free-solid-svg-icons';
import { faTwitterSquare, faInstagramSquare, faCcDiscover, faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons'
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '../services/user.service';
SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ItemPageComponent implements OnInit {
  faChevronRight = faChevronRight;
  faPlus = faPlus;
  faMinus = faMinus;
  faCartPlus = faCartPlus;
  faTwitter = faTwitterSquare;
  faInstagram = faInstagramSquare;
  faMasterCard = faCcMastercard;
  faDiscover = faCcDiscover;
  faVisa = faCcVisa;
  currentProduct:any = {name: ''};
  productSuggestions: any = [];

  @ViewChild('relativeHeader', {static: true}) relativeHeader?: HeaderComponent;
  @ViewChild('fixedHeader', {static: true}) fixedHeader?: HeaderComponent;
  @ViewChild('imageRef', {static: true}) imageRef!: ElementRef<HTMLImageElement>;

  constructor(private router: Router, private route: ActivatedRoute, private elementRef: ElementRef, private ngz: NgZoom, private http: HttpClient, private userService: UserService) {

  }

  @HostListener('window:scroll', ['$event']) onScroll(e: Event): void {
    if (window.scrollY >= 275) {
      this.fixedHeader!.slideFixedHeaderDown();
    } else {
      this.fixedHeader!.slideFixedHeaderUp();
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const productId = params.get('productId') ?? '';
      let queryHeaders = new HttpHeaders().set("content-type", "application/json").set('Access-Control-Allow-Origin', '*');
  
      let queryParams = new HttpParams();
      queryParams = queryParams.append("pk", productId);
      this.http.get('/api/products/findByPk', {headers:queryHeaders, params: queryParams}).subscribe((res) => {this.currentProduct = res}, (err) => {console.error(err)});
      // Get suggestions.
      this.http.get('/api/products/productResults', {params: {limit: 8, idException: productId}}).subscribe((res:any) => {
        this.productSuggestions = res['results'];
      });
    })
    
  }

  ngAfterViewInit() {
    this.ngz.listen(this.imageRef);
  }

  clickedProductImage(event: Event) {
    this.elementRef.nativeElement.querySelector('.active-product-image').classList.remove('active-product-image');
    (<Element> event.target).parentElement!.classList.add('active-product-image');
    (<Element> this.imageRef.nativeElement).setAttribute("src", (<Element> event.target)!.getAttribute("src")!);
  }

  getDefaultImage() {
    if (this.currentProduct.productImages) {
      return this.currentProduct.productImages[0].url
    }
    return '';
  }

  addToCart(e: Event, productId:number, ngnPrice: number) {
    e.stopPropagation();
    console.log(this.userService.getCartId());
    console.log(productId);
    this.http.post('/api/addToCart', {cartId: 1, productId}).subscribe((res:any) => {
      if (Object.keys(res).includes("createdAt")) {
        this.userService.setCartSize(this.userService.getCartSize() + 1);
        this.userService.setCartTotal(this.userService.getCartTotal() + ngnPrice);
        this.router.navigate(['/cart']);
      }
    })
    // Send request to add to cart.
    // When response is recevied, navigate to the cart page.

  }

}
