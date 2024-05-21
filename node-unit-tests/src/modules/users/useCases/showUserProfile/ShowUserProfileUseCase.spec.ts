import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("ShowUserProfileUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able to show user profile', async () => {
    const data = {
      email: 'any_email@mail.com',
      name: 'any_name',
      password: 'any_password'
    }
    const createdUser = await usersRepository.create(data)
    const user = await showUserProfileUseCase.execute(createdUser.id as string)

    expect(user).toEqual(createdUser)
  })

  it('should not be able to show a non-existent profile', async () => {
    const response = showUserProfileUseCase.execute('non-existent-id')
    await expect(response).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
