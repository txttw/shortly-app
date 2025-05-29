abstract class TokenStorageBase {
  protected abstract key: string;
  set(token: string) {
    localStorage.setItem(this.key, token);
  }
  get() {
    return localStorage.getItem(this.key);
  }
  delete() {
    return localStorage.removeItem(this.key);
  }
}

export class TokenStorage extends TokenStorageBase {
  protected key = "token";
}

export class RefreshTokenStorage extends TokenStorageBase {
  protected key = "refresh";
}
