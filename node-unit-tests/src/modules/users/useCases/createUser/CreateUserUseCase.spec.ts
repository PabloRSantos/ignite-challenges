
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

const userData = {
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'any_password'
}

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute(userData)

    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('email', userData.email)
    expect(user).toHaveProperty('name', userData.name)
  })

  it('should not be able to create a duplicated user', async () => {
    await createUserUseCase.execute(userData)
    const response = createUserUseCase.execute(userData)

    await expect(response).rejects.toBeInstanceOf(CreateUserError)
  })
})
