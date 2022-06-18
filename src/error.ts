class MatchMakingError extends Error {
  readonly code: string;
  readonly info: any;
  constructor( code: string, info: any, msg: string ) {
    super( msg );
    this.code = code;
    this.info = info;
  }
}