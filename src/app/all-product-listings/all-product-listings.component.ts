import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faChevronRight, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { ProductData } from '../home/home.component';
import { FilterService } from '../services/filter.service';
import { Sort, SortingService } from '../services/sorter.service';
import { UserService } from '../services/user.service';
import '/node_modules/bimap';
@Component({
  selector: 'app-all-product-listings',
  templateUrl: './all-product-listings.component.html',
  styleUrls: ['./all-product-listings.component.css']
})
export class AllProductListingsComponent implements OnInit {
  faChevronRight = faChevronRight;
  faCartPlus = faCartPlus;
  activeSort = sortEnumToSortText[this.sortingService.getSortingMethod()];
  sortingOptions: string[] = Object.values(sortEnumToSortText);
  allCategories=["T-shirts", "Shirts"];
  allSizes = ["xs", "s", "m", "l", "xl", "xxl"];
  filters = {"categories":[], "sizes": [], "colors":[]};
  loaderOptions = ["banknote_loading.svg", "money_loading.svg"]
  loader = "";
  loading = true;
  productsToDisplay: ProductData[] = [];
  params = {};

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private filterService: FilterService, private sortingService: SortingService, private userService: UserService) {
    this.loader = this.loaderOptions[getRandomInt(this.loaderOptions.length)];
  }

  ngOnInit(): void {
    // On page load, send a request for the content with the filters.
    // For the params, we need to make sure we covert the list to the 
    // appropriate URL friendly format.
    // this.http.get()
    // When a user clicks the 'update' button, send a request with the filters.
    // We should persist the filters in local storage.

    // As an additional note for this, we should make the requests in 
    // batches based on the users scroll. So an infinite scroll type p.

    this.route.queryParams.subscribe(params => {
      this.params = params;
      // Set filters based on url.
      const allFilters = this.filterService.getFilters();

      for (let filterName of Object.keys(params)) {
        if (this.filterService.acceptedFilters.includes(filterName)) {
          let values = params[filterName];
          if (typeof values === 'string') {
            values = [params[filterName]];
          }
          console.log(values);
          for (let setItem of values) {
            if (!allFilters[filterName].includes(setItem)) {
              allFilters[filterName].push(setItem);
            }
          }
          // allFilters[filterName] = params[filterName];
        }
      }

       // Read the params from URL
      this.http.get("/api/products/productResults",
        {
          "params": this.params
        }).subscribe((res:any) => {
          this.productsToDisplay = res.results;
          // sort based on sorting service.
          setTimeout( () => {
            this.loading = false;
          }, 2000);
        })
      });
  }

  sendUpdateFilterRequest() {
    this.loader = this.loaderOptions[getRandomInt(this.loaderOptions.length)];
    this.loading = true;
    const params = this.filterService.getFilters();
    console.log(params);
    this.router.navigate(
      ['/products'],
      { queryParams: params }
    );
    // this.http.get("/api/products/productResults",
    // {
    //   "params": params
    // }).subscribe((res:any) => {
    //   this.productsToDisplay = this.sortResults(res.results);
    //   setTimeout( () => {
    //     this.loading = false;
    //   }, 2000);
    // })
  }

  navigateToProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  sortResults(results: ProductData[]) {
    switch(this.sortingService.getSortingMethod()) {
      case Sort.AtoZ:
        return results.sort((productA, productB) => productA.name.localeCompare(productB.name));
      case Sort.ZtoA:
        return results.sort((productA, productB) => productB.name.localeCompare(productA.name));
      case Sort.priceAsc:
        return results.sort((productA, productB) => productA.ngn - productB.ngn);
      case Sort.priceDesc:
        return results.sort((productA, productB) => productB.ngn - productA.ngn);
      case Sort.newest:
        return results.sort((productA, productB) => productA.createdAt.localeCompare(productB.createdAt));
      case Sort.oldest:
        return results.sort((productA, productB) => productB.createdAt.localeCompare(productA.createdAt));
    }
  }

  setSortingMethod(e: any) {
    const sortText = e.target.dataset.sort;
    this.sortingService.setSortingMethod(sortTextToSortEnum[sortText]);
    this.activeSort = sortEnumToSortText[this.sortingService.getSortingMethod()];
    this.productsToDisplay = this.sortResults(this.productsToDisplay);
  }

  addToCart(e: Event, productId:number, ngnPrice: number) {
    e.stopPropagation();
    this.http.post('/api/addToCart', {cartId: 1, productId}).subscribe((res:any) => {
      if (Object.keys(res).includes("createdAt")) {
        this.userService.setCartSize(this.userService.getCartSize() + 1);
        this.userService.setCartTotal(this.userService.getCartTotal() + ngnPrice);
        this.router.navigate(['/cart']);
      }
    })
  }
}

interface mergedFilter {
  [key:string]: any
}
function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const sortEnumToSortText: {[key in Sort]: string} = {
  [Sort.AtoZ]: "A - Z",
  [Sort.ZtoA]: "Z - A",
  [Sort.priceAsc]: "Price Ascending",
  [Sort.priceDesc]: "Price Descending",
  [Sort.newest]: "Newest",
  [Sort.oldest]: "Oldest",
};

const sortTextToSortEnum: {[key: string]: Sort} = {
  "A - Z": Sort.AtoZ,
  "Z - A": Sort.ZtoA,
  "Price Ascending": Sort.priceAsc,
  "Price Descending": Sort.priceDesc,
  "Newest": Sort.newest,
  "Oldest": Sort.oldest,
};