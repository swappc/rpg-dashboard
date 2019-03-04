import { Pipe, PipeTransform } from '@angular/core';
import { Crate } from './library.service';

@Pipe({
    name: 'crateFilter',
    pure: false
})
export class CrateFilterPipe implements PipeTransform {

    transform(items: Crate[], searchText: string): any[] {
        console.log("Searching For: " + searchText);
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return it.name.toLowerCase().includes(searchText.toLowerCase());
        });
    }

}
