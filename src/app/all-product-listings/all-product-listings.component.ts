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
  allCategories = allCategories;
  allSizes = allSizes;
  allColors = allColors;
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
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    if (check) {
      (document.querySelector(".full-site")! as HTMLElement).style.display = "none";
      (document.querySelector(".coming-soon")! as HTMLElement).style.display = "flex";
    }

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
    this.http.post('/api/addToCart', {userToken: this.userService.getUserToken(), productId}).subscribe((res:any) => {
      if (Object.keys(res).includes("createdAt")) {
        this.userService.setCartSize(this.userService.getCartSize() + 1);
        this.userService.setCartTotal(this.userService.getCartTotal() + ngnPrice);
        this.router.navigate(['/cart']);
      }
    })
  }
}

export const allCategories = ["T-shirts", "Shirts"];
export const allSizes = ["xs", "s", "m", "l", "xl", "xxl"];
export const allColors = [
  "red", "white", "blue", 
  "green", "grey", "yellow", 
  "purple", "brown", "pink",
  "black"];

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