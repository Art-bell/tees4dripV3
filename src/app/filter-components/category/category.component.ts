import { Component, Input, OnInit } from '@angular/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'category-filter',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  @Input() filterName = "";
  @Input() dataValues: string[] = [];
  faChevronDown = faChevronDown;
  constructor(private filterService: FilterService) { }

  ngOnInit(): void {
  }

  addFilter(event:any, filterName: string, value: string) {
    // console.log(event);
    const isChecked = event.srcElement.checked;
    const allFilters = this.filterService.getFilters();
    if (!Object.keys(allFilters).includes(filterName)) {
      console.log(filterName, "Filters not changed since the filter does not exist");
      return;
    }
    if (isChecked) {
      // Add to filter list.
      // Check if it exists in the array already
      
      if (allFilters[filterName].includes(value)) {
        console.log("Item not added since it is already included");
        return;
      }

      allFilters[filterName].push(value);
    } else {
      // Remove from filter list.
      const index = allFilters[filterName].indexOf(value);
      if (index > -1) {
        allFilters[filterName].splice(index, 1);
      }
    }
  }

  activated(filterName: string,item: string) {
    return this.filterService.getFilters()[filterName].includes(item);
  }

}
