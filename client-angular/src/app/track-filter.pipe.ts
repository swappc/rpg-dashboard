import { Pipe, PipeTransform } from '@angular/core';
import { Track } from './track';

@Pipe({
  name: 'trackFilter',
  pure: false
})
export class TrackFilterPipe implements PipeTransform {

  transform(items: Track[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(searchText.toLowerCase());
    });
  }
}
