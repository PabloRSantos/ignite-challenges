import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

const userData = {
  email: "any_mail@mail.com",
  name: "any_name",
  password: "any_password",
}

const makeStatement = (user_id = 'any_id') => ({
  amount: 100,
  description: "test",
  type: OperationType.DEPOSIT,
  user_id,
})

describe("GetStatementOperation", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to get the statement operation", async () => {
    const user = await usersRepository.create(userData);

    const statement = await statementsRepository.create(makeStatement(user.id));

    const response = await getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: user.id as string,
    });

    expect(response).toEqual(statement);
  });

  it("should not be able to get the statement operation of a non-existent user", async () => {
    const statement = await statementsRepository.create(makeStatement());
    const response = getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: "non-existent",
    })

    await expect(response).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get an non-existent statement operation", async () => {
    const user = await usersRepository.create(userData);
    const response = getStatementOperationUseCase.execute({
      statement_id: "non-existent",
      user_id: user.id as string,
    })

    await expect(response).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
