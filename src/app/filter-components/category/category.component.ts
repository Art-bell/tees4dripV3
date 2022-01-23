import { Component, Input, OnInit } from '@angular/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'category-filter',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  @Input() filterName = "";
  @Input() dataValues: string[] = [];
  faChevronDown = faChevronDown;
  constructor() { }

  ngOnInit(): void {
  }

}
