import { Pipe, PipeTransform } from '@angular/core';
<<<<<<< HEAD
import { Playlist } from './library.service';
=======
import { Playlist } from './playlist';
>>>>>>> Added mmissing files

@Pipe({
  name: 'playlistFilter',
  pure: false
})
export class PlaylistFilterPipe implements PipeTransform {

  transform(items: Playlist[], searchText: string): any[] {
<<<<<<< HEAD
=======
      console.log("Searching For: " + searchText);
>>>>>>> Added mmissing files
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(searchText.toLowerCase());
    });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> Added mmissing files
