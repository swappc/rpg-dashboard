import { Pipe, PipeTransform } from '@angular/core';
import { Playlist } from './library.service';

@Pipe({
    name: 'playlistFilter',
    pure: false
})
export class PlaylistFilterPipe implements PipeTransform {

    transform(items: Playlist[], searchText: string): any[] {
        console.log("Searching For: " + searchText);
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return it.name.toLowerCase().includes(searchText.toLowerCase());
        });
    }

}
