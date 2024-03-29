import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AdminOrder } from '../../../../common_utils/interfaces';
import {
  getFormattedOrderTotalText,
  getCardDeliveryText,
} from '../../../../common_utils/utils';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface FormProduct {
  id: number;
  status: string;
}

@Component({
  selector: 'admin-order-dialog',
  templateUrl: './admin-order-dialog.component.html',
  styleUrls: ['./admin-order-dialog.component.css'],
})
export class AdminOrderDialog {
  successfulSubmission = false;
  getFormattedOrderTotalText = getFormattedOrderTotalText;
  getCardDeliveryText = getCardDeliveryText;
  order: AdminOrder;
  orderForm = this.formBuilder.group({
    orderStatus: [''],
    products: this.formBuilder.array([]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { order: AdminOrder },
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private readonly httpClient: HttpClient,
    private readonly dialogRef: MatDialogRef<AdminOrderDialog>
  ) {
    this.order = this.data.order;
    this.addProductsToForm();
    this.orderForm.controls.orderStatus.setValue(this.getMainOrderStatus());
  }

  mainSelectChanged(changeEvent: Event) {
    // When this changes, we need to set all the minions
    const newStatus = (changeEvent.target! as any).value.toUpperCase();

    (this.orderForm.controls.products as FormArray).controls.forEach(
      (productControl) => {
        (productControl as FormGroup).controls.status.setValue(newStatus);
      }
    );
  }

  productSelectChanged() {
    console.log(this.getMainOrderStatus());
    this.orderForm.controls.orderStatus.setValue(this.getMainOrderStatus());
  }

  addProductsToForm() {
    for (const product of this.order.products) {
      (this.orderForm.controls.products as FormArray).push(
        this.formBuilder.group({
          id: [product.id],
          status: [product.orderProducts.status],
        })
      );
    }
  }

  getMainOrderStatus() {
    const products = this.orderForm.controls.products;

    console.log(products as FormArray);
    console.log((products as FormArray).controls.length);

    if ((products as FormArray).controls.length === 0) {
      this.snackBar.open('There are no products in this order', 'Done', {
        panelClass: ['warning-snackbar'],
      });
      return '';
    }

    const firstStatus = ((products as FormArray).controls[0] as FormGroup)
      .controls.status.value;

    return (products as FormArray).controls.every(
      (product) => (product as FormGroup).controls.status.value === firstStatus
    )
      ? firstStatus
      : 'multiple';
  }

  submitForm() {
    const orderId = this.order.id;
    const products = this.orderForm.controls.products.value;

    this.httpClient
      .post('/api/orders/updateOrderProducts', {
        orderId,
        products,
      })
      .subscribe(
        (res: any) => {
          this.snackBar.open(
            `${res.message}: #${this.order.orderNumber}`,
            'Done',
            {
              panelClass: ['success-snackbar'],
            }
          );
          this.dialogRef.close({ success: true });
        },
        (err: any) => {
          this.snackBar.open(err.message, 'Done', {
            panelClass: ['warning-snackbar'],
          });
        }
      );
  }

  get hasChanged() {
    return !this.orderForm.pristine;
  }
}
