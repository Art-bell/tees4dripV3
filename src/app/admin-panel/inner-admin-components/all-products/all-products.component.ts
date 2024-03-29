import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminProduct, BaseItem } from '../../../common_utils/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

interface DialogData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css', '../admin-styles.css'],
})
export class AllProductsComponent implements OnInit {
  productFilter: string = '';
  allAvailableProducts: AdminProduct[] = [];
  filteredAvailableProducts: AdminProduct[] = [];
  availableColors: BaseItem[] = [];
  availableSizes: BaseItem[] = [];
  availableCategories: BaseItem[] = [];
  categoryNameToId: { [key: string]: number } = {};
  updateForm = new FormGroup({
    id: new FormControl(''),
    category: new FormControl(''),
    mainImage: new FormControl(''),
    image2: new FormControl(''),
    image3: new FormControl(''),
    desc: new FormControl(''),
    ngn: new FormControl(''),
    usd: new FormControl(''),
    colors: new FormArray([]),
    size: new FormArray([]),
  });

  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Get all color options
    const colorsRequest$ = this.httpClient.get('/api/colors');
    const sizesRequest$ = this.httpClient.get('/api/sizes');
    const productCategories$ = this.httpClient.get('/api/productCategories');
    const products$ = this.httpClient.get('/api/products/findAllAdmin', {
      params: { key: '' },
    });
    forkJoin([colorsRequest$, sizesRequest$, productCategories$, products$])
      .pipe(
        map(([colors, sizes, categories, products]) => {
          return {
            colors,
            sizes,
            categories,
            products,
          };
        })
      )
      .subscribe((values) => {
        this.availableCategories = values.categories as BaseItem[];
        this.categoryNameToId = this.availableCategories.reduce((acc, curr) => {
          acc[curr.name] = curr.id;
          return acc;
        }, {} as { [key: string]: number });
        this.availableColors = values.colors as BaseItem[];
        this.availableSizes = values.sizes as BaseItem[];
        this.allAvailableProducts = (
          values.products as { results: any[] }
        ).results.map((p: any) => this.processProducts(p));

        this.filteredAvailableProducts = [...this.allAvailableProducts];
      });
  }

  openDeleteConfirmation(product: AdminProduct) {
    const dialogRef = this.dialog.open(DeleteProductConfirmationDialog, {
      data: {
        id: product.id,
        name: product.productName,
      },
    });

    dialogRef.afterClosed().subscribe((result: { deleted: boolean }) => {
      if (result.deleted) {
        // Fetch new data
        this.httpClient
          .get('/api/products/findAllAdmin', {
            params: { key: '' },
          })
          .subscribe((res: any) => {
            this.allAvailableProducts = res.results.map((p: any) =>
              this.processProducts(p)
            );
            this.filteredAvailableProducts = [...this.allAvailableProducts];
          });
      }
    });
  }

  onSearch(event: any) {
    if (event) {
      this.filteredAvailableProducts = this.allAvailableProducts.filter(
        (product: AdminProduct) => {
          return product.productName
            .toLowerCase()
            .includes(this.productFilter.toLowerCase());
        }
      );
    } else {
      this.filteredAvailableProducts = [...this.allAvailableProducts];
    }
  }

  onSaveFormSubmit(form: NgForm) {
    const formValues = form.value;
    // Update format:
    const id = formValues.id;
    const name = formValues.name;
    const mainImage = formValues.mainImage;
    const quantityAvailable = formValues.quantityAvailable;
    const altImage1 = formValues.altImage1;
    const altImage2 = formValues.altImage2;
    const ngnPrice = formValues.priceNgn;
    const usdPrice = formValues.priceUsd;
    const description = formValues.description;
    const category = this.categoryNameToId[formValues.category];
    const colors = this.getBaseItemId(formValues, this.availableColors);
    const sizes = this.getBaseItemId(formValues, this.availableSizes);

    let errorMessage = '';
    if (!mainImage) {
      errorMessage = 'A main image is required before saving';
    } else if (!ngnPrice || ngnPrice < 0) {
      errorMessage = 'An non-negative NGN price is required before saving';
    } else if (!usdPrice || usdPrice < 0) {
      errorMessage = 'A non-negative  USD price is required before saving';
    } else if (!description) {
      errorMessage = 'A description is required before saving';
    } else if (!name) {
      errorMessage = 'A name is required before saving';
    } else if (quantityAvailable < 0 || quantityAvailable > 10000) {
      errorMessage =
        'Quantity available must be between 0 and 10000 (inclusive)';
    } else if (colors.length === 0) {
      errorMessage = 'At least one color must be selected';
    } else if (sizes.length === 0) {
      errorMessage = 'At least one size must be selected';
    }

    if (errorMessage) {
      this.snackBar.open(errorMessage, 'Done', {
        panelClass: ['warning-snackbar'],
      });
      return;
    }

    const data = {
      id,
      name,
      description,
      quantityAvailable,
      mainImage,
      altImage1,
      altImage2,
      category,
      ngnPrice,
      usdPrice,
      colors,
      sizes,
    };

    this.httpClient.post('/api/products/updateProduct', data).subscribe(
      (res: any) => {
        this.snackBar.open('Successfully updated product', 'Done', {
          panelClass: ['success-snackbar'],
        });
        return;
      },
      (err: any) => {
        this.snackBar.open(
          'An error occurred while trying to create the product',
          'Done',
          {
            panelClass: ['warning-snackbar'],
          }
        );
        return;
      }
    );

    // TODO verify the images before adding to images array.

    // {
    //   'id': 'ProductId',
    //   'name': 'product name',
    //   'description': 'product description',
    //   'image1': "ImageUrl",
    //   'image2': "ImageUrl",
    //   'image3': "ImageUrl",
    //   'ngn': 'Price in NGN',
    //   'usd': 'Price in USD',
    //   'category': 'Product Category',
    //   'sizes': [IDs for each relevant size],
    //   'colors': [IDs for colros]

    // }
    // updateForm = new FormGroup({
    //   id: new FormControl(''),
    //   category: new FormControl(''),
    //   mainImage: new FormControl(''),
    //   image2: new FormControl(''),
    //   image3: new FormControl(''),
    //   desc: new FormControl(''),
    //   ngn: new FormControl(''),
    //   usd: new FormControl(''),
    //   colors: new FormArray([]),
    //   size: new FormArray([]),
    // });
    // make http request for this product ID with all the new data
  }

  getBaseItemId(value: any, availableList: BaseItem[]) {
    const ids: number[] = [];
    for (let baseItem of availableList) {
      if (value[baseItem.name]) {
        ids.push(baseItem.id);
      }
    }

    return ids;
  }

  processProducts(product: any): AdminProduct {
    return {
      id: product.id,
      description: product.description,
      quantityAvailable: product.quantityAvailable,
      category: product.category,
      productName: product.productName,
      ngn: product.ngn,
      usd: product.usd,
      sizes: product.sizes.split(','),
      colors: product.colors.split(','),
      images: product.images.split(','),
      mainImage: product.images.split(',')[0],
    };
  }

  isChecked(color: string, allColors: string[]) {
    return allColors.includes(color);
  }
}

@Component({
  selector: 'delete-product-dialog',
  styleUrls: ['./all-products.component.css', '../admin-styles.css'],
  template: `<div class="main-dialog">
    <div>
      Are you sure you want to delete
      <span style="font-weight: bold;">{{ this.data.name }}</span> ?
    </div>
    <div class="dialog-actions">
      <button class="cancel-button" (click)="onCancel()">CANCEL</button>
      <button class="delete-button" (click)="onDeleteFormSubmit(this.data.id)">
        DELETE
      </button>
    </div>
  </div>`,
})
export class DeleteProductConfirmationDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar,
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<DeleteProductConfirmationDialog>
  ) {}

  onCancel() {
    this.dialogRef.close({ deleted: false });
  }

  onDeleteFormSubmit(id: number) {
    // Delete this specific product ID from the database
    this.httpClient
      .post('/api/products/deleteProduct', { id })
      .subscribe((res: any) => {
        this.snackBar.open(
          `Successfully delete product ${this.data.name}`,
          'Done',
          {
            panelClass: ['success-snackbar'],
          }
        );
        this.dialogRef.close({ deleted: true });
        // On success, show snack bar message, send data back to parent with a signal to refresh
      });
  }
}
