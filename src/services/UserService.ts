import { ISubscriptNotionDTO, IUserDTO } from "@types";
import { UserModel } from "../models";

export const findAll = () => {
  return UserModel.find();
};

export const findUser = ({ name }: { name: string }) => {
  return UserModel.findOne({ name });
};

export const createUser = (user: IUserDTO) => {
  return new UserModel(user).save();
};

export const deleteUser = (name: string) => {
  return UserModel.deleteOne({ name });
};

export const addNotion = ({ name, notion }: ISubscriptNotionDTO) => {
  return UserModel.updateOne({ name }, { $push: { notions: notion } });
};

export const delelteNotion = ({ name, notion }: ISubscriptNotionDTO) => {
  return UserModel.updateOne({ name }, { $pull: { notions: notion } });
};
