import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderMobileComponent } from './header-mobile/header-mobile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { ItemPageComponent } from './item-page/item-page.component';
import { SwiperModule } from 'swiper/angular';
import { ItemGridComponent } from './item-grid/item-grid.component';
import { AllProductListingsComponent } from './all-product-listings/all-product-listings.component';
import { CategoryComponent } from './filter-components/category/category.component';
import { ColorComponent } from './filter-components/color/color.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';
import { LookbookComponent } from './lookbook/lookbook.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AllProductsComponent } from './admin-panel/inner-admin-components/all-products/all-products.component';
import { AdminOrdersComponent } from './admin-panel/inner-admin-components/admin-orders/admin-orders.component';
import { AdminAddProductsComponent } from './admin-panel/inner-admin-components/admin-add-products/admin-add-products.component';
import { TurnIntoIdentifierPipe } from './transformers/turn-to-identifier.pipe';

const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'products/:productId', component: ItemPageComponent},
  {path: 'products', component: AllProductListingsComponent},
  // {path: 'login', component: LoginComponent},
  {path: 'cart', component: CartComponent},
  {path: 'checkout', component: CheckoutComponent},
  // {path: 'order-complete', component: OrderCompleteComponent},
  {path: 'lookbook', component: LookbookComponent},
  // {path: 'admin', component: AdminPanelComponent, children: [
  //   {path: '', component: AllProductsComponent},
  //   {path: 'addProduct', component: AdminAddProductsComponent}
  // ]},
]

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    ColorComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    HeaderMobileComponent,
    ItemPageComponent,
    ItemGridComponent,
    AllProductListingsComponent,
    CartComponent,
    LoginComponent,
    CheckoutComponent,
    OrderCompleteComponent,
    LookbookComponent,
    AdminPanelComponent,
    AllProductsComponent,
    AdminOrdersComponent,
    AdminAddProductsComponent,
    TurnIntoIdentifierPipe,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    AppRoutingModule,
    MatCarouselModule.forRoot(),
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, {scrollPositionRestoration: 'enabled'}),
    SwiperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
