import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class UserAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  username!: string | null;

  @Column({ type: 'varchar', nullable: true, unique: true })
  email!: string | null;

  @Column({ type: 'varchar', nullable: true, unique: true })
  phone!: string | null;

  @Column({ default: '' })
  gender!: string;

  @Column({ type: 'varchar', nullable: true })
  passwordHash!: string | null;

  @Column({ type: 'varchar', nullable: true })
  googleSubject!: string | null;

  @Column({ default: false })
  emailVerified!: boolean;

  @Column({ default: false })
  phoneVerified!: boolean;

  /** Profile photo as a data-URL base64 string (`data:image/...;base64,...`), or null. */
  @Column({ type: 'text', nullable: true })
  avatarUrl!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
