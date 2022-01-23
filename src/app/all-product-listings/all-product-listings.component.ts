import { Component, OnInit } from '@angular/core';
import { faChevronRight, faCartPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-all-product-listings',
  templateUrl: './all-product-listings.component.html',
  styleUrls: ['./all-product-listings.component.css']
})
export class AllProductListingsComponent implements OnInit {
  faChevronRight = faChevronRight;
  faCartPlus = faCartPlus;
  categories=["Category 1", "Category 2", "Category 3", "Category 4"];
  sizes = ["Large", "Medium", "Small"];
  constructor() { }

  ngOnInit(): void {
  }

}
