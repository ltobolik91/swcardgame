export interface SWFetchedData {
    [key: string]: CardData<string>[];
  }
  export interface CardData<T> {
    [key: string]: T;
  }

 export      interface CardEntries {
    key: string;
    value: string | string[]
}