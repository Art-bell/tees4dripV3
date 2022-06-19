import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class SortingService {
    // This data needs to be persisted in local storage for retention.
    //default
    sortingMethod: Sort = Sort.AtoZ;

    setSortingMethod(sort: Sort) {
        this.sortingMethod = sort;
    }

    getSortingMethod(): Sort{
        return this.sortingMethod;
    }
}

export enum Sort {
    AtoZ = 1,
    ZtoA,
    priceAsc,
    priceDesc,
    newest,
    oldest,
}

interface filter {
    [key:string]: any;
}