export class IdGenerator {
  private _id: number;
  constructor( startFrom: number = 1 ) {
    this._id = startFrom;
  }
  get curId() : number {
    return this._id;
  }
  get newId() : number {
    return ++this._id;
  }
}