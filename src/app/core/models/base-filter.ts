export enum OrderBy {
    ASC = 'asc',
    DESC = 'desc',
  }
  
  export class Filter {
    Id?: string;
  
    Page: number = 1;
  
    PageSize: number = 10;
  
    CurPage: number = 1;
  
    TotalRecords: number = 0;
  
    Query: string = '';
  
    OrderBy!: OrderBy;
  
    OrderByColumn?: string;
  }
  
  export interface IRouteState {
    filter: any;
    data: any;
  }
  
  export class Time {
    static Hrs24Format = () => {
      let time: any[] = [];
      for (let index = 0; index < 24; index++) {
        let h = index < 10 ? '0' + index : index;
        time.push({ Name: `${h}:00`, Value: parseFloat(`${index}`) });
        time.push({ Name: `${h}:10`, Value: parseFloat(`${index}.1`) });
        time.push({ Name: `${h}:20`, Value: parseFloat(`${index}.2`) });
        time.push({ Name: `${h}:30`, Value: parseFloat(`${index}.3`) });
        time.push({ Name: `${h}:40`, Value: parseFloat(`${index}.4`) });
        time.push({ Name: `${h}:50`, Value: parseFloat(`${index}.5`) });
      }
      time.push({ Name: `24:00`, Value: `24` });
      return time;
    };
  }
  
  export interface IAggregate {
    count: number;
  }
  
  export interface IAggregateResult {
    aggregate: IAggregate;
  }
  