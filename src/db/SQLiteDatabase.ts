import Database, { Database as SQLiteDatabaseType } from 'better-sqlite3';

export interface IDatabase {
  prepare(sql: string): IStatement;
  exec(sql: string): void;
}

export interface IStatement {
run(...params: any[]): any;
all<T = any>(): T[];
get<T = any>(...params: any[]): T | undefined;
}

export class SQLiteStatement implements IStatement {
  private statement: any;

  constructor(statement: any) {
    this.statement = statement;
  }

  run(...params: any[]): any {
    return this.statement.run(...params);
  }

  all<T = any>(): T[] {
    return this.statement.all();
  }

  get<T = any>(...params: any[]): T | undefined {
    return this.statement.get(...params);
  }
}

export class SQLiteDatabase implements IDatabase {
  private db: SQLiteDatabaseType;

  constructor(dbOrFilename: SQLiteDatabaseType | string) {
    if (typeof dbOrFilename === 'string') {
      this.db = new Database(dbOrFilename);
    } else {
      this.db = dbOrFilename;
    }
  }

  prepare(sql: string): IStatement {
    return new SQLiteStatement(this.db.prepare(sql));
  }

  exec(sql: string): void {
    this.db.exec(sql);
  }
}