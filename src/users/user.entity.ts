import { Report } from './../reports/report.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: true;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Log after insert', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Log after update', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Log after remove', this.id);
  }
}
