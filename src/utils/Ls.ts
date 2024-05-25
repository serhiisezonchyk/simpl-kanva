interface LsInterface<T> {
  data: T[];
  getData: () => void;
  setItem: (data: T[]) => void;
}

export class Ls<T> implements LsInterface<T> {
  public data: T[] = [];
  constructor(private key: string) {}

  getData() {
    const storedData = localStorage.getItem(this.key);
    this.data = storedData ? JSON.parse(storedData) : [];
  }

  setItem(data: T[]) {
    this.data = data;
    localStorage.setItem(this.key, JSON.stringify(data));
  }
}
