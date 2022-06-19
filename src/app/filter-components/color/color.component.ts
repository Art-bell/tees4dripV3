import { Component, Input, OnInit } from '@angular/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'color-filter',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit {
  @Input() filterName = "Color";
  @Input() colors = [
    "red", "white", "blue", 
    "green", "grey", "yellow", 
    "purple", "brown", "pink",
    "black"];
  
  faChevronDown = faChevronDown;
  constructor(private filterService: FilterService) { }

  ngOnInit(): void {
  }

  addFilter(event:any, filterName: string, value: string) {
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
