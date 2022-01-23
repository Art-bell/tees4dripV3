import { Component, Input, OnInit } from '@angular/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'color-filter',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit {
  @Input() filterName = "Colors";
  @Input() colors = [
    "#4d4c4a", "#3bdbe3", "#d83be3", 
    "#3be354", "#141310", "#ffffff", 
    "#e62222", "#dde33b", "#3be3c1"];
  
  faChevronDown = faChevronDown;
  constructor() { }

  ngOnInit(): void {
  }

  buttonTouched(event:Event) {
    console.log(event);
  }
}
