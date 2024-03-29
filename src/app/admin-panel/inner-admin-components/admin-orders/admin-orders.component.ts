import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminOrder } from '../../../common_utils/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { AdminOrderDialog } from './admin-order-dialog/admin-order-dialog.component';
import {
  getFormattedOrderTotalText,
  getCardDeliveryText,
} from '../../../common_utils/utils';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css', '../admin-styles.css'],
})
export class AdminOrdersComponent implements OnInit {
  getFormattedOrderTotalText = getFormattedOrderTotalText;
  getCardDeliveryText = getCardDeliveryText;
  allOrders: AdminOrder[] = [];
  constructor(
    private readonly httpClient: HttpClient,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Fetch new data
    this.fetchData();
  }

  fetchData() {
    this.httpClient.get('/api/orders/').subscribe(
      (res: any) => {
        this.allOrders = res.map((o: any) => this.processOrder(o));
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  viewOrder(order: AdminOrder) {
    const dialogRef = this.dialog.open(AdminOrderDialog, { data: { order } });

    dialogRef.afterClosed().subscribe((result: { success: boolean }) => {
      if (result.success) {
        this.fetchData();
      }
    });
  }

  processOrder(order: any): AdminOrder {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerFirstName: order.customerFirstName,
      customerLastName: order.customerLastName,
      customerEmail: order.customerEmail,
      customerPhoneNumber: order.customerPhoneNumber,
      customerStreetAddress1: order.customerStreetAddress1,
      customerStreetAddress2: order.customerStreetAddress2,
      customerCity: order.customerCity,
      customerZipCode: order.customerZipCode,
      customerCountry: order.customerCountry,
      hasBeenPaid: order.hasBeenPaid,
      createdAt: order.createdAt,
      products: order.products,
      orderTotal: order.orderTotal,
    };
  }

  getOrderedItemsCount(order: AdminOrder) {
    return `${order.products.length} item(s) ordered`;
  }
}
