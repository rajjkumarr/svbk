import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  role: string;
  password: string;
};

@Injectable()
export class UsersService {
  private users: UserRecord[] = [];

  create(createUserDto: CreateUserDto) {
    const user: UserRecord = {
      id: `user-${Date.now()}`,
      email: createUserDto.email,
      name: createUserDto.name,
      role: createUserDto.role ?? 'user',
      password: createUserDto.password,
    };
    this.users.push(user);
    return this.toPublic(user);
  }

  findOneByEmail(email: string): UserRecord | undefined {
    return this.users.find((u) => u.email === email);
  }

  findAll() {
    return this.users.map((u) => this.toPublic(u));
  }

  findOne(id: string): Omit<UserRecord, 'password'> {
    const user = this.findOneRecord(id);
    return this.toPublic(user);
  }

  findOneRecord(id: string): UserRecord {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  private toPublic(user: UserRecord): Omit<UserRecord, 'password'> {
    const { password: _, ...rest } = user;
    return rest;
  }

  update(id: string, updateUserDto: UpdateUserDto): Omit<UserRecord, 'password'> {
    const user = this.findOneRecord(id);
    const updates = { ...updateUserDto };
    if (updates.password !== undefined) {
      user.password = updates.password;
      delete (updates as Partial<CreateUserDto>).password;
    }
    Object.assign(user, updates);
    return this.toPublic(user);
  }
}
