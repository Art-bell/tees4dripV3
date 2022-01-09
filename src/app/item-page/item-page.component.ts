import { AfterViewInit, Component, OnInit, ViewChild, HostListener, ElementRef  } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgZoom } from 'ng-zoom';

import { faChevronRight, faPlus, faMinus, faCartPlus, } from '@fortawesome/free-solid-svg-icons';
import { faTwitterSquare, faInstagramSquare, faCcDiscover, faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons'

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
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

}
