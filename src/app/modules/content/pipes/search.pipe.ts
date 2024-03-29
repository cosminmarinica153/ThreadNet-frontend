import { Pipe, PipeTransform } from '@angular/core';
import { IThread } from '@apiModel/IThread';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: IThread[], searchText: string): IThread[] {
    if (!items || !searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(item =>
      item.title.toLowerCase().includes(searchText) ||
      item.content.toLowerCase().includes(searchText)
    );
  }

}
