import { Post } from "src/posts/entities/post.entity";
import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('user')
export class User {
    /** Matches Better Auth user.id (string). Do not use PrimaryGeneratedColumn or 'uuid' type. */
    @PrimaryColumn({ type: 'text' })
    id: string;

    @Column({ name: 'name', type: 'varchar', length: 500, nullable: true })
    name: string | null;

    @Column({ name: 'username', type: 'varchar', length: 255, unique: true, nullable: true })
    username: string | null;

    @Column({ name: 'image', type: 'varchar', length: 500, nullable: true })
    image: string | null;

    /** Better Auth may have null emails in some rows; keep nullable so synchronize does not alter the table. */
    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string | null;

    @Column({ name: 'emailVerified', type: 'boolean', default: false, nullable: true })
    emailVerified: boolean;

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;
}
