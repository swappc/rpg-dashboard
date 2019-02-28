import { Pipe, PipeTransform } from '@angular/core';
import { PlaylistTrack } from './playlist';

@Pipe({
  name: 'trackFilter'
})
export class TrackFilterPipe implements PipeTransform {

  transform(items: PlaylistTrack[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(searchText.toLowerCase());
    });
  }
}
