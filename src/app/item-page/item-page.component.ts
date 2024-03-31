import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  HostListener,
  ElementRef,
} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgZoom } from 'ng-zoom';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import SwiperCore, { Pagination, Navigation } from 'swiper';

import {
  faChevronRight,
  faPlus,
  faMinus,
  faCartPlus,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import {
  faTwitterSquare,
  faInstagramSquare,
  faCcDiscover,
  faCcVisa,
  faCcMastercard,
} from '@fortawesome/free-brands-svg-icons';
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
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faPlus = faPlus;
  faMinus = faMinus;
  faCartPlus = faCartPlus;
  faTwitter = faTwitterSquare;
  faInstagram = faInstagramSquare;
  faMasterCard = faCcMastercard;
  faDiscover = faCcDiscover;
  faVisa = faCcVisa;
  currentProduct: any = { name: '' };
  productSuggestions: any = [];
  groupSize = 5;
  showError = false;
  errorMessage = '';
  selectedQuantity = 1;

  @ViewChild('relativeHeader', { static: true })
  relativeHeader?: HeaderComponent;
  @ViewChild('fixedHeader', { static: true }) fixedHeader?: HeaderComponent;
  @ViewChild('imageRef', { static: true })
  imageRef!: ElementRef<HTMLImageElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private ngz: NgZoom,
    private http: HttpClient,
    private userService: UserService
  ) {}

  @HostListener('window:scroll', ['$event']) onScroll(e: Event): void {
    if (window.scrollY >= 275) {
      this.fixedHeader!.slideFixedHeaderDown();
    } else {
      this.fixedHeader!.slideFixedHeaderUp();
    }
  }

  ngOnInit(): void {
    let check = false;
    this.showError = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor);
    if (check) {
      this.groupSize = 1;
    }

    this.route.paramMap.subscribe((params: ParamMap) => {
      const productId = params.get('productId') ?? '';
      let queryHeaders = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', '*');

      let queryParams = new HttpParams();
      queryParams = queryParams.append('pk', productId);
      this.http
        .get('/api/products/findByPk', {
          headers: queryHeaders,
          params: queryParams,
        })
        .subscribe(
          (res) => {
            this.currentProduct = res;
          },
          (err) => {
            console.error(err);
          }
        );
      // Get suggestions.
      this.http
        .get('/api/products/productResults', {
          params: { limit: 8, idException: productId },
        })
        .subscribe((res: any) => {
          this.productSuggestions = res['results'];
        });
    });
  }

  ngAfterViewInit() {
    this.ngz.listen(this.imageRef);
  }

  clickedProductImage(event: Event) {
    if (
      !(<Element>event.target).parentElement!.classList.contains('alt-image')
    ) {
      return;
    }
    this.elementRef.nativeElement
      .querySelector('.active-product-image')
      .classList.remove('active-product-image');
    (<Element>event.target).parentElement!.classList.add(
      'active-product-image'
    );
    (<Element>this.imageRef.nativeElement).setAttribute(
      'src',
      (<Element>event.target)!.getAttribute('src')!
    );
  }

  getDefaultImage() {
    if (this.currentProduct.productImages) {
      return this.currentProduct.productImages[0].url;
    }
    return '';
  }

  incrementQuantity() {
    const newQuantity = this.selectedQuantity + 1;
    this.selectedQuantity =
      newQuantity > this.currentProduct.quantityAvailable
        ? this.currentProduct.quantityAvailable
        : newQuantity;
  }

  decrementQuantity() {
    const newQuantity = this.selectedQuantity - 1;
    this.selectedQuantity = newQuantity <= 0 ? 1 : newQuantity;
  }

  addToCart(e: Event, productId: number) {
    e.stopPropagation();
    this.showError = false;
    this.http
      .post('/api/addToCart', {
        userToken: this.userService.getUserToken(),
        productId,
        quantity: this.selectedQuantity,
      })
      .subscribe((res: any) => {
        if (res?.message === 'Success') {
          this.userService.fetchCartData();
          this.router.navigate(['/cart']);
        } else if (res?.message === 'Already exists') {
          this.showError = true;
          this.errorMessage = 'This item is already in your cart';
        }
      });
    // Send request to add to cart.
    // When response is recevied, navigate to the cart page.
  }
}
