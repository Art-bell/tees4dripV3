import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseItem } from '../../../common_utils/interfaces';

@Component({
  selector: 'app-admin-add-products',
  templateUrl: './admin-add-products.component.html',
  styleUrls: ['./admin-add-products.component.css', '../admin-styles.css'],
})
export class AdminAddProductsComponent implements OnInit {
  availableColors: BaseItem[] = [];
  availableSizes: BaseItem[] = [];
  availableCategories: BaseItem[] = [];
  productForm = new FormGroup({
    name: new FormControl(''),
    mainImage: new FormControl(''),
    quantityAvailable: new FormControl(''),
    image2: new FormControl(''),
    image3: new FormControl(''),
    category: new FormControl(''),
    description: new FormControl(''),
    ngn: new FormControl(''),
    usd: new FormControl(''),
  });
  categoryNameToId: { [key: string]: number } = {};
  colorSelectionMap: { [key: string]: boolean } = {};
  sizeSelectionMap: { [key: string]: boolean } = {};

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const colorsRequest$ = this.httpClient.get('/api/colors');
    const sizesRequest$ = this.httpClient.get('/api/sizes');
    const productCategories$ = this.httpClient.get('/api/productCategories');

    forkJoin([colorsRequest$, sizesRequest$, productCategories$])
      .pipe(
        map(([colors, sizes, productCategories]) => ({
          colors,
          sizes,
          productCategories,
        }))
      )
      .subscribe(({ colors, sizes, productCategories }) => {
        this.availableCategories = productCategories as BaseItem[];
        this.availableColors = colors as BaseItem[];
        this.availableSizes = sizes as BaseItem[];

        for (const color of this.availableColors) {
          this.colorSelectionMap[color.name] = false;
        }

        for (const size of this.availableSizes) {
          this.sizeSelectionMap[size.name] = false;
        }

        this.categoryNameToId = this.availableCategories.reduce((acc, curr) => {
          acc[curr.name] = curr.id;
          return acc;
        }, {} as { [key: string]: number });
      });
  }

  colorChanged(data: any) {
    if (data.target.checked) {
      this.colorSelectionMap[data.target.value] = true;
    } else {
      this.colorSelectionMap[data.target.value] = false;
    }
  }

  sizeChanged(data: any) {
    if (data.target.checked) {
      this.sizeSelectionMap[data.target.value] = true;
    } else {
      this.sizeSelectionMap[data.target.value] = false;
    }
  }

  clearInputs() {
    this.productForm.reset();
  }

  showFormValues() {
    console.log(this.productForm.controls);
  }

  isChecked(color: string, allColors: string[]) {
    return allColors.includes(color);
  }

  get getMainImage() {
    return this.productForm.controls.mainImage.value
      ? this.productForm.controls.mainImage.value
      : 'https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640';
  }

  getImageByIndex(index: number) {
    switch (index) {
      case 1:
        return this.productForm.controls.image2.value;
      case 2:
        return this.productForm.controls.image3.value;
      default:
        return this.productForm.controls.mainImage.value;
    }
  }

  getSelectedColorIds() {
    const selectedColors = [];
    for (const aColor of this.availableColors) {
      if (this.colorSelectionMap[aColor.name]) {
        selectedColors.push(aColor.id);
      }
    }

    return selectedColors;
  }

  getSelectedSizeIds() {
    const selectedSizes = [];
    for (const aSize of this.availableSizes) {
      if (this.sizeSelectionMap[aSize.name]) {
        selectedSizes.push(aSize.id);
      }
    }

    return selectedSizes;
  }

  submitNewProduct() {
    // Verify the presence of the required fields.
    const formControls = this.productForm.controls;
    const selectedColorIds = this.getSelectedColorIds();
    const selectedSizeIds = this.getSelectedSizeIds();

    let errorMessage = '';
    if (!formControls.name.value) {
      errorMessage = 'A name is required';
    } else if (
      formControls.quantityAvailable.value === '' ||
      formControls.quantityAvailable.value < 0 ||
      formControls.quantityAvailable.value > 10000
    ) {
      errorMessage =
        'Quantity available must be between 0 and 10000 (inclusive)';
    } else if (!formControls.mainImage.value) {
      errorMessage = 'A main image is required';
    } else if (!formControls.description.value) {
      errorMessage = 'A description is required';
    } else if (!formControls.ngn.value || formControls.ngn.value < 0) {
      errorMessage = 'An non-negative NGN price is required';
    } else if (!formControls.usd.value || formControls.usd.value < 0) {
      errorMessage = 'A non-negative USD price is required';
    } else if (!formControls.category.value) {
      errorMessage = 'A category must be selected';
    } else if (selectedColorIds.length === 0) {
      errorMessage = 'At least one color must be selected';
    } else if (selectedSizeIds.length === 0) {
      errorMessage = 'At least one size must be selected';
    }

    if (errorMessage) {
      this.snackBar.open(errorMessage, 'Done', {
        panelClass: ['warning-snackbar'],
      });
      return;
    }
    const categoryId = this.categoryNameToId[formControls.category.value];

    this.httpClient
      .post('/api/products/createProduct', {
        token: '',
        name: formControls.name.value,
        quantityAvailable: formControls.quantityAvailable.value,
        ngn: formControls.ngn.value,
        usd: formControls.usd.value,
        description: formControls.description.value,
        categoryId: categoryId,
        colors: selectedColorIds,
        sizes: selectedSizeIds,
        images: [
          this.productForm.controls.mainImage.value,
          this.productForm.controls.image2.value,
          this.productForm.controls.image3.value,
        ],
      })
      .subscribe(
        (data: any) => {
          if (data.message === 'success') {
            this.snackBar.open('Successfully created product', 'Done', {
              panelClass: ['success-snackbar'],
            });
            return;
          } else {
            this.snackBar.open(
              'An error occurred while trying to create the product',
              'Done',
              {
                panelClass: ['warning-snackbar'],
              }
            );
            return;
          }
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
  }
}
