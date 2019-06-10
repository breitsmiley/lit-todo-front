export interface IUserData {
  id: number;
  email: string;
  _token: string;
  _tokenExpirationDate: Date;
  tokenExpirationTS: number;
}

export class User {
  constructor(
    public id: number,
    public email: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    public tokenExpirationTS: number
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get tokenExpirationDate() {
    return this._tokenExpirationDate;
  }
}
