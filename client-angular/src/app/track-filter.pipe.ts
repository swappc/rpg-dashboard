import { Pipe, PipeTransform } from '@angular/core';
import { LibraryTrack } from './library.service';

@Pipe({
  name: 'trackFilter',
  pure: false
})
export class TrackFilterPipe implements PipeTransform {

  transform(items: LibraryTrack[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(searchText.toLowerCase());
    });
  }
}
