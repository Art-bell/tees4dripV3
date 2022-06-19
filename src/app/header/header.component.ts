import { Component, OnInit, HostBinding, Input, ViewChild, ElementRef } from '@angular/core';
import { faHome, faTags, faBookOpen, faBolt, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit{
  @HostBinding("style.position") position: string = "";
  @HostBinding("style.display") display: string = "";
  @HostBinding("style.top") top: string = "";
  @HostBinding("style.left") left: string = "";
  @HostBinding("style.transition") transition: string = "";
  @HostBinding("style.box-sizing") boxSizing: string = "";
  @Input() fixed: boolean = false;
  @ViewChild("topHeader", {static: true}) topHeader?: ElementRef;
  faHome = faHome;
  faTags = faTags;
  faBookOpen = faBookOpen;
  faBolt = faBolt;
  faPhoneAlt = faPhoneAlt;
  cartSize = 0;
  cartTotal = 0;

  constructor(private userService: UserService) {
    
  }

  ngOnInit(): void {
    this.cartSize = this.userService.getCartSize();
    this.userService.cartSizeSubject.subscribe((newSize) => {
      this.cartSize = newSize;
    });
    this.cartTotal = this.userService.getCartTotal();
    this.userService.cartTotalSubject.subscribe((newTotal) => {
      this.cartTotal = newTotal;
    });
    if (this.fixed) {
      this.position = "fixed";
      this.top = "-250px";
      this.left = "0";
      this.transition = "top 300ms cubic-bezier(0.17, 0.04, 0.03, 0.94)";
      this.boxSizing = "border-box";
      this.topHeader!.nativeElement.style.display = "none";
    }
  }

  slideFixedHeaderDown(): void {
    if (this.fixed) {
      this.top = "0";
    }
  }

  slideFixedHeaderUp(): void {
    if (this.fixed) {
      this.top = "-250px";
    }
  }
}
