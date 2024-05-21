import { User } from "../../model/User";
import { IUsersRepository, ICreateUserDTO } from "../IUsersRepository";

class UsersRepository implements IUsersRepository {
  private users: User[];

  private static INSTANCE: UsersRepository;

  private constructor() {
    this.users = [];
  }

  public static getInstance(): UsersRepository {
    if (!UsersRepository.INSTANCE) {
      UsersRepository.INSTANCE = new UsersRepository();
    }

    return UsersRepository.INSTANCE;
  }

  create({ name, email }: ICreateUserDTO): User {
    const newUser = new User();

    Object.assign(newUser, {
      created_at: new Date(),
      updated_at: new Date(),
      name,
      email,
      admin: false,
    });

    this.users.push(newUser);
    return newUser;
  }

  findById(id: string): User | undefined {
    const user = this.users.find((findUser) => findUser.id === id);
    return user;
  }

  findByEmail(email: string): User | undefined {
    const user = this.users.find((findUser) => findUser.email === email);
    return user;
  }

  turnAdmin(receivedUser: User): User {
    const targetUserIndex = this.users.findIndex(
      (findUser) => findUser.id === receivedUser.id
    );

    const updatedUser = {
      ...receivedUser,
      admin: true,
      updated_at: new Date(),
    };
    this.users[targetUserIndex] = updatedUser;

    return updatedUser;
  }

  list(): User[] {
    return this.users;
  }
}

export { UsersRepository };
