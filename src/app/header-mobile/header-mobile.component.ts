import { Component, OnInit, HostBinding, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.css']
})
export class HeaderMobileComponent implements OnInit {
  @HostBinding("style.position") position: string = "";
  @HostBinding("style.display") display: string = "";
  @HostBinding("style.top") top: string = "";
  @HostBinding("style.left") left: string = "";
  @HostBinding("style.transition") transition: string = "";
  @HostBinding("style.box-sizing") boxSizing: string = "";
  @HostBinding("style.background-color") backgroundColor: string = "white";
  @HostBinding("style.z-index") zIndex: string = "10";
  @Input() fixed: boolean = false;
  constructor() { }

  ngOnInit(): void {
    if (this.fixed) {
      this.position = "fixed";
      this.top = "-270px";
      this.left = "0";
      this.transition = "top 300ms cubic-bezier(0.17, 0.04, 0.03, 0.94)";
      this.boxSizing = "border-box";
    }
  }

  slideFixedHeaderDown(): void {
    if (this.fixed) {
      this.top = "0";
    }
  }

  slideFixedHeaderUp(): void {
    if (this.fixed) {
      this.top = "-270px";
    }
  }

}
