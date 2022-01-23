import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation, HostListener, ElementRef  } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgZoom } from 'ng-zoom';
import SwiperCore, { Pagination, Navigation } from "swiper";

import { faChevronRight, faPlus, faMinus, faCartPlus, } from '@fortawesome/free-solid-svg-icons';
import { faTwitterSquare, faInstagramSquare, faCcDiscover, faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons'
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
  
  @ViewChild('relativeHeader', {static: true}) relativeHeader?: HeaderComponent;
  @ViewChild('fixedHeader', {static: true}) fixedHeader?: HeaderComponent;
  @ViewChild('imageRef', {static: true}) imageRef!: ElementRef<HTMLImageElement>;

  constructor(private elementRef: ElementRef, private ngz: NgZoom) {

  }

  @HostListener('window:scroll', ['$event']) onScroll(e: Event): void {
    if (window.scrollY >= 275) {
      this.fixedHeader!.slideFixedHeaderDown();
    } else {
      this.fixedHeader!.slideFixedHeaderUp();
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.ngz.listen(this.imageRef);
  }

  clickedProductImage(event: Event) {
    this.elementRef.nativeElement.querySelector('.active-product-image').classList.remove('active-product-image');
    (<Element> event.target).parentElement!.classList.add('active-product-image');
    (<Element> this.imageRef.nativeElement).setAttribute("src", (<Element> event.target)!.getAttribute("src")!);
  }

}
