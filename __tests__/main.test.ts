interface Comparable<T> {
  compareTo(other: T): number;
}

class NumberValue implements Comparable<NumberValue> {
  value: number;
  constructor(value: number) {
    this.value = value;
  }

  compareTo(other: NumberValue): number {
    return other.value - this.value;
  }
}

class Person implements Comparable<Person> {
  name: string;
  age: number;
  city: string;

  constructor(name: string, age: number, city: string) {
    this.name = name;
    this.age = age;
    this.city = city;
  }

  compareTo(other: Person): number {
    return this.name.localeCompare(other.name);
  }
}

class Node<T extends Comparable<T>> {
  value: T;
  left?: Node<T>;
  right?: Node<T>;

  constructor(value: T) {
    this.value = value;
  }

  find(needle: T): T | null {
    const comparison = this.value.compareTo(needle);

    if (comparison === 0) return this.value;
    if (this.left !== undefined && comparison < 0)
      return this.left.find(needle);
    if (this.right !== undefined && comparison > 0)
      return this.right.find(needle);

    return null;
  }

  add(newValue: T): void {
    const comparison = this.value.compareTo(newValue);
    if (comparison === 0) throw new Error(`Value ${newValue} already exists`);

    if (comparison < 0) {
      if (this.left === undefined) {
        this.left = new Node(newValue);
      } else {
        this.left.add(newValue);
      }
    } else {
      if (this.right === undefined) {
        this.right = new Node(newValue);
      } else {
        this.right.add(newValue);
      }
    }
  }
}

describe('greeter function', () => {
  test('NumberValue', () => {
    const a = new NumberValue(5);
    const b = new NumberValue(7);
    expect(a.compareTo(b)).toEqual(2);
  });

  test('find', () => {
    const root = new Node(new NumberValue(7));
    root.add(new NumberValue(3));
    root.add(new NumberValue(9));
    root.add(new NumberValue(1));

    expect(root.find(new NumberValue(1)).value).toEqual(1);
    expect(root.find(new NumberValue(5))).toEqual(null);
  });

  test('add', () => {
    const root = new Node(new NumberValue(7));
    root.add(new NumberValue(3));
    root.add(new NumberValue(9));
    root.add(new NumberValue(1));

    expect(root.value.value).toEqual(7);
    expect(root.left.value.value).toEqual(3);
    expect(root.right.value.value).toEqual(9);
    expect(root.left.left.value.value).toEqual(1);
  });

  test('with people', () => {
    const alice = new Person('Alice', 32, 'San Francisco');
    const bob = new Person('Bob', 29, 'Frankfurt');
    const juan = new Person('Juan', 41, 'Buenos Aires');

    const root = new Node(alice);
    root.add(bob);
    root.add(juan);

    const found = root.find(alice);
    expect(found.name).toEqual('Alice');
  });
});
