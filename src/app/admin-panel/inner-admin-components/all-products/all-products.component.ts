import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { allCategories, allColors, allSizes } from 'src/app/all-product-listings/all-product-listings.component';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css', '../admin-styles.css']
})
export class AllProductsComponent implements OnInit {
  allAvailableProducts: AdminProduct[] = [];
  availableColors:  string[] = allColors;
  availableSizes:  string[] = allSizes;
  availableCategories: string[] = allCategories;


  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get("/api/products/findAllAdmin", {params: {key: ""}}).subscribe((res: any) => {
      this.allAvailableProducts = res["results"].map((p: any) => this.processProducts(p));
      console.log(this.allAvailableProducts);
    })
  }

  onDeleteFormSubmit() {
    
  }

  processProducts(product: any) {
    return ({
      id: product.id,
      category: product.category,
      productName: product.productName,
      ngn: product.ngn,
      usd: product.usd,
      sizes: product.sizes.split(","),
      colors: product.colors.split(","),
      images: product.images.split(","),
      mainImage: product.images.split(",")[0],
    })
  }

  isChecked(color: string,  allColors: string[]) {
    return allColors.includes(color);
  }

}

interface AdminProduct {
  id: number;
  category: string;
  productName: string;
  ngn: number;
  usd: number;
  sizes: string[];
  colors: string[];
  mainImage: string;
  images: string[];
}
