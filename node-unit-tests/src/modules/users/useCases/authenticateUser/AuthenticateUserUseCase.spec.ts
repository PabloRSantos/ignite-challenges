import { hash } from "bcryptjs";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

const userData = {
  email: "any_email@mail.com",
  name: "any_name",
  password: "any_password",
}

describe("AuthenticateUserUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const createdUser = await usersRepository.create({
      ...userData,
      password: await hash(userData.password, 8)
    });
    const response = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password,
    });

    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("user", {
      id: createdUser.id,
      name: userData.name,
      email: userData.email,
    });
  });

  it("should not be able to authenticate with a non-existent user", async () => {
    const response = authenticateUserUseCase.execute({
      email: "non@existent.com",
      password: "non-existent",
    })

    await expect(response).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with a wrong password", async () => {
    await usersRepository.create(userData);
    const response = authenticateUserUseCase.execute({
      email: userData.email,
      password: "wrong-password",
    })
    await expect(response).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with a wrong email", async () => {
    await usersRepository.create(userData);
    const response = authenticateUserUseCase.execute({
      email: "non@existent.com",
      password: userData.password,
    })

    await expect(response).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
