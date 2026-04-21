declare module 'rxjs' {
  export function of<T>(...values: T[]): any;
  export function map<T, R>(project: (value: T, index: number) => R): any;
  export function tap<T>(next: (value: T) => void): any;
  export function catchError<T>(selector: (error: unknown, caught?: unknown) => any): any;
  export function finalize(callback: () => void): any;
  export function firstValueFrom<T>(source: any): Promise<T>;
  export function combineLatest<T extends unknown[]>(sources: [...T]): any;
  export function forkJoin<T extends Record<string, unknown>>(sources: T): any;
}
