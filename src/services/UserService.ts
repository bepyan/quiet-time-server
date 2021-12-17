import { INotion, ISubscriptNotionDTO, IUserDTO } from "@types";
import { UserModel } from "@models";

export const findAll = () => {
  return UserModel.find();
};

export const createUser = (user: IUserDTO) => {
  return new UserModel(user).save();
};

export const addNotion = ({ name, notion }: ISubscriptNotionDTO) => {
  return UserModel.updateOne({ name }, { $push: { notions: notion } });
};
