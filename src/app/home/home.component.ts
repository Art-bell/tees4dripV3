import { ElementRef, Component, HostListener, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent{
  @ViewChild('relativeHeader', {static: true}) relativeHeader?: HeaderComponent;
  @ViewChild('fixedHeader', {static: true}) fixedHeader?: HeaderComponent;

  constructor(private elementRef: ElementRef) {

  }

  @HostListener('window:scroll', ['$event']) onScroll(e: Event): void {
    if (window.scrollY >= 275) {
      this.fixedHeader!.slideFixedHeaderDown();
    } else {
      this.fixedHeader!.slideFixedHeaderUp();
    }
  }
  
  title = 'tees4drip';

  images = [1, 2, 3, 4].map((n) => `../assets/images/home_images/slide${n}.png`);



}
