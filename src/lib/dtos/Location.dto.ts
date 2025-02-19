export class Location {
  public code!: string
  public name!: string
  constructor(data: Location) {
    this.code = data.code;
    this.name = data.name;
  }
}