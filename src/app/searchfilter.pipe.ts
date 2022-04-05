import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {

  transform(args: any, value: string): any {
    let resultPost = [];
    if(args && value){
      for(let val of args){
        if(val.name.toLowerCase().includes(value.toLowerCase())){
          resultPost.push(val);
        }
        if(val.nombreContratista.toLowerCase().includes(value.toLowerCase())){
          resultPost.push(val);
        }
        if(val.zoneDescription.toLowerCase().includes(value.toLowerCase())){
          resultPost.push(val);
        }
        if(val.categoryDescription.toLowerCase().includes(value.toLowerCase())){
          resultPost.push(val);
        }
        if(val.focoDescription.toLowerCase().includes(value.toLowerCase())){
          resultPost.push(val);
        }
        if(val.enfoqueDescription.toLowerCase().includes(value.toLowerCase())){
          resultPost.push(val);
        }
        if(val.ejecutorDescription.toLowerCase().includes(value.toLowerCase())){
          resultPost.push(val);
        }
        if(val.fecha.toLowerCase().includes(value.toLowerCase())){
          resultPost.push(val);
        }
      }
      return resultPost;
    }else{
      return args;
    }
    
  }

}