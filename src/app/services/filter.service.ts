import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class FilterService {
    // This data needs to be persisted in local storage for retention.
    filters: filter = {"Category":[], "Size": [], "Color":[]};
    acceptedFilters: string[] = ["Category", "Size",  "Color"];

    addItemtoFilterList(filter: string, value: string) {
        console.log(filter, value);
    }

    getFilters() {
        return this.filters;
    }
}


interface filter {
    [key:string]: any;
}