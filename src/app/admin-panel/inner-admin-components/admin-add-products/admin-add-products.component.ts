import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { allCategories, allColors, allSizes } from 'src/app/all-product-listings/all-product-listings.component';

@Component({
  selector: 'app-admin-add-products',
  templateUrl: './admin-add-products.component.html',
  styleUrls: ['./admin-add-products.component.css', '../admin-styles.css']
})
export class AdminAddProductsComponent implements OnInit {
  availableColors:  string[] = allColors;
  availableSizes:  string[] = allSizes;
  availableCategories: string[] = allCategories;
  productForm = new FormGroup({
    name: new FormControl(''),
    mainImage: new FormControl(''),
    image2: new FormControl(''),
    image3: new FormControl(''),
    category: new FormControl(''),
    desc: new FormControl(''),
    ngn: new FormControl(''),
    usd: new FormControl(''),
    color: new FormControl(''),
    size: new FormControl('')
  });

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  showFormValues() {
    console.log(this.productForm.controls)
  }

  get getMainImage() {
    return this.productForm.controls.mainImage.value ? this.productForm.controls.mainImage.value : "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640";
  }

  submitNewProduct() {
    // Verify the presence of the required fields.
    const formControls = this.productForm.controls;
    this.httpClient.post("/api/products/createProduct", {token: "", name: formControls.name.value, ngn: formControls.ngn.value, usd: formControls.usd.value, desc: formControls.desc.value, category: formControls.category.value, color: formControls.color.value, size: formControls.size.value, images: [this.productForm.controls.mainImage.value, this.productForm.controls.image2.value, this.productForm.controls.image3.value]}).subscribe((data) => {
      // Create the product first
      // Retrieve the ID
      console.log(data);
    })

  }

}
