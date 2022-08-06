// error.ts

export class MatchMakingError extends Error {
  readonly meta: TAllMatchMakingErr;
  constructor( errObj:TAllMatchMakingErr ) {
    super( errObj.msg );
    super.name = "MatchMakingError";
    this.meta = errObj;
  }
}

type TAllMatchMakingErr = TErr_EmptyUserList | TErr_NotEnoughVacancy | TErr_NotAUserInstance | TErr_InvalidParam | TErr_ActionDisallowed;

export type TErr_EmptyUserList = {
  code: "EMPTY_USER_LIST",
  msg: string,
  info: {},
}

export type TErr_NotEnoughVacancy = {
  code: "NOT_ENOUGH_VACANCY",
  msg: string,
  info: {
    occupiedSlot: number,
    maxSlot: number,
    requiredSlot: number,
  },
}

export type TErr_NotAUserInstance = {
  code: "NOT_A_USER_INSTANCE",
  msg: string,
  info: {
    provided: any,
  }
}

export type TErr_InvalidParam = {
  code: "INVALID_PARAM",
  msg: string,
  info: {
    paramName: string,
    expected: any,
    received: any
  }
}

export type TErr_ActionDisallowed = {
  code: "ACTION_DISALLOWED",
  msg: string,
  info: {}
}