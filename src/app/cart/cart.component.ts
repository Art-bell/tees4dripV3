import { ViewEncapsulation, Component, OnInit } from '@angular/core';
import { faChevronRight, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import SwiperCore, { Pagination, Navigation } from "swiper";
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

  constructor() { }

  ngOnInit(): void {
  }

}
