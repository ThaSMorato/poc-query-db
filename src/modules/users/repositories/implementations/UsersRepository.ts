import { getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.find({
      where: {
        id: user_id,
      },
      relations: ["games"],
    });

    return user[0];
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * FROM users ORDER BY first_name"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const first_name_correct = first_name
      .toLowerCase()
      .split("")
      .map((x, i) => (i == 0 ? x.toUpperCase() : x))
      .join("");
    const last_name_correct = last_name
      .toLowerCase()
      .split("")
      .map((x, i) => (i == 0 ? x.toUpperCase() : x))
      .join("");
    return this.repository.query(
      "SELECT * FROM users WHERE first_name = $1 AND last_name = $2",
      [first_name_correct, last_name_correct]
    ); // Complete usando raw query
  }
}
